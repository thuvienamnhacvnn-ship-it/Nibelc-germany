"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, ExternalLink, ImagePlus, LoaderCircle, Pencil, RotateCcw, TriangleAlert } from "lucide-react";
import type { NoiDungDeSua } from "@/lib/quan-tri/noi-dung-csdl";
import type { NoiDungLuu } from "@/lib/quan-tri/noi-dung";
import { viecLuuNoiDung, viecMacDinhNoiDung } from "../viec-noi-dung";
import { AnhKho } from "../_chung/AnhKho";
import { HopChonAnh } from "../_chung/HopChonAnh";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { O, TabNgon, type Ngon } from "../_chung/form";
import { useChanRoi } from "../_chung/chan-roi";
import { chuLoi, gio, ngayGio } from "../_chung/dinh-dang";

/**
 * BANNER & NỘI DUNG — ảnh và chữ ở đầu mỗi trang của web.
 *
 * Sửa TẠI CHỖ ngay trong tấm của từng trang (không tách trang form riêng):
 * mỗi banner chỉ có hai ảnh và ba, bốn ô chữ, mở hẳn một trang cho chừng đó
 * là bắt nhân viên đi lại vô ích. Mỗi lúc chỉ MỘT mục ở trạng thái sửa.
 *
 * Form giữ GIÁ TRỊ ĐANG HIỆN TRÊN WEB (đã lưu đè lên mặc định) và gửi lại
 * toàn bộ; máy chủ tự bỏ những trường trùng mặc định, nên bảng chỉ chứa thứ
 * thật sự đã sửa và "Dùng lại" chữ mặc định là đủ để trả một ô về mặc định.
 */

const O_CHU = ["nhan", "tieuDe", "phuDe", "mo"] as const;
const NHAN_O: Record<(typeof O_CHU)[number], string> = { nhan: "Nhãn nhỏ", tieuDe: "Tiêu đề", phuDe: "Phụ đề", mo: "Mô tả" };
const NGON: Ngon[] = ["vi", "en", "de"];

type BanSua = { anh: string; anhDoc: string; chu: Record<Ngon, Record<string, string>> };
type Co = { rong: number | null; cao: number | null };

/** các ô chữ mà mục này có. Trang chủ: KHÔNG ô nào — tiêu đề trang chủ là ảnh thiết kế riêng (Sếp chốt chỉ đổi hai ảnh nền). */
/** "trang Đơn hàng" · riêng trang chủ ghi "Trang chủ" — tránh câu "banner trang Trang chủ" */
const tenBanner = (m: NoiDungDeSua) => (m.khoa === "trang-chu.banner" ? "Trang chủ" : `trang ${m.muc.tenTrang}`);

const oChuCua = (m: NoiDungDeSua) => (m.khoa === "trang-chu.banner" ? [] : O_CHU.filter((k) => k in m.muc.truong));

function banDau(m: NoiDungDeSua): BanSua {
  const o = oChuCua(m);
  const chu = {} as BanSua["chu"];
  for (const l of NGON) chu[l] = Object.fromEntries(o.map((k) => [k, m.hienTai[l][k] ?? ""]));
  return { anh: m.hienTai.vi.anh ?? "", anhDoc: m.hienTai.vi.anhDoc ?? "", chu };
}

export function DanhSachNoiDung({ ds }: { ds: NoiDungDeSua[] }) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();

  const [khoaSua, setKhoaSua] = useState<string | null>(null);
  const [ban, setBan] = useState<BanSua | null>(null);
  const [goc, setGoc] = useState("");
  const [ngon, setNgon] = useState<Ngon>("vi");
  const [dangLuu, setDangLuu] = useState(false);
  const [daLuu, setDaLuu] = useState<{ khoa: string; luc: string } | null>(null);
  const [chonAnh, setChonAnh] = useState<"anh" | "anhDoc" | null>(null);
  /** kích thước các ảnh vừa chọn trong phiên — để cảnh báo ảnh sẽ bị cắt nhiều */
  const [co, setCo] = useState<Record<string, Co>>({});
  const oTieuDe = useRef<HTMLDivElement>(null);

  const doi = !!ban && JSON.stringify(ban) !== goc;
  useChanRoi(doi);

  // vừa mở form: đặt tiêu điểm vào ô Tiêu đề (mục không có ô chữ thì thôi)
  useEffect(() => {
    if (khoaSua) oTieuDe.current?.querySelector<HTMLInputElement>("input")?.focus();
  }, [khoaSua]);

  function mo(m: NoiDungDeSua) {
    const vao = () => {
      const b = banDau(m);
      setBan(b);
      setGoc(JSON.stringify(b));
      setNgon("vi");
      setKhoaSua(m.khoa);
    };
    if (!doi) return vao();
    hoi({
      tieuDe: "Bỏ mọi thay đổi chưa lưu?",
      moTa: <p>Mục đang sửa dở sẽ trở về bản đã lưu gần nhất.</p>,
      nutHuy: "Tiếp tục sửa",
      nutXacNhan: "Bỏ thay đổi",
      onXacNhan: vao,
    });
  }
  function dong() {
    setKhoaSua(null);
    setBan(null);
  }
  function huy() {
    if (!doi) return dong();
    hoi({
      tieuDe: "Bỏ mọi thay đổi chưa lưu?",
      moTa: <p>Banner sẽ trở về bản đã lưu gần nhất.</p>,
      nutHuy: "Tiếp tục sửa",
      nutXacNhan: "Bỏ thay đổi",
      onXacNhan: dong,
    });
  }

  async function luu(m: NoiDungDeSua) {
    if (!ban || dangLuu) return;
    setDangLuu(true);
    try {
      const coChu = oChuCua(m).length > 0;
      // Mục không có ô chữ ở đây (trang chủ): giữ nguyên phần chữ đã lưu từ trước, chỉ thay ảnh —
      // `giaTri` THAY HẲN bản đã lưu, gửi thiếu là xoá mất.
      const giaTri: NoiDungLuu = {
        chung: { anh: ban.anh, anhDoc: ban.anhDoc },
        vi: coChu ? ban.chu.vi : (m.daLuu.vi ?? {}),
        en: coChu ? ban.chu.en : (m.daLuu.en ?? {}),
        de: coChu ? ban.chu.de : (m.daLuu.de ?? {}),
      };
      const r = await viecLuuNoiDung(m.khoa, giaTri);
      if (r.loi) return tb.loi(`Không lưu được: ${r.loi}`);
      tb.xoaLoi();
      tb.xong(`Đã lưu banner ${tenBanner(m)}.`);
      setDaLuu({ khoa: m.khoa, luc: gio(new Date()) });
      dong();
      router.refresh();
    } catch (e) {
      tb.loi(`Không lưu được: ${chuLoi(e)}`);
    } finally {
      setDangLuu(false);
    }
  }

  function veMacDinh(m: NoiDungDeSua) {
    hoi({
      tieuDe: `Khôi phục banner ${tenBanner(m)} về mặc định?`,
      moTa: <p>Ảnh và chữ ở cả ba ngôn ngữ sẽ trở về bản gốc của web. Bản đang dùng vẫn lấy lại được ở mục Nhật ký.</p>,
      nutXacNhan: "Khôi phục mặc định",
      dangChay: "Đang khôi phục…",
      onXacNhan: async () => {
        const r = await viecMacDinhNoiDung(m.khoa);
        if (r.loi) return r.loi;
        tb.xong(`Đã khôi phục banner ${tenBanner(m)} về mặc định.`);
        router.refresh();
      },
    });
  }

  /** ảnh lệch xa khung web cắt → cảnh báo (không chặn) */
  function sapBiCat(truong: "anh" | "anhDoc", url: string) {
    const c = co[url];
    if (!c?.rong || !c.cao) return false;
    const tyLe = c.rong / c.cao;
    return truong === "anh" ? tyLe < 2.5 : tyLe > 1.5;
  }

  return (
    <div className="qt-nd-ds">
      {ds.map((m) => {
        const dangSua = khoaSua === m.khoa && !!ban;
        const oChu = oChuCua(m);
        const laTrangChu = m.khoa === "trang-chu.banner";
        const anhRieng = (t: "anh" | "anhDoc") => !!m.daLuu.chung?.[t];
        const chuThich = (t: "anh" | "anhDoc") => `${t === "anh" ? "Máy tính" : "Điện thoại"} · ${anhRieng(t) ? "ảnh đã đổi" : "ảnh mặc định"}`;

        if (!dangSua) {
          const v = m.hienTai.vi;
          return (
            <section key={m.khoa} className="qt-nd" aria-label={`Banner trang ${m.muc.tenTrang}`}>
              <div className="qt-nd-luoi">
                <div className="qt-nd-anh">
                  <AnhKho src={v.anh} alt={`Banner máy tính của trang ${m.muc.tenTrang}`} className="qt-nd-khung-mt" chuTrong="Chưa có ảnh" />
                  <p className="qt-nd-chu-thich">{chuThich("anh")}</p>
                  <div className="qt-nd-dt">
                    <AnhKho src={v.anhDoc} alt={`Banner điện thoại của trang ${m.muc.tenTrang}`} className="qt-nd-khung-dt" nho />
                    <p className="qt-nd-chu-thich">{laTrangChu && !v.anhDoc ? "Điện thoại · đang chạy video nền, chưa đặt ảnh" : chuThich("anhDoc")}</p>
                  </div>
                </div>

                <div className="qt-nd-chu">
                  <div className="qt-nd-dau">
                    <h2>{m.muc.tenTrang}</h2>
                    <span className={`qt-nhan ${m.daSua ? "xanh" : "an"}`}>{m.daSua ? "Đã chỉnh sửa" : "Mặc định"}</span>
                    {oChu.length > 0 &&
                      (["en", "de"] as const).map((l) => {
                        const coBan = !!m.hienTai[l].tieuDe?.trim();
                        const ten = l === "en" ? "tiếng Anh" : "tiếng Đức";
                        return (
                          <span key={l} className={`qt-nhan ${coBan ? "hien" : "an"}`} title={coBan ? `Đã có bản ${ten}` : `Chưa có bản ${ten}`} aria-label={coBan ? `Đã có bản ${ten}` : `Chưa có bản ${ten}`}>
                            {l.toUpperCase()}
                          </span>
                        );
                      })}
                    <a className="qt-lien-ket" href={m.muc.trang} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} aria-hidden />
                      Xem trang
                    </a>
                  </div>

                  {laTrangChu ? (
                    <p className="qt-nd-sua-luc">Tiêu đề trang chủ là ảnh thiết kế riêng nên chưa sửa được ở đây. Mục này chỉ đổi hai ảnh nền.</p>
                  ) : (
                    oChu.map((k) => (
                      <div key={k} className="qt-nd-truong">
                        <span>{NHAN_O[k]}</span>
                        <p className={`${k === "tieuDe" ? "qt-to" : ""}${v[k]?.trim() ? "" : " qt-cho"}`}>{v[k]?.trim() || "(trống)"}</p>
                      </div>
                    ))
                  )}
                  {m.daSua && m.suaLuc && <p className="qt-nd-sua-luc">Sửa lần cuối: {ngayGio(m.suaLuc)}</p>}
                  {daLuu?.khoa === m.khoa && (
                    <p className="qt-thanh-luu-tt qt-da-luu" aria-live="polite">
                      <CircleCheck aria-hidden />
                      Đã lưu lúc {daLuu.luc}.
                    </p>
                  )}

                  <div className="qt-hang-nut">
                    <button type="button" className="qt-chinh" onClick={() => mo(m)}>
                      <Pencil aria-hidden />
                      Sửa banner này
                    </button>
                    {m.daSua && (
                      <button type="button" onClick={() => veMacDinh(m)}>
                        <RotateCcw aria-hidden />
                        Khôi phục mặc định
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // ── đang sửa ──
        const khoiAnh = (t: "anh" | "anhDoc", tieuDe: string, ghiChu: string) => {
          const macDinh = m.macDinh.vi[t] ?? "";
          const gt = ban[t];
          return (
            <div className="qt-nd-khoi">
              <h3>{tieuDe}</h3>
              <div className={t === "anhDoc" ? "qt-nd-dt qt-sua" : undefined} style={t === "anhDoc" ? { marginTop: 0 } : undefined}>
                <AnhKho src={gt} alt={tieuDe} className={t === "anh" ? "qt-nd-khung-mt" : "qt-nd-khung-dt"} chuTrong={t === "anh" ? "Chưa có ảnh" : undefined} nho={t === "anhDoc"} />
                <div>
                  <p className="qt-nd-chu-thich">{ghiChu}</p>
                  {sapBiCat(t, gt) && (
                    <p className="qt-canh-bao-o">
                      <TriangleAlert aria-hidden />
                      Ảnh này sẽ bị cắt nhiều khi hiện trên web.
                    </p>
                  )}
                  <div className="qt-hang-nut">
                    <button type="button" className="qt-nut-nho" onClick={() => setChonAnh(t)}>
                      <ImagePlus aria-hidden />
                      Đổi ảnh
                    </button>
                    {gt !== macDinh && (
                      // chưa lưu nên không cần hộp xác nhận
                      <button type="button" className="qt-nut-nho" onClick={() => setBan({ ...ban, [t]: macDinh })}>
                        <RotateCcw aria-hidden />
                        Dùng ảnh mặc định
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };

        const datChu = (k: string, v: string) => setBan({ ...ban, chu: { ...ban.chu, [ngon]: { ...ban.chu[ngon], [k]: v } } });

        return (
          <section key={m.khoa} className="qt-nd qt-nd-dang-sua" aria-label={`Đang sửa banner trang ${m.muc.tenTrang}`}>
            <div className="qt-nd-luoi">
              <div className="qt-nd-anh">
                {khoiAnh(
                  "anh",
                  "Ảnh máy tính",
                  laTrangChu ? "Ảnh phủ kín màn hình đầu trang chủ ở máy tính. Nên dùng ảnh ngang từ 1920×1080 px." : "Nên dùng ảnh ngang 1920×560 px. Chừa trống nửa trái vì tấm chữ nằm ở đó.",
                )}
                {khoiAnh(
                  "anhDoc",
                  "Ảnh điện thoại",
                  laTrangChu
                    ? "Để mặc định thì điện thoại chạy video nền như hiện nay. Chọn ảnh dọc thì ảnh thay cho video."
                    : "Nên dùng ảnh dọc hoặc gần vuông. Để mặc định thì web dùng ảnh điện thoại sẵn có.",
                )}
              </div>

              <div className="qt-nd-chu">
                <div className="qt-nd-dau">
                  <h2>{m.muc.tenTrang}</h2>
                </div>
                {oChu.length === 0 ? (
                  <p className="qt-nd-sua-luc">Tiêu đề trang chủ là ảnh thiết kế riêng nên chưa sửa được ở đây. Mục này chỉ đổi hai ảnh nền.</p>
                ) : (
                  <>
                    <TabNgon
                      ngon={ngon}
                      doi={setNgon}
                      co={{ en: !!ban.chu.en.tieuDe?.trim(), de: !!ban.chu.de.tieuDe?.trim() }}
                      chuVi="Bản tiếng Việt."
                      chuDich="Để trống thì bản này dùng chữ mặc định của web."
                    />
                    {oChu.map((k) => {
                      const gt = ban.chu[ngon][k] ?? "";
                      const macDinh = m.macDinh[ngon][k] ?? "";
                      const boDuoc = !!m.muc.truong[k]?.boTrongDuoc;
                      const ghiChu =
                        k === "nhan" ? (
                          "Dòng chữ nhỏ phía trên tiêu đề."
                        ) : k === "tieuDe" ? (
                          <>{gt.length} ký tự</>
                        ) : k === "mo" ? (
                          `Điện thoại chỉ hiện hai dòng đầu.${boDuoc ? " Để trống thì web bỏ hẳn dòng mô tả." : ""}`
                        ) : boDuoc ? (
                          "Để trống thì web bỏ hẳn dòng này."
                        ) : undefined;
                      return (
                        <div key={k} ref={k === "tieuDe" ? oTieuDe : undefined}>
                          <O nhan={NHAN_O[k]} ghiChu={ghiChu} canhBao={k === "tieuDe" && gt.length > 60 ? "Tiêu đề dài sẽ xuống 3–4 dòng trên điện thoại." : undefined}>
                            {(p) =>
                              k === "mo" ? (
                                <textarea {...p} rows={3} maxLength={1000} value={gt} onChange={(e) => datChu(k, e.target.value)} />
                              ) : (
                                <input {...p} type="text" maxLength={200} value={gt} onChange={(e) => datChu(k, e.target.value)} />
                              )
                            }
                          </O>
                          {macDinh && (
                            <div className="qt-goc-hang">
                              <div className="qt-goc">
                                <b>Mặc định: </b>
                                {macDinh}
                              </div>
                              {gt !== macDinh && (
                                <button type="button" aria-label={`Dùng lại chữ mặc định cho ô ${NHAN_O[k]}`} onClick={() => datChu(k, macDinh)}>
                                  Dùng lại
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="qt-nd-chan">
              <p className={`qt-thanh-luu-tt${doi ? " qt-doi" : ""}`} aria-live="polite">
                {doi ? "Có thay đổi chưa lưu." : "Chưa có thay đổi."}
              </p>
              <span style={{ marginLeft: "auto" }} />
              <button type="button" disabled={dangLuu} onClick={huy}>
                Huỷ
              </button>
              <button type="button" className="qt-chinh qt-nut-luu" disabled={!doi || dangLuu} aria-busy={dangLuu} onClick={() => void luu(m)}>
                {dangLuu && <LoaderCircle className="qt-quay" aria-hidden />}
                {dangLuu ? "Đang lưu…" : "Lưu banner"}
              </button>
            </div>
          </section>
        );
      })}

      <HopChonAnh
        mo={!!chonAnh}
        tieuDe="Chọn ảnh banner"
        onDong={() => setChonAnh(null)}
        onChon={([a]) => {
          if (!a || !ban || !chonAnh) return;
          setCo((c) => ({ ...c, [a.url]: { rong: a.rong, cao: a.cao } }));
          setBan({ ...ban, [chonAnh]: a.url });
        }}
      />
    </div>
  );
}
