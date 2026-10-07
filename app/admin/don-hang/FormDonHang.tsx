"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ImageOff, MapPin, Plus, Trash2, X } from "lucide-react";
import type { Job } from "@/types/job";
import { chuoiLuong, noiLamViec } from "@/types/job";
import { donHang as tuDienDon } from "@/lib/i18n/dict/don-hang";
import { viecAnHien, viecLuuDonHang, viecNoiBat, viecXoaDonHang } from "../viec";
import { viecHoanTacXoa } from "../_tam";
import { AnhKho } from "../_chung/AnhKho";
import { HopChonAnh } from "../_chung/HopChonAnh";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { CongTac, O, TabNgon, TamAnhBia, ThanhLuu, type Ngon } from "../_chung/form";
import { datChuaLuu, useChanRoi } from "../_chung/chan-roi";
import { DUONG } from "../_chung/duong";
import { chuLoi, gio, taoSlug } from "../_chung/dinh-dang";

export type DonSua = {
  id: string;
  duLieu: Record<string, unknown>;
  dich: Record<string, unknown>;
  hien: boolean;
  noiBat: boolean;
};
export type NganhChon = { id: string; ten: string; tenEn: string; tenDe: string; /** ảnh chung của ngành — web dùng khi đơn chưa có ảnh bìa */ anh: string };

type ViTri = { name: string; count: number | null; salaryFrom: number | null; salaryTo: number | null };
type Loi = Partial<Record<"title" | "slug" | "id" | "luong", string>>;

/** chuyển mảng ↔ văn bản mỗi dòng một mục: nhân viên gõ danh sách dễ hơn JSON */
const mangThanhChu = (v: unknown) => (Array.isArray(v) ? v.join("\n") : "");
const chuThanhMang = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const soHoacNull = (s: string) => (s === "" ? null : Number(s));
const RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function FormDonHang({ ban, moi, nganhNghe }: { ban: DonSua; moi: boolean; nganhNghe: NganhChon[] }) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- du_lieu là JSON tự do trong CSDL
  const [d, setD] = useState<Record<string, any>>(ban.duLieu);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dich, setDich] = useState<Record<string, any>>(ban.dich);
  const [hien, setHien] = useState(ban.hien);
  const [noiBat, setNoiBat] = useState(ban.noiBat);
  const [ngon, setNgon] = useState<Ngon>("vi");
  const [loi, setLoi] = useState<Loi>({});
  const [lanKiem, setLanKiem] = useState(0);
  const [dangLuu, setDangLuu] = useState(false);
  const [daLuuLuc, setDaLuuLuc] = useState<string>();
  const [moHop, setMoHop] = useState(false);
  const [keo, setKeo] = useState<{ tu: number; den: number } | null>(null);
  const [docLen, setDocLen] = useState("");

  /* Bản đã lưu gần nhất, dạng chuỗi: so chuỗi là biết form có thay đổi hay
     không mà khỏi phải theo dõi từng ô. */
  const nay = useMemo(() => JSON.stringify({ d, dich, hien, noiBat }), [d, dich, hien, noiBat]);
  const [goc, setGoc] = useState(nay);
  const doi = nay !== goc;
  useChanRoi(doi);

  const dat = (k: string, v: unknown) => setD((x) => ({ ...x, [k]: v }));

  /* Đơn MỚI: đường dẫn và mã tự điền theo tên, để nhân viên khỏi phải tự nghĩ một chuỗi không
     dấu. Hễ họ gõ tay vào ô nào thì thôi tự điền ô đó — không giành lại thứ người ta vừa sửa. */
  const [tuSua, setTuSua] = useState({ slug: false, id: false });
  function datTen(v: string) {
    if (!moi || ngon !== "vi") return;
    const s = taoSlug(v);
    setD((x) => ({ ...x, ...(tuSua.slug ? {} : { slug: s }), ...(tuSua.id ? {} : { id: s }) }));
  }
  const datDich = (l: "en" | "de", k: string, v: unknown) =>
    setDich((x) => {
      const o = { ...(x[l] ?? {}) };
      // Xoá hẳn khoá khi để trống, KHÔNG lưu chuỗi rỗng / mảng rỗng: trang công
      // khai dựa vào "có khoá hay không" để quyết định ẩn mục, chuỗi rỗng sẽ
      // thành một dòng trắng trên web.
      const rong = Array.isArray(v) ? v.every((y) => !y) : !String(v ?? "").trim();
      if (rong) delete o[k];
      else o[k] = v;
      const r = { ...x, [l]: o };
      if (Object.keys(o).length === 0) delete r[l];
      return r;
    });

  /** giá trị đang hiện trong ô, theo tab ngôn ngữ đang mở */
  const gt = (k: string): string => (ngon === "vi" ? (d[k] ?? "") : (dich[ngon]?.[k] ?? ""));
  const datGt = (k: string, v: string) => (ngon === "vi" ? dat(k, v) : datDich(ngon, k, v));
  const gtMang = (k: string) => mangThanhChu(ngon === "vi" ? d[k] : dich[ngon]?.[k]);
  const datMang = (k: string, s: string) => (ngon === "vi" ? dat(k, chuThanhMang(s)) : datDich(ngon, k, chuThanhMang(s)));
  /** bản tiếng Việt để đối chiếu — chỉ hiện ở tab en/de */
  const goc_ = (v: unknown) => (ngon === "vi" ? undefined : Array.isArray(v) ? v.join("\n") : String(v ?? ""));
  const duoiNgon = ngon === "en" ? "/en" : "/de";

  // ── vị trí tuyển ──
  const viTri: ViTri[] = Array.isArray(d.positions) ? d.positions : [];
  const datViTri = (i: number, doiGi: Partial<ViTri>) => dat("positions", viTri.map((v, j) => (j === i ? { ...v, ...doiGi } : v)));
  function boViTri(i: number) {
    dat("positions", viTri.filter((_, j) => j !== i));
    // tên dịch đi theo CHỈ SỐ vị trí: bỏ vị trí nào thì bỏ luôn tên dịch ở chỉ số đó
    for (const l of ["en", "de"] as const) {
      const t = dich[l]?.positions;
      if (Array.isArray(t)) datDich(l, "positions", t.filter((_: unknown, j: number) => j !== i));
    }
  }
  function datTenViTriDich(i: number, v: string) {
    if (ngon === "vi") return;
    const t: (string | null)[] = viTri.map((_, j) => dich[ngon]?.positions?.[j] ?? null);
    // ô để trống lưu `null` (không phải ""): web gặp null thì dùng lại tên gốc,
    // gặp "" thì in ra một dòng trống.
    t[i] = v.trim() ? v : null;
    datDich(ngon, "positions", t);
  }

  // ── thư viện ảnh ──
  const thuVien: string[] = Array.isArray(d.gallery) ? d.gallery : [];
  function chuyenAnh(tu: number, den: number) {
    if (tu === den || den < 0 || den >= thuVien.length) return;
    const m = [...thuVien];
    const [x] = m.splice(tu, 1);
    m.splice(den, 0, x!);
    dat("gallery", m);
    setDocLen(`Đã chuyển ảnh sang vị trí ${den + 1} trên ${m.length}.`);
  }

  // ── kiểm trước khi gửi ──
  function kiem(): Loi {
    const l: Loi = {};
    const slug = String(d.slug ?? "").trim();
    if (!String(d.title ?? "").trim()) l.title = "Chưa nhập tên đơn hàng.";
    if (!slug) l.slug = "Chưa nhập đường dẫn.";
    else if (!RE_SLUG.test(slug)) l.slug = "Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
    if (moi && !String(d.id ?? "").trim()) l.id = "Chưa nhập mã đơn.";
    const min = Number(d.salary?.min ?? 0);
    const max = Number(d.salary?.max ?? 0);
    if (max > 0 && min > max) l.luong = "Lương từ đang lớn hơn lương đến.";
    return l;
  }
  // có lỗi: cuộn tới ô lỗi đầu tiên và đặt tiêu điểm vào đó
  useEffect(() => {
    if (!lanKiem) return;
    const o = document.querySelector<HTMLElement>('.qt-form-2cot [aria-invalid="true"]');
    o?.scrollIntoView({ block: "center" });
    o?.focus({ preventScroll: true });
  }, [lanKiem]);

  async function luu() {
    if (dangLuu || !doi) return;
    const l = kiem();
    setLoi(l);
    if (Object.keys(l).length > 0) {
      setNgon("vi"); // mọi ô bắt buộc đều nằm ở tab tiếng Việt
      setLanKiem((n) => n + 1);
      return;
    }
    setDangLuu(true);
    const id = moi ? String(d.id).trim() : ban.id;
    const ten = String(d.title).trim();
    const banGui = nay;
    try {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("du_lieu", JSON.stringify({ ...d, id, featured: noiBat }));
      fd.set("dich", JSON.stringify(dich));
      const r = await viecLuuDonHang(null, fd);
      if ("loi" in r) {
        tb.loi(r.loi);
        if (r.loi.includes("Đường dẫn")) {
          setLoi({ slug: r.loi });
          setLanKiem((n) => n + 1);
        }
        return;
      }
      // Hiện/ẩn và nổi bật nằm ở cột riêng của bảng, có việc riêng — gọi nối
      // sau khi lưu để cả hai công tắc "đi cùng nút Lưu" như nhân viên mong.
      if (moi ? !hien : hien !== ban.hien) await viecAnHien(id, hien);
      if (!moi && noiBat !== ban.noiBat) {
        const k = await viecNoiBat(id, noiBat);
        if (k.loi) throw new Error(k.loi);
      }
      tb.xoaLoi();
      tb.xong(`Đã lưu đơn "${ten}".`);
      setGoc(banGui);
      setDaLuuLuc(gio(new Date()));
      datChuaLuu(false);
      if (moi) router.replace(DUONG.don(id));
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
        const g = JSON.parse(goc) as { d: typeof d; dich: typeof dich; hien: boolean; noiBat: boolean };
        setD(g.d);
        setDich(g.dich);
        setHien(g.hien);
        setNoiBat(g.noiBat);
        setLoi({});
      },
    });
  }

  function xoa() {
    const ten = String(ban.duLieu.title ?? ban.id);
    hoi({
      tieuDe: `Xoá đơn "${ten}"?`,
      anh: String(ban.duLieu.image ?? ""),
      moTa: <p>Đơn sẽ biến mất khỏi web ngay. Vẫn khôi phục được ở mục Nhật ký.</p>,
      nutXacNhan: "Xoá đơn hàng",
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        await viecXoaDonHang(ban.id);
        datChuaLuu(false);
        tb.xong(`Đã xoá đơn "${ten}".`, {
          hoanTac: () => {
            void viecHoanTacXoa("don_hang", ban.id).then((r) => {
              if (r.loi) return tb.loi(`Không khôi phục được: ${r.loi}`);
              tb.xong(`Đã khôi phục đơn "${ten}".`);
              router.refresh();
            });
          },
        });
        router.push(DUONG.donHang);
      },
    });
  }

  // ── xem trước thẻ: theo tab ngôn ngữ đang mở ──
  const nganhDangChon = nganhNghe.find((n) => n.id === d.industryId);
  const xem = {
    ten: gt("title"),
    tp: gt("city") || String(d.city ?? ""),
    nuoc: gt("state") || String(d.state ?? ""),
    nganh: nganhDangChon ? (ngon === "vi" ? nganhDangChon.ten : ngon === "en" ? nganhDangChon.tenEn : nganhDangChon.tenDe) : "",
  };
  const donXem = { ...d, city: xem.tp, state: xem.nuoc, salary: { min: Number(d.salary?.min ?? 0), max: Number(d.salary?.max ?? 0) } } as unknown as Job;
  const tx = tuDienDon[ngon];

  return (
    <>
      <div className="qt-form-2cot">
        <div className="qt-cot-trai">
          {/* ---------- tab ngôn ngữ: áp cho Nội dung, Vị trí tuyển, Yêu cầu và quyền lợi ---------- */}
          <div className="qt-tam qt-tam-tab">
            <TabNgon
              ngon={ngon}
              doi={setNgon}
              co={{ en: !!dich.en?.title, de: !!dich.de?.title }}
              chuVi="Bản gốc — bắt buộc."
              chuDich="Để trống trường nào thì bản này ẩn trường đó, không hiện tiếng Việt lẫn vào."
            />
            <h2>Nội dung</h2>
            <O
              nhan="Tên đơn hàng"
              batBuoc={ngon === "vi"}
              loi={ngon === "vi" ? loi.title : undefined}
              ghiChu={ngon === "vi" ? undefined : `Chưa có tên thì đơn này không hiện ở bản ${duoiNgon}.`}
              goc={goc_(d.title)}
            >
              {(p) => (
                <input
                  {...p}
                  type="text"
                  value={gt("title")}
                  onChange={(e) => {
                    datGt("title", e.target.value);
                    datTen(e.target.value);
                  }}
                />
              )}
            </O>
            <O nhan="Mô tả công việc" goc={goc_(d.description)}>
              {(p) => <textarea {...p} rows={4} value={gt("description")} onChange={(e) => datGt("description", e.target.value)} />}
            </O>
            <div className="qt-luoi-o">
              <O nhan="Thành phố" goc={goc_(d.city)}>
                {(p) => <input {...p} type="text" value={gt("city")} onChange={(e) => datGt("city", e.target.value)} />}
              </O>
              <O nhan="Nước" goc={goc_(d.state)}>
                {(p) => <input {...p} type="text" value={gt("state")} onChange={(e) => datGt("state", e.target.value)} />}
              </O>
              <O nhan="Kinh nghiệm" goc={goc_(d.experience)}>
                {(p) => <input {...p} type="text" value={gt("experience")} onChange={(e) => datGt("experience", e.target.value)} />}
              </O>
            </div>
          </div>

          {/* ---------- những trường KHÔNG dịch: con số thì dịch gì ---------- */}
          <div className="qt-tam">
            <h2>Thu nhập và số suất</h2>
            <div className="qt-luoi-o qt-hep">
              <O nhan="Lương từ (€)" loi={loi.luong}>
                {(p) => <input {...p} type="number" min={0} value={d.salary?.min ?? 0} onChange={(e) => dat("salary", { ...d.salary, min: Number(e.target.value) })} />}
              </O>
              <O nhan="Lương đến (€)" ghiChu="Để 0 thì web ghi “Theo thoả thuận”.">
                {(p) => <input {...p} type="number" min={0} value={d.salary?.max ?? 0} onChange={(e) => dat("salary", { ...d.salary, max: Number(e.target.value) })} />}
              </O>
              <O nhan="Tính theo">
                {(p) => (
                  <select {...p} value={d.salaryType ?? "tháng"} onChange={(e) => dat("salaryType", e.target.value)}>
                    <option value="tháng">tháng</option>
                    <option value="giờ">giờ</option>
                  </select>
                )}
              </O>
              <O nhan="Số suất">
                {(p) => <input {...p} type="number" min={1} value={d.vacancies ?? 1} onChange={(e) => dat("vacancies", Number(e.target.value))} />}
              </O>
              <O nhan="Giờ / tuần" ghiChu="Để trống thì ghi “Theo hợp đồng”.">
                {(p) => <input {...p} type="number" min={0} value={d.hours ?? ""} onChange={(e) => dat("hours", soHoacNull(e.target.value))} />}
              </O>
            </div>
          </div>

          <div className="qt-tam">
            <div className="qt-tam-dau">
              <h2>Vị trí tuyển</h2>
              <span>{viTri.length} vị trí</span>
            </div>
            <p className="qt-phu">
              {ngon === "vi"
                ? "Các vị trí trong đơn, hiện ở trang chi tiết. Số người và lương để trống nếu thông báo tuyển không ghi."
                : `Chỉ dịch TÊN vị trí. Để trống thì bản ${duoiNgon} dùng lại tên tiếng Việt. Thêm, bớt vị trí làm ở tab Tiếng Việt.`}
            </p>
            {viTri.length === 0 && <p className="qt-ghi-chu">Đơn chưa có vị trí nào.</p>}
            {viTri.map((v, i) =>
              ngon === "vi" ? (
                <div key={i} className="qt-vt">
                  <O nhan={`Tên vị trí ${i + 1}`}>{(p) => <input {...p} type="text" value={v.name ?? ""} onChange={(e) => datViTri(i, { name: e.target.value })} />}</O>
                  <O nhan="Số người">
                    {(p) => <input {...p} type="number" min={0} value={v.count ?? ""} onChange={(e) => datViTri(i, { count: soHoacNull(e.target.value) })} />}
                  </O>
                  <O nhan="Lương từ (€)">
                    {(p) => <input {...p} type="number" min={0} value={v.salaryFrom ?? ""} onChange={(e) => datViTri(i, { salaryFrom: soHoacNull(e.target.value) })} />}
                  </O>
                  <O nhan="Lương đến (€)">
                    {(p) => <input {...p} type="number" min={0} value={v.salaryTo ?? ""} onChange={(e) => datViTri(i, { salaryTo: soHoacNull(e.target.value) })} />}
                  </O>
                  <button type="button" className="qt-nut-icon qt-do" aria-label={`Bỏ vị trí ${i + 1}`} title="Bỏ vị trí này" onClick={() => boViTri(i)}>
                    <Trash2 aria-hidden />
                  </button>
                </div>
              ) : (
                <O key={i} nhan={`Tên vị trí ${i + 1}`} goc={v.name}>
                  {(p) => <input {...p} type="text" value={dich[ngon]?.positions?.[i] ?? ""} onChange={(e) => datTenViTriDich(i, e.target.value)} />}
                </O>
              ),
            )}
            {ngon === "vi" && (
              <button
                type="button"
                className="qt-khoi-them"
                onClick={() => dat("positions", [...viTri, { name: "", count: null, salaryFrom: null, salaryTo: null }])}
              >
                <Plus aria-hidden />
                Thêm vị trí
              </button>
            )}
          </div>

          <div className="qt-tam">
            <h2>Phân loại</h2>
            <div className="qt-luoi-o">
              <O nhan="Ngành nghề">
                {(p) => (
                  <select {...p} value={d.industryId ?? ""} onChange={(e) => dat("industryId", e.target.value)}>
                    {nganhNghe.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.ten}
                      </option>
                    ))}
                  </select>
                )}
              </O>
              <O nhan="Hình thức">
                {(p) => (
                  <select {...p} value={d.employmentType ?? ""} onChange={(e) => dat("employmentType", e.target.value)}>
                    <option>Toàn thời gian</option>
                    <option>Thời vụ</option>
                    <option>Ca kíp</option>
                  </select>
                )}
              </O>
              <O nhan="Chương trình">
                {(p) => (
                  <select {...p} value={d.programType ?? ""} onChange={(e) => dat("programType", e.target.value)}>
                    <option>Lao động</option>
                    <option>Du học nghề</option>
                  </select>
                )}
              </O>
              <O nhan="Ngoại ngữ yêu cầu">
                {(p) => (
                  <select {...p} value={d.language ?? ""} onChange={(e) => dat("language", e.target.value === "" ? null : e.target.value)}>
                    <option value="">Không yêu cầu / chưa rõ</option>
                    <option value="de">Tiếng Đức</option>
                    <option value="en">Tiếng Anh</option>
                  </select>
                )}
              </O>
              <O nhan="Trình độ" ghiChu="Chỉ điền khi đơn thật sự yêu cầu — thông báo tuyển không nói thì để trống.">
                {(p) => (
                  <input {...p} type="text" value={d.languageLevel ?? ""} onChange={(e) => dat("languageLevel", e.target.value)} placeholder="A2 – B1" disabled={!d.language} />
                )}
              </O>
            </div>
          </div>

          <div className="qt-tam">
            <h2>Yêu cầu và quyền lợi</h2>
            <p className="qt-phu">
              Mỗi dòng là một ý.{ngon !== "vi" && ` Đang sửa bản ${ngon === "en" ? "tiếng Anh" : "tiếng Đức"} — để trống thì bản ${duoiNgon} ẩn mục này.`}
            </p>
            <O nhan="Yêu cầu" goc={goc_(d.requirements)}>
              {(p) => <textarea {...p} rows={5} value={gtMang("requirements")} onChange={(e) => datMang("requirements", e.target.value)} />}
            </O>
            <O nhan="Quyền lợi" goc={goc_(d.benefits)}>
              {(p) => <textarea {...p} rows={5} value={gtMang("benefits")} onChange={(e) => datMang("benefits", e.target.value)} />}
            </O>
          </div>

          <div className="qt-tam">
            <h2>Đường dẫn</h2>
            <O
              nhan="Đường dẫn trên web"
              batBuoc
              loi={loi.slug}
              ghiChu={
                <>
                  nibelcgermany.de/don-hang/<b>{d.slug || "…"}</b> — đổi cái này là link cũ chết, cân nhắc.
                </>
              }
            >
              {(p) => <input {...p} type="text" value={d.slug ?? ""} onChange={(e) => { setTuSua((x) => ({ ...x, slug: true })); dat("slug", e.target.value.trim()); }} placeholder="thu-hoach-dau-tay-tai-graz" />}
            </O>
            {moi && (
              <O nhan="Mã đơn" batBuoc loi={loi.id} ghiChu="Tự điền theo tên, sửa tay được. Đặt xong không đổi được.">
                {(p) => <input {...p} type="text" value={d.id ?? ""} onChange={(e) => { setTuSua((x) => ({ ...x, id: true })); dat("id", e.target.value.trim()); }} placeholder="gr-260401-abc" />}
              </O>
            )}
          </div>
        </div>

        <div className="qt-cot-phai">
          <TamAnhBia
            className="qt-len-dau"
            anh={String(d.image ?? "")}
            // một ô ảnh bìa ghi vào CẢ image lẫn thumbnail (Sếp chốt) — máy chủ cũng tự ép như vậy
            doi={(u) => setD((x) => ({ ...x, image: u, thumbnail: u }))}
            chuTrong="Web đang dùng tạm ảnh chung của ngành."
            macDinh={nganhNghe.find((n) => n.id === d.industryId)?.anh}
            chuMacDinh="Đơn chưa có ảnh bìa riêng — web đang dùng tạm ảnh chung của ngành này."
          />

          <div className="qt-tam qt-len-dau">
            <div className="qt-tam-dau">
              <h2>Thư viện ảnh</h2>
              <span>{thuVien.length} ảnh</span>
            </div>
            <p className="qt-phu">Các ảnh hiện trong trang chi tiết đơn. Kéo để đổi thứ tự.</p>
            <div className="qt-tv-luoi">
              {thuVien.map((u, i) => (
                <div
                  key={u + i}
                  className={`qt-tv-o${keo?.tu === i ? " qt-nguon" : ""}${keo && keo.den === i && keo.tu !== i ? " qt-dich" : ""}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(i));
                    setKeo({ tu: i, den: i });
                  }}
                  onDragOver={(e) => {
                    if (!keo) return;
                    e.preventDefault();
                    if (keo.den !== i) setKeo({ tu: keo.tu, den: i });
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (keo) chuyenAnh(keo.tu, i);
                    setKeo(null);
                  }}
                  onDragEnd={() => setKeo(null)}
                >
                  <AnhKho src={u} alt={`Ảnh ${i + 1} trong thư viện của đơn`} nho />
                  <span className="qt-tv-so" aria-hidden>
                    {i + 1}
                  </span>
                  {/* nút đổi chỗ: đường thay cho kéo-thả (bàn phím, điện thoại) */}
                  <div className="qt-tv-nut">
                    <button type="button" className="qt-nut-icon" aria-label={`Đưa ảnh ${i + 1} lên trước`} title="Đưa lên trước" disabled={i === 0} onClick={() => chuyenAnh(i, i - 1)}>
                      <ChevronLeft aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="qt-nut-icon"
                      aria-label={`Đưa ảnh ${i + 1} ra sau`}
                      title="Đưa ra sau"
                      disabled={i === thuVien.length - 1}
                      onClick={() => chuyenAnh(i, i + 1)}
                    >
                      <ChevronRight aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="qt-nut-icon"
                      aria-label={`Gỡ ảnh ${i + 1} khỏi thư viện ảnh của đơn`}
                      title="Gỡ khỏi thư viện ảnh của đơn"
                      onClick={() => dat("gallery", thuVien.filter((_, j) => j !== i))}
                    >
                      <X aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
              <div className="qt-tv-o">
                <button type="button" className="qt-tv-them" onClick={() => setMoHop(true)}>
                  <Plus aria-hidden />
                  Thêm ảnh
                </button>
              </div>
            </div>
            {thuVien.length === 0 && <p className="qt-ghi-chu">Chưa có ảnh nào trong thư viện của đơn.</p>}
            <span className="qt-an-nhin" aria-live="polite">
              {docLen}
            </span>
          </div>

          <div className="qt-tam qt-xuong-cuoi">
            <h2>Trạng thái</h2>
            <CongTac nhan="Hiện trên web" phu={hien ? "Khách đang thấy đơn này." : "Đơn đang ẩn, khách không thấy."} bat={hien} doi={setHien} />
            <CongTac nhan="Đơn nổi bật" phu="Được ưu tiên ở trang chủ và đầu danh sách." bat={noiBat} doi={setNoiBat} />
          </div>

          <div className="qt-tam qt-xuong-cuoi">
            <h2>Xem trước thẻ</h2>
            <p className="qt-phu">Thẻ này sẽ hiện như vậy ở trang Đơn hàng của web.</p>
            <div className="qt-xem" aria-hidden="true">
              <div className="qt-xem-the">
                <div className="qt-xem-anh">
                  {d.image ? <img src={String(d.image)} alt="" /> : <ImageOff />}
                  {xem.tp && (
                    <span className="qt-xem-vien qt-tp">
                      <span className="qt-xem-co">
                        <i />
                        <i />
                        <i />
                      </span>
                      {xem.tp}
                    </span>
                  )}
                  {xem.nganh && <span className="qt-xem-vien qt-nganh">{xem.nganh}</span>}
                </div>
                <div className="qt-xem-than">
                  <div className={`qt-xem-ten${xem.ten ? "" : " qt-cho"}`}>{xem.ten || "Tên đơn hàng"}</div>
                  <div className="qt-xem-doi-tac">{tx.doiTacTai(xem.tp || "…")}</div>
                  <div className="qt-xem-hang">
                    <div className="qt-xem-luong">{chuoiLuong(donXem, ngon)}</div>
                    <div className="qt-xem-sl">
                      {tx.soLuong}
                      <b>
                        {Number(d.vacancies ?? 0)} {ngon === "vi" ? "người" : ""}
                      </b>
                    </div>
                  </div>
                  <div className="qt-xem-noi">
                    <MapPin />
                    {noiLamViec(donXem) || "…"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThanhLuu doi={doi} dangLuu={dangLuu} daLuuLuc={daLuuLuc} onLuu={luu} onHuy={huy} nutXoa={moi ? undefined : "Xoá đơn này"} onXoa={xoa} />

      <HopChonAnh
        mo={moHop}
        nhieu
        tieuDe="Chọn ảnh cho thư viện của đơn"
        daCo={thuVien}
        onDong={() => setMoHop(false)}
        onChon={(ds) => dat("gallery", [...thuVien, ...ds.map((a) => a.url).filter((u) => !thuVien.includes(u))])}
      />
    </>
  );
}
