"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ChevronsUpDown, FileText, GripVertical, Plus, Trash2 } from "lucide-react";
import type { Khoi } from "@/data/articles";
import { NHOM_BAI } from "@/data/articles";
import type { BanDichBai, LoaiBai, NoiDungBai } from "@/lib/quan-tri/bai-viet";
import { viecAnHienBaiViet, viecLuuBaiViet, viecXoaBaiViet } from "../viec-bai-viet";
import { viecHoanTacXoa } from "../_tam";
import { Rong } from "../_chung/Rong";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { CongTac, O, TabNgon, TamAnhBia, ThanhLuu, type Ngon } from "../_chung/form";
import { datChuaLuu, useChanRoi } from "../_chung/chan-roi";
import { DUONG } from "../_chung/duong";
import { chuLoi, gio, taoSlug } from "../_chung/dinh-dang";

/**
 * FORM BÀI VIẾT — thân bài là một dãy KHỐI; mỗi khối đúng bốn phần mà web vẽ
 * theo thứ tự cố định: tiêu đề → đoạn văn → gạch đầu dòng → lưu ý.
 *
 * Trong form, đoạn văn và gạch đầu dòng là VĂN BẢN THÔ (đoạn cách nhau một
 * dòng trống, gạch mỗi dòng một ý) và chỉ tách thành mảng lúc bấm Lưu. Tách
 * rồi ghép lại sau từng phím gõ thì dòng trống nhân viên vừa xuống bị nuốt
 * mất, không tài nào gõ nổi đoạn thứ hai.
 *
 * Bản dịch en/de đi theo CHỈ SỐ khối: mỗi hàng giữ luôn ba bản của cùng một
 * khối, nên đổi chỗ hay xoá ở tab Tiếng Việt thì bản dịch tự đi theo.
 */

export type BaiSua = {
  id: string;
  slug: string;
  loai: LoaiBai;
  hien: boolean;
  duLieu: NoiDungBai;
  dich: Partial<Record<"en" | "de", BanDichBai>>;
};

type KS = { tieuDe: string; doan: string; gach: string; luuY: string };
type Hang = { k: number; vi: KS; en: KS; de: KS };
type Loi = { tieuDe?: string; slug?: string; khoi?: Record<number, string>; chung?: string };

const RONG: KS = { tieuDe: "", doan: "", gach: "", luuY: "" };
const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TEN_BAN = { en: "Bản tiếng Anh", de: "Bản tiếng Đức" } as const;

const vaoKS = (k: Khoi | undefined): KS => (k ? { tieuDe: k.tieuDe ?? "", doan: (k.doan ?? []).join("\n\n"), gach: (k.gach ?? []).join("\n"), luuY: k.luuY ?? "" } : { ...RONG });
const tachDoan = (s: string) => s.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const tachGach = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const trongKS = (s: KS) => !s.tieuDe.trim() && !s.doan.trim() && !s.gach.trim() && !s.luuY.trim();

/** Phần nào rỗng thì XOÁ HẲN khoá — web dựa vào "có khoá hay không" để vẽ, mảng rỗng thành một khối trống. */
function raKhoi(s: KS): Khoi {
  const o: Khoi = { tieuDe: s.tieuDe.trim() };
  const doan = tachDoan(s.doan);
  const gach = tachGach(s.gach);
  if (doan.length) o.doan = doan;
  if (gach.length) o.gach = gach;
  if (s.luuY.trim()) o.luuY = s.luuY.trim();
  return o;
}

export function FormBaiViet({ ban, moi, anhMacDinh }: { ban: BaiSua; moi: boolean; anhMacDinh?: string }) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();
  const demK = useRef(0);

  const [loai, setLoai] = useState<LoaiBai>(ban.loai);
  const [slug, setSlug] = useState(ban.slug);
  const [idMoi, setIdMoi] = useState("");
  /** nhân viên đã gõ tay vào ô đường dẫn → thôi tự điền theo tiêu đề */
  const [slugTuSua, setSlugTuSua] = useState(false);
  const [hien, setHien] = useState(ban.hien);
  const [d, setD] = useState({
    tieuDe: ban.duLieu.tieuDe ?? "",
    tomTat: ban.duLieu.tomTat ?? "",
    nhom: ban.duLieu.nhom || NHOM_BAI[0],
    phut: ban.duLieu.phut ? String(ban.duLieu.phut) : "",
    anhBia: ban.duLieu.anhBia ?? "",
  });
  const [dich, setDich] = useState({
    en: { tieuDe: ban.dich.en?.tieuDe ?? "", tomTat: ban.dich.en?.tomTat ?? "" },
    de: { tieuDe: ban.dich.de?.tieuDe ?? "", tomTat: ban.dich.de?.tomTat ?? "" },
  });
  const [khoi, setKhoi] = useState<Hang[]>(() =>
    (ban.duLieu.khoi ?? []).map((k, i) => ({ k: ++demK.current, vi: vaoKS(k), en: vaoKS(ban.dich.en?.khoi?.[i]), de: vaoKS(ban.dich.de?.khoi?.[i]) })),
  );
  const [dong, setDong] = useState<Set<number>>(new Set());
  const [ngon, setNgon] = useState<Ngon>("vi");
  const [loi, setLoi] = useState<Loi>({});
  const [lanKiem, setLanKiem] = useState(0);
  const [vuaThem, setVuaThem] = useState<number | null>(null);
  const [keo, setKeo] = useState<{ tu: number; den: number } | null>(null);
  const [docLen, setDocLen] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [daLuuLuc, setDaLuuLuc] = useState<string>();

  const nay = useMemo(() => JSON.stringify({ loai, slug, idMoi, hien, d, dich, khoi }), [loai, slug, idMoi, hien, d, dich, khoi]);
  const [goc, setGoc] = useState(nay);
  const doi = nay !== goc;
  useChanRoi(doi);

  const gt = (k: "tieuDe" | "tomTat") => (ngon === "vi" ? d[k] : dich[ngon][k]);
  const datGt = (k: "tieuDe" | "tomTat", v: string) => (ngon === "vi" ? setD((x) => ({ ...x, [k]: v })) : setDich((x) => ({ ...x, [ngon]: { ...x[ngon], [k]: v } })));
  const datKhoi = (k: number, truong: keyof KS, v: string) => setKhoi((ds) => ds.map((h) => (h.k === k ? { ...h, [ngon]: { ...h[ngon], [truong]: v } } : h)));
  const duoiNgon = ngon === "en" ? "/en" : "/de";

  // khối vừa thêm: mở sẵn, cuộn tới và đặt tiêu điểm vào ô tiêu đề
  useEffect(() => {
    if (vuaThem === null) return;
    const o = document.getElementById(`khoi-${vuaThem}`);
    o?.scrollIntoView({ block: "center" });
    o?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    setVuaThem(null);
  }, [vuaThem]);
  useEffect(() => {
    if (!lanKiem) return;
    const o = document.querySelector<HTMLElement>('.qt-form-2cot [aria-invalid="true"]');
    o?.scrollIntoView({ block: "center" });
    o?.focus({ preventScroll: true });
  }, [lanKiem]);

  function themKhoi() {
    const k = ++demK.current;
    setKhoi((ds) => [...ds, { k, vi: { ...RONG }, en: { ...RONG }, de: { ...RONG } }]);
    setVuaThem(k);
  }
  function chuyen(tu: number, den: number) {
    if (tu === den || den < 0 || den >= khoi.length) return;
    const m = [...khoi];
    const [x] = m.splice(tu, 1);
    m.splice(den, 0, x!);
    setKhoi(m);
    setDocLen(`Đã chuyển khối ${den < tu ? "lên" : "xuống"} vị trí ${den + 1} trên ${m.length}.`);
  }
  function xoaKhoi(i: number) {
    const h = khoi[i]!;
    const bo = () => setKhoi((ds) => ds.filter((x) => x.k !== h.k));
    // khối hoàn toàn trống (cả ba ngôn ngữ) thì xoá thẳng, không hỏi
    if (trongKS(h.vi) && trongKS(h.en) && trongKS(h.de)) return bo();
    hoi({
      tieuDe: `Xoá khối ${i + 1} "${h.vi.tieuDe.trim() || "chưa có tiêu đề"}"?`,
      moTa: <p>Bản dịch tiếng Anh và tiếng Đức của khối này cũng bị xoá. Chưa bấm Lưu thì vẫn bỏ được thay đổi.</p>,
      nutXacNhan: "Xoá khối",
      onXacNhan: bo,
    });
  }

  async function luu() {
    if (dangLuu || !doi) return;
    const l: Loi = {};
    const s = slug.trim();
    if (!d.tieuDe.trim()) l.tieuDe = "Chưa nhập tiêu đề bài.";
    if (!s) l.slug = "Chưa nhập đường dẫn.";
    else if (!RE_SLUG.test(s)) l.slug = "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";

    // khối trống trơn ở bản tiếng Việt thì bỏ (kèm bản dịch của nó) trước khi gửi
    const hang = khoi.filter((h) => !trongKS(h.vi));
    const loiKhoi: Record<number, string> = {};
    for (const h of hang) if (!h.vi.tieuDe.trim()) loiKhoi[h.k] = `Khối ${khoi.indexOf(h) + 1} chưa có tiêu đề.`;
    if (Object.keys(loiKhoi).length) l.khoi = loiKhoi;
    if (hang.length === 0) l.chung = "Bài cần ít nhất một khối.";

    if (Object.keys(l).length > 0) {
      setLoi(l);
      setNgon("vi");
      setDong(new Set()); // mở hết các khối để ô lỗi lộ ra
      if (l.chung) tb.loi(l.chung);
      setLanKiem((n) => n + 1);
      return;
    }

    /* Bản dịch: máy chủ lưu danh sách khối đã dịch LIỀN nhau và web ghép với
       bản gốc theo chỉ số. Bỏ trống một khối ở giữa là mọi khối phía sau lệch
       chỗ — chặn ngay ở đây và nói rõ khối nào. Bỏ trống các khối CUỐI thì
       không sao (dịch dần từ trên xuống). */
    const dichGui: Partial<Record<"en" | "de", BanDichBai>> = {};
    for (const lg of ["en", "de"] as const) {
      const cuoi = hang.reduce((m, h, i) => (trongKS(h[lg]) ? m : i), -1);
      const phan = hang.slice(0, cuoi + 1);
      const hongGiua = phan.findIndex((h) => trongKS(h[lg]));
      const thieuTen = phan.findIndex((h) => !trongKS(h[lg]) && !h[lg].tieuDe.trim());
      if (hongGiua >= 0 || thieuTen >= 0) {
        setLoi({});
        setNgon(lg);
        setDong(new Set());
        return tb.loi(
          hongGiua >= 0
            ? `${TEN_BAN[lg]}: khối ${hongGiua + 1} chưa dịch nhưng khối phía sau đã dịch. Dịch nốt khối ${hongGiua + 1} rồi lưu, kẻo các khối sau lệch chỗ.`
            : `${TEN_BAN[lg]}: khối ${thieuTen + 1} chưa có tiêu đề.`,
        );
      }
      const o: BanDichBai = {};
      if (dich[lg].tieuDe.trim()) o.tieuDe = dich[lg].tieuDe.trim();
      if (dich[lg].tomTat.trim()) o.tomTat = dich[lg].tomTat.trim();
      if (phan.length) o.khoi = phan.map((h) => raKhoi(h[lg]));
      if (Object.keys(o).length) dichGui[lg] = o;
    }

    setLoi({});
    setDangLuu(true);
    const banGui = nay;
    try {
      const fd = new FormData();
      fd.set("id", moi ? idMoi.trim() : ban.id);
      if (moi) fd.set("moi", "1");
      fd.set("loai", loai);
      fd.set("slug", s);
      fd.set(
        "du_lieu",
        JSON.stringify({
          // giữ nguyên những khoá form không có ô nhập (icon…) — không được làm rơi
          ...ban.duLieu,
          tieuDe: d.tieuDe.trim(),
          tomTat: d.tomTat.trim(),
          nhom: loai === "cam-nang" ? d.nhom : "",
          phut: d.phut === "" ? undefined : Number(d.phut),
          anhBia: d.anhBia || undefined,
          khoi: hang.map((h) => raKhoi(h.vi)),
        }),
      );
      fd.set("dich", JSON.stringify(dichGui));
      const r = await viecLuuBaiViet(null, fd);
      if ("loi" in r) {
        tb.loi(r.loi);
        if (r.loi.includes("Đường dẫn") || r.loi.includes("mang mã")) {
          setLoi({ slug: r.loi });
          setNgon("vi");
          setLanKiem((n) => n + 1);
        }
        return;
      }
      if (moi ? !hien : hien !== ban.hien) {
        const k = await viecAnHienBaiViet(r.id, hien);
        if (k.loi) throw new Error(k.loi);
      }
      tb.xoaLoi();
      tb.xong(`Đã lưu bài "${d.tieuDe.trim()}".`);
      setGoc(banGui);
      setDaLuuLuc(gio(new Date()));
      datChuaLuu(false);
      if (moi) router.replace(DUONG.bai(r.id));
      else router.refresh();
    } catch (e) {
      tb.loi(`Không lưu được: ${chuLoi(e)}`);
    } finally {
      setDangLuu(false);
    }
  }

  function huy() {
    hoi({
      tieuDe: "Bỏ mọi thay đổi chưa lưu?",
      moTa: <p>Form sẽ trở về bản đã lưu gần nhất.</p>,
      nutHuy: "Tiếp tục sửa",
      nutXacNhan: "Bỏ thay đổi",
      onXacNhan: () => {
        const g = JSON.parse(goc) as { loai: LoaiBai; slug: string; idMoi: string; hien: boolean; d: typeof d; dich: typeof dich; khoi: Hang[] };
        setLoai(g.loai);
        setSlug(g.slug);
        setIdMoi(g.idMoi);
        setHien(g.hien);
        setD(g.d);
        setDich(g.dich);
        setKhoi(g.khoi);
        setLoi({});
      },
    });
  }

  function xoa() {
    const ten = ban.duLieu.tieuDe || ban.id;
    hoi({
      tieuDe: `Xoá bài "${ten}"?`,
      anh: ban.duLieu.anhBia ?? "",
      moTa: <p>Bài sẽ biến mất khỏi web ngay. Vẫn khôi phục được ở mục Nhật ký.</p>,
      nutXacNhan: "Xoá bài viết",
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        const r = await viecXoaBaiViet(ban.id);
        if (r.loi) return r.loi;
        datChuaLuu(false);
        tb.xong(`Đã xoá bài "${ten}".`, {
          hoanTac: () => {
            void viecHoanTacXoa("bai_viet", ban.id).then((k) => {
              if (k.loi) return tb.loi(`Không khôi phục được: ${k.loi}`);
              tb.xong(`Đã khôi phục bài "${ten}".`);
              router.refresh();
            });
          },
        });
        router.push(DUONG.baiViet);
      },
    });
  }

  const laVi = ngon === "vi";

  return (
    <>
      <div className="qt-form-2cot">
        <div className="qt-cot-trai">
          <div className="qt-tam qt-tam-tab">
            <TabNgon
              ngon={ngon}
              doi={setNgon}
              co={{ en: !!dich.en.tieuDe.trim(), de: !!dich.de.tieuDe.trim() }}
              chuVi="Bản gốc — bắt buộc."
              chuDich="Dịch đủ từng khối. Thêm, xoá, đổi thứ tự khối chỉ làm được ở tab Tiếng Việt."
            />
            <h2>Tiêu đề và tóm tắt</h2>
            <O
              nhan="Tiêu đề"
              batBuoc={laVi}
              loi={laVi ? loi.tieuDe : undefined}
              ghiChu={laVi ? undefined : `Chưa có tiêu đề thì bài này không hiện ở bản ${duoiNgon}.`}
              goc={laVi ? undefined : d.tieuDe}
            >
              {(p) => (
                <input
                  {...p}
                  type="text"
                  maxLength={200}
                  value={gt("tieuDe")}
                  onChange={(e) => {
                    datGt("tieuDe", e.target.value);
                    // bài MỚI: đường dẫn tự điền theo tiêu đề tiếng Việt (mã bài để trống = lấy theo đường dẫn)
                    if (moi && laVi && !slugTuSua) setSlug(taoSlug(e.target.value));
                  }}
                />
              )}
            </O>
            <O
              nhan="Tóm tắt"
              ghiChu={
                <>
                  Hiện dưới tiêu đề ở danh sách bài. Nên 1–2 câu. <b>{gt("tomTat").length} ký tự</b>
                </>
              }
              goc={laVi ? undefined : d.tomTat}
            >
              {(p) => <textarea {...p} rows={3} maxLength={800} value={gt("tomTat")} onChange={(e) => datGt("tomTat", e.target.value)} />}
            </O>
          </div>

          <div className="qt-tam">
            <div className="qt-tam-dau">
              <h2>Thân bài</h2>
              <span>{khoi.length} khối</span>
            </div>
            <p className="qt-phu">
              Bài gồm nhiều khối. Mỗi khối có một tiêu đề, bên dưới là đoạn văn, gạch đầu dòng và lưu ý — phần nào không dùng thì để trống.
            </p>

            {khoi.length === 0 ? (
              <Rong icon={FileText} tieuDe="Bài chưa có khối nào" moTa={laVi ? "Thêm khối đầu tiên để bắt đầu viết." : "Thêm khối ở tab Tiếng Việt trước, rồi quay lại đây để dịch."} gon>
                {laVi && (
                  <button type="button" className="qt-chinh" onClick={themKhoi}>
                    <Plus aria-hidden />
                    Thêm khối
                  </button>
                )}
              </Rong>
            ) : (
              <div className="qt-khoi-ds">
                {khoi.map((h, i) => {
                  const s = h[ngon];
                  const thu = dong.has(h.k);
                  const soDoanVi = tachDoan(h.vi.doan).length;
                  const soGachVi = tachGach(h.vi.gach).length;
                  const soDoan = tachDoan(s.doan).length;
                  const soGach = tachGach(s.gach).length;
                  return (
                    <div
                      key={h.k}
                      id={`khoi-${h.k}`}
                      className={`qt-khoi${keo?.tu === i ? " qt-nguon" : ""}${keo && keo.den === i && keo.tu !== i ? " qt-dich" : ""}`}
                      onDragOver={(e) => {
                        if (!keo) return;
                        e.preventDefault();
                        if (keo.den !== i) setKeo({ tu: keo.tu, den: i });
                      }}
                      onDrop={(e) => {
                        if (!keo) return;
                        e.preventDefault();
                        chuyen(keo.tu, i);
                        setKeo(null);
                      }}
                    >
                      <div className="qt-khoi-dau">
                        {laVi && (
                          <span
                            className="qt-khoi-nam"
                            draggable
                            title="Kéo để đổi thứ tự"
                            aria-hidden
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", String(i));
                              setKeo({ tu: i, den: i });
                            }}
                            onDragEnd={() => setKeo(null)}
                          >
                            <GripVertical />
                          </span>
                        )}
                        <b>Khối {i + 1}</b>
                        <span className={s.tieuDe.trim() ? undefined : "qt-cho"}>{s.tieuDe.trim() || "(chưa có tiêu đề)"}</span>
                        <div>
                          {laVi && (
                            <>
                              <button type="button" className="qt-nut-icon" aria-label={`Đưa khối ${i + 1} lên`} title="Đưa khối lên" disabled={i === 0} onClick={() => chuyen(i, i - 1)}>
                                <ChevronUp aria-hidden />
                              </button>
                              <button
                                type="button"
                                className="qt-nut-icon"
                                aria-label={`Đưa khối ${i + 1} xuống`}
                                title="Đưa khối xuống"
                                disabled={i === khoi.length - 1}
                                onClick={() => chuyen(i, i + 1)}
                              >
                                <ChevronDown aria-hidden />
                              </button>
                              <button type="button" className="qt-nut-icon qt-do" aria-label={`Xoá khối ${i + 1}`} title="Xoá khối" onClick={() => xoaKhoi(i)}>
                                <Trash2 aria-hidden />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            className="qt-nut-icon"
                            aria-label={thu ? `Mở khối ${i + 1}` : `Thu gọn khối ${i + 1}`}
                            title={thu ? "Mở khối" : "Thu gọn khối"}
                            aria-expanded={!thu}
                            onClick={() =>
                              setDong((cu) => {
                                const m = new Set(cu);
                                if (m.has(h.k)) m.delete(h.k);
                                else m.add(h.k);
                                return m;
                              })
                            }
                          >
                            <ChevronsUpDown aria-hidden />
                          </button>
                        </div>
                      </div>

                      {!thu && (
                        <div className="qt-khoi-than">
                          <O nhan="Tiêu đề khối" batBuoc={laVi} loi={laVi ? loi.khoi?.[h.k] : undefined} goc={laVi ? undefined : h.vi.tieuDe}>
                            {(p) => <input {...p} type="text" value={s.tieuDe} onChange={(e) => datKhoi(h.k, "tieuDe", e.target.value)} />}
                          </O>
                          <O
                            nhan="Đoạn văn"
                            ghiChu="Mỗi đoạn cách nhau một dòng trống."
                            goc={laVi ? undefined : h.vi.doan}
                            canhBao={!laVi && soDoan > 0 && soDoan !== soDoanVi ? `Bản tiếng Việt có ${soDoanVi} đoạn, bản này đang có ${soDoan}.` : undefined}
                          >
                            {(p) => (
                              <textarea
                                {...p}
                                // tự giãn theo nội dung: đoạn văn dài mà ô chỉ 5 dòng thì phải cuộn trong ô rất khó soát
                                rows={Math.min(24, Math.max(5, s.doan.split("\n").length + 1))}
                                value={s.doan}
                                onChange={(e) => datKhoi(h.k, "doan", e.target.value)}
                              />
                            )}
                          </O>
                          <O
                            nhan="Gạch đầu dòng"
                            ghiChu="Mỗi dòng là một ý."
                            goc={laVi ? undefined : h.vi.gach}
                            canhBao={!laVi && soGach > 0 && soGach !== soGachVi ? `Bản tiếng Việt có ${soGachVi} gạch đầu dòng, bản này đang có ${soGach}.` : undefined}
                          >
                            {(p) => <textarea {...p} rows={Math.min(16, Math.max(4, s.gach.split("\n").length + 1))} value={s.gach} onChange={(e) => datKhoi(h.k, "gach", e.target.value)} />}
                          </O>
                          <O nhan="Lưu ý" ghiChu="Hiện thành hộp nhấn mạnh ở cuối khối. Để trống thì không có hộp." goc={laVi ? undefined : h.vi.luuY}>
                            {(p) => <textarea {...p} rows={2} className="qt-khoi-luu-y" style={{ minHeight: 64 }} value={s.luuY} onChange={(e) => datKhoi(h.k, "luuY", e.target.value)} />}
                          </O>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {laVi && khoi.length > 0 && (
              <button type="button" className="qt-khoi-them" onClick={themKhoi}>
                <Plus aria-hidden />
                Thêm khối
              </button>
            )}
            <span className="qt-an-nhin" aria-live="polite">
              {docLen}
            </span>
          </div>
        </div>

        <div className="qt-cot-phai">
          <TamAnhBia className="qt-len-dau" anh={d.anhBia} doi={(u) => setD((x) => ({ ...x, anhBia: u }))} chuTrong="Bài sẽ hiện ảnh mặc định của web."
            macDinh={anhMacDinh}
            chuMacDinh="Bài chưa có ảnh bìa riêng — web đang dùng ảnh minh hoạ này."
          />

          <div className="qt-tam">
            <h2>Thông tin bài</h2>
            <div className="qt-o">
              <label id="nhan-loai">
                Loại bài<span className="qt-sao"> *</span>
              </label>
              <div className="qt-doan-chon" role="radiogroup" aria-labelledby="nhan-loai">
                {(
                  [
                    ["cam-nang", "Cẩm nang"],
                    ["cong-dong", "Cộng đồng"],
                  ] as const
                ).map(([k, chu]) => (
                  <button key={k} type="button" role="radio" aria-checked={loai === k} onClick={() => setLoai(k)}>
                    {chu}
                  </button>
                ))}
              </div>
            </div>
            <O nhan="Nhóm" ghiChu={loai === "cong-dong" ? "Bài cộng đồng không chia nhóm." : undefined}>
              {(p) => (
                <select {...p} value={d.nhom} disabled={loai === "cong-dong"} onChange={(e) => setD((x) => ({ ...x, nhom: e.target.value }))}>
                  {NHOM_BAI.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              )}
            </O>
            <O nhan="Thời gian đọc (phút)" ghiChu="Để trống thì máy tự ước lượng theo độ dài bài.">
              {(p) => <input {...p} type="number" min={1} max={120} value={d.phut} onChange={(e) => setD((x) => ({ ...x, phut: e.target.value }))} />}
            </O>
            <O
              nhan="Đường dẫn trên web"
              batBuoc
              loi={loi.slug}
              ghiChu={
                <>
                  nibelcgermany.de/cam-nang/<b>{slug || "…"}</b> — đổi cái này là link cũ chết, cân nhắc.
                </>
              }
            >
              {(p) => <input {...p} type="text" value={slug} onChange={(e) => { setSlugTuSua(true); setSlug(e.target.value.trim()); }} placeholder="hoc-tieng-duc-bao-lau" />}
            </O>
            {moi && (
              <O nhan="Mã bài" ghiChu="Để trống thì lấy theo đường dẫn. Đặt xong không đổi được.">
                {(p) => <input {...p} type="text" value={idMoi} onChange={(e) => setIdMoi(e.target.value.trim())} placeholder={slug || "hoc-tieng-duc-bao-lau"} />}
              </O>
            )}
          </div>

          <div className="qt-tam qt-xuong-cuoi">
            <h2>Trạng thái</h2>
            <CongTac nhan="Hiện trên web" phu={hien ? "Khách đang thấy bài này." : "Bài đang ẩn, khách không thấy."} bat={hien} doi={setHien} />
          </div>
        </div>
      </div>

      <ThanhLuu doi={doi} dangLuu={dangLuu} daLuuLuc={daLuuLuc} onLuu={luu} onHuy={huy} nutXoa={moi ? undefined : "Xoá bài này"} onXoa={xoa} />
    </>
  );
}
