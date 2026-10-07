"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Link2,
  Maximize2,
  Newspaper,
  PanelsTopLeft,
  Replace,
  Search,
  SearchX,
  SquareCheck,
  Tag,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from "lucide-react";
import type { Route } from "next";
import type { Anh } from "@/lib/quan-tri/kho-anh";
import { viecLietKeAnh, viecSuaAnh, viecXoaAnh } from "../viec-anh";
import { AnhKho } from "../_chung/AnhKho";
import { DauTrang } from "../_chung/DauTrang";
import { Rong } from "../_chung/Rong";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { CHAP_NHAN, CHU_GIOI_HAN, DanhSachTai, guiTep, kiemTep, useTaiLen } from "../_chung/tai-len";
import { boDau, chuLoi, dungLuong, ngayGio, soVN, tenDinhDang } from "../_chung/dinh-dang";

/**
 * THƯ VIỆN ẢNH — tải lên (kéo-thả hoặc chọn tệp), xem, gắn nhãn, thay, xoá.
 *
 * Nút thao tác trên mỗi ô ảnh LUÔN hiện chứ không đợi rê chuột: nhân viên
 * dùng cả điện thoại, mà điện thoại không có rê chuột.
 */

/** Một nơi đang dùng ảnh — máy chủ dựng sẵn từ đơn hàng, bài viết, banner. */
export type NoiDung = { loai: "don" | "bai" | "banner"; chu: string; duong: Route };
export type BanDoDung = Record<string, NoiDung[]>;

const MOI_LAN = 60;
const MOI_TRANG = 200;
const CHUA_NHAN = "\u0000chua-nhan";
const CHUA_DUNG = "\u0000chua-dung";
const ICON_NOI = { don: ClipboardList, bai: Newspaper, banner: PanelsTopLeft };

const coAnh = (a: Anh) => `${a.rong && a.cao ? `${a.rong}×${a.cao} · ` : ""}${dungLuong(a.dungLuong)}`;

export function ThuVienAnh({ dsDau, tongDau, nangDau, dungO }: { dsDau: Anh[]; tongDau: number; nangDau: number; dungO: BanDoDung }) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();
  const oTep = useRef<HTMLInputElement>(null);

  const [ds, setDs] = useState(dsDau);
  const [tong, setTong] = useState(tongDau);
  const [nang, setNang] = useState(nangDau);
  const [trang, setTrang] = useState(1);
  const [dangNap, setDangNap] = useState(false);
  const [tim, setTim] = useState("");
  const [chip, setChip] = useState("");
  const [hien, setHien] = useState(MOI_LAN);
  const [cheDoChon, setCheDoChon] = useState(false);
  const [chon, setChon] = useState<Set<string>>(new Set());
  const [xem, setXem] = useState<{ id: string; vaoNhan: boolean } | null>(null);
  const [keo, setKeo] = useState(false);

  const noiDung = (a: Anh) => dungO[a.url] ?? [];

  const tai = useTaiLen((a) => {
    setDs((cu) => [a, ...cu]);
    setTong((n) => n + 1);
    setNang((n) => n + a.dungLuong);
  });

  // Esc thoát chế độ chọn (khi không có hộp thoại nào đang mở)
  useEffect(() => {
    if (!cheDoChon) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) thoatChon();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [cheDoChon]);

  const nhanCo = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of ds) for (const n of a.nhan) m.set(n, (m.get(n) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"));
  }, [ds]);
  const soChuaNhan = ds.filter((a) => a.nhan.length === 0).length;
  const soChuaDung = ds.filter((a) => noiDung(a).length === 0).length;

  const loc = useMemo(() => {
    const t = boDau(tim.trim());
    return ds.filter((a) => {
      if (chip === CHUA_NHAN ? a.nhan.length > 0 : chip === CHUA_DUNG ? (dungO[a.url] ?? []).length > 0 : chip && !a.nhan.includes(chip)) return false;
      return !t || boDau(a.tenGoc).includes(t) || a.nhan.some((n) => boDau(n).includes(t));
    });
  }, [ds, tim, chip, dungO]);
  const thay = loc.slice(0, hien);
  const coLoc = !!tim.trim() || !!chip;
  const conNua = hien < loc.length || ds.length < tong;
  function xoaLoc() {
    setTim("");
    setChip("");
    setHien(MOI_LAN);
  }

  async function taiThem() {
    // hết phần đã nạp mà kho còn → nạp trang kế rồi mới mở rộng phần hiện
    if (hien + MOI_LAN > loc.length && ds.length < tong) {
      setDangNap(true);
      try {
        const r = await viecLietKeAnh({ trang: trang + 1, moiTrang: MOI_TRANG });
        setDs((cu) => [...cu, ...r.ds.filter((a) => !cu.some((c) => c.id === a.id))]);
        setTrang((n) => n + 1);
        setTong(r.tong);
      } catch (e) {
        tb.loi(`Không tải thêm được: ${chuLoi(e)}`);
      }
      setDangNap(false);
    }
    setHien((n) => n + MOI_LAN);
  }

  // ── chọn nhiều ──
  function batTat(id: string) {
    setCheDoChon(true); // tích ô đầu tiên ở chế độ thường → tự vào chế độ chọn
    setChon((cu) => {
      const m = new Set(cu);
      if (m.has(id)) m.delete(id);
      else m.add(id);
      return m;
    });
  }
  function thoatChon() {
    setCheDoChon(false);
    setChon(new Set());
  }

  function boKhoiDs(ids: string[]) {
    const bo = ds.filter((a) => ids.includes(a.id));
    setDs((cu) => cu.filter((a) => !ids.includes(a.id)));
    setTong((n) => n - bo.length);
    setNang((n) => n - bo.reduce((s, a) => s + a.dungLuong, 0));
    setChon((cu) => new Set([...cu].filter((id) => !ids.includes(id))));
    router.refresh();
  }

  // ── xoá một ảnh ──
  function xoaMot(a: Anh) {
    const noi = noiDung(a);
    let buoc = noi.length > 0;
    hoi({
      tieuDe: `Xoá ảnh "${a.tenGoc}"?`,
      anh: a.url,
      anhVuong: true,
      moTa: (
        <>
          <p>
            {noi.length > 0
              ? `Ảnh này đang dùng ở ${noi.length} nơi: ${noi
                  .slice(0, 3)
                  .map((n) => n.chu)
                  .join("; ")}${noi.length > 3 ? ` và ${noi.length - 3} nơi khác` : ""}. Sau khi xoá, các nơi đó sẽ mất ảnh.`
              : "Ảnh chưa dùng ở đâu."}
          </p>
          <p>
            <b>Xoá ảnh là xoá hẳn tệp, không khôi phục được.</b>
          </p>
        </>
      ),
      nutXacNhan: "Xoá ảnh",
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        const r = await viecXoaAnh(a.id, buoc);
        if ("loi" in r && r.loi) {
          // Máy chủ thấy ảnh đang được dùng mà danh sách ở đây chưa kịp biết:
          // KHÔNG tự xoá ép — báo lại, bấm lần nữa mới xoá.
          if (r.dangDung?.length) {
            buoc = true;
            return `Ảnh đang được dùng ở ${r.dangDung.length} nơi (${r.dangDung
              .slice(0, 3)
              .map((n) => n.ten)
              .join("; ")}). Bấm "Xoá ảnh" lần nữa nếu vẫn muốn xoá`;
          }
          return r.loi;
        }
        setXem(null);
        boKhoiDs([a.id]);
        tb.xong(`Đã xoá ảnh "${a.tenGoc}".`);
      },
    });
  }

  // ── xoá hàng loạt ──
  function xoaNhieu() {
    const dsXoa = ds.filter((a) => chon.has(a.id));
    const n = dsXoa.length;
    if (n === 0) return;
    const dangDung = dsXoa.filter((a) => noiDung(a).length > 0).length;
    hoi({
      tieuDe: `Xoá ${n} ảnh đã chọn?`,
      moTa: (
        <>
          {dangDung > 0 && <p>Trong đó {dangDung} ảnh đang dùng ở đơn hàng, bài viết hoặc banner. Sau khi xoá, các nơi đó sẽ mất ảnh.</p>}
          <p>
            <b>Xoá ảnh là xoá hẳn tệp, không khôi phục được.</b>
          </p>
          <div className="qt-day-anh">
            {dsXoa.slice(0, 6).map((a) => (
              <AnhKho key={a.id} src={a.url} nho />
            ))}
            {n > 6 && <span>+{n - 6}</span>}
          </div>
        </>
      ),
      nutXacNhan: `Xoá ${n} ảnh`,
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        const xong: string[] = [];
        // lần lượt từng ảnh: một ảnh lỗi không làm hỏng những ảnh còn lại
        for (const a of dsXoa) {
          try {
            const r = await viecXoaAnh(a.id, true);
            if (!("loi" in r && r.loi)) xong.push(a.id);
          } catch {}
        }
        boKhoiDs(xong);
        if (xong.length === n) {
          tb.xong(`Đã xoá ${n} ảnh.`);
          thoatChon();
        } else tb.loi(`Đã xoá ${xong.length}/${n} ảnh. ${n - xong.length} ảnh chưa xoá được.`);
      },
    });
  }

  async function saoChep(a: Anh) {
    try {
      await navigator.clipboard.writeText(window.location.origin + a.url);
      tb.xong("Đã sao chép đường dẫn ảnh.");
    } catch {
      tb.loi("Không sao chép được. Mở Xem lớn để chép tay.");
    }
  }

  const iXem = xem ? loc.findIndex((a) => a.id === xem.id) : -1;
  const anhXem = xem ? ds.find((a) => a.id === xem.id) : undefined;

  const vungTha = (
    <label className={`qt-tha${ds.length > 0 ? " qt-thap" : ""}${keo ? " qt-dang-keo" : ""}`}>
      <input
        ref={oTep}
        type="file"
        multiple
        accept={CHAP_NHAN}
        className="qt-an-nhin"
        onChange={(e) => {
          tai.them(e.target.files);
          e.target.value = "";
        }}
      />
      <UploadCloud aria-hidden />
      <b>
        {keo ? (
          "Thả ra để tải lên"
        ) : (
          <>
            <span className="qt-mt">Kéo ảnh vào đây</span>
            <span className="qt-dt">Chọn ảnh từ máy hoặc chụp mới</span>
          </>
        )}
      </b>
      <small className="qt-mt">hoặc</small>
      <span className="qt-nut" aria-hidden>
        Chọn tệp từ máy
      </span>
      <small>{CHU_GIOI_HAN}</small>
    </label>
  );

  return (
    <div
      // thả tệp vào BẤT KỲ chỗ nào trên trang cũng nhận
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setKeo(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeo(false);
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setKeo(false);
        tai.them(e.dataTransfer.files);
      }}
      style={{ display: "contents" }}
    >
      <DauTrang tieuDe="Thư viện ảnh" phu={`${soVN(tong)} ảnh · ${dungLuong(nang)}`}>
        <button type="button" className="qt-chinh" onClick={() => oTep.current?.click()}>
          <Upload aria-hidden />
          Tải ảnh lên
        </button>
      </DauTrang>

      <main className="qt-khung">
        {vungTha}
        <DanhSachTai tai={tai} />

        {ds.length === 0 ? (
          <p className="qt-phu" style={{ textAlign: "center", marginTop: 12 }}>
            Chưa có ảnh nào trong thư viện.
          </p>
        ) : (
          <>
            {/* thanh công cụ phải là con TRỰC TIẾP của <main>: phần tử dính chỉ trượt trong
                khuôn của cha nó, bọc thêm một div là hết dính */}
            {cheDoChon ? (
                <div className="qt-cong-cu qt-dinh-cuon qt-dang-chon qt-cach">
                  <strong aria-live="polite">Đã chọn {chon.size} ảnh</strong>
                  <button type="button" onClick={() => setChon(new Set(thay.map((a) => a.id)))}>
                    Chọn tất cả đang hiện
                  </button>
                  <button type="button" disabled={chon.size === 0} onClick={() => setChon(new Set())}>
                    Bỏ chọn
                  </button>
                  <button type="button" className="qt-nguy qt-day-phai" disabled={chon.size === 0} onClick={xoaNhieu}>
                    <Trash2 aria-hidden />
                    Xoá {chon.size} ảnh
                  </button>
                  <button type="button" onClick={thoatChon}>
                    Xong
                  </button>
                </div>
              ) : (
                <div className="qt-cong-cu qt-dinh-cuon qt-cach">
                  <div className="qt-tim">
                    <Search aria-hidden />
                    <input
                      type="search"
                      value={tim}
                      onChange={(e) => {
                        setTim(e.target.value);
                        setHien(MOI_LAN);
                      }}
                      placeholder="Tìm theo tên tệp hoặc nhãn…"
                      aria-label="Tìm ảnh"
                    />
                    {tim && (
                      <button type="button" aria-label="Xoá chữ đang tìm" onClick={() => setTim("")}>
                        <X aria-hidden />
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => setCheDoChon(true)}>
                    <SquareCheck aria-hidden />
                    Chọn nhiều
                  </button>
                  <div className="qt-chip-nhom" role="group" aria-label="Lọc theo nhãn" style={{ flexBasis: "100%" }}>
                    {(
                      [
                        ["", "Tất cả"],
                        ...nhanCo.map(([n, so]) => [n, `${n} (${so})`]),
                        [CHUA_NHAN, `Chưa gắn nhãn (${soChuaNhan})`],
                        [CHUA_DUNG, `Chưa dùng ở đâu (${soChuaDung})`],
                      ] as [string, string][]
                    ).map(([k, chu]) => (
                      <button
                        key={k}
                        type="button"
                        className="qt-chip"
                        aria-pressed={chip === k}
                        onClick={() => {
                          setChip(k);
                          setHien(MOI_LAN);
                        }}
                      >
                        {chu}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="qt-ket-qua" aria-live="polite" style={{ marginTop: 14 }}>
              <span>
                Đang hiện {thay.length} trên {soVN(tong)} ảnh
              </span>
              {coLoc && (
                <button type="button" className="qt-lien-ket" onClick={xoaLoc}>
                  Xoá bộ lọc
                </button>
              )}
            </div>

            {loc.length === 0 ? (
              <Rong
                icon={SearchX}
                tieuDe="Không có ảnh nào khớp"
                moTa={
                  tim.trim()
                    ? `Không tìm thấy ảnh nào cho "${tim.trim()}".`
                    : chip === CHUA_NHAN
                      ? "Ảnh nào cũng đã có nhãn."
                      : chip === CHUA_DUNG
                        ? "Ảnh nào cũng đang được dùng."
                        : `Không có ảnh nào mang nhãn "${chip}".`
                }
              >
                <button type="button" onClick={xoaLoc}>
                  Xoá bộ lọc
                </button>
              </Rong>
            ) : (
              <div className={`qt-luoi-anh${cheDoChon ? " qt-che-do-chon" : ""}`}>
                {thay.map((a) => {
                  const duocChon = chon.has(a.id);
                  const k = noiDung(a).length;
                  return (
                    <div key={a.id} className={`qt-anh${duocChon ? " qt-duoc-chon" : ""}`}>
                      <label className="qt-anh-chon">
                        <input type="checkbox" className="qt-an-nhin" checked={duocChon} onChange={() => batTat(a.id)} aria-label={`Chọn ảnh ${a.tenGoc}`} />
                        <span aria-hidden>{duocChon && <Check />}</span>
                      </label>
                      <button
                        type="button"
                        className="qt-anh-hinh"
                        aria-label={cheDoChon ? `${duocChon ? "Bỏ chọn" : "Chọn"} ảnh ${a.tenGoc}` : `Xem lớn ảnh ${a.tenGoc}`}
                        onClick={() => (cheDoChon ? batTat(a.id) : setXem({ id: a.id, vaoNhan: false }))}
                      >
                        <img src={a.url} alt="" loading="lazy" decoding="async" />
                      </button>
                      <div className="qt-anh-chu">
                        <b title={a.tenGoc}>{a.tenGoc}</b>
                        <span>{coAnh(a)}</span>
                        <div>
                          {a.nhan.length === 0
                            ? "Chưa gắn nhãn"
                            : a.nhan.slice(0, 2).map((n) => (
                                <span key={n} className="qt-nhan-anh">
                                  {n}
                                </span>
                              ))}
                          {a.nhan.length > 2 && <span className="qt-nhan-anh">+{a.nhan.length - 2}</span>}
                        </div>
                        {k > 0 ? (
                          <span className="qt-dang-dung">
                            <Link2 aria-hidden />
                            Đang dùng ở {k} nơi
                          </span>
                        ) : (
                          <span>Chưa dùng ở đâu</span>
                        )}
                      </div>
                      <div className="qt-anh-nut">
                        <button type="button" className="qt-nut-icon" aria-label={`Xem lớn ${a.tenGoc}`} title="Xem lớn" onClick={() => setXem({ id: a.id, vaoNhan: false })}>
                          <Maximize2 aria-hidden />
                        </button>
                        <button type="button" className="qt-nut-icon" aria-label={`Sửa nhãn ${a.tenGoc}`} title="Sửa nhãn" onClick={() => setXem({ id: a.id, vaoNhan: true })}>
                          <Tag aria-hidden />
                        </button>
                        <button type="button" className="qt-nut-icon" aria-label={`Sao chép đường dẫn ${a.tenGoc}`} title="Sao chép đường dẫn" onClick={() => void saoChep(a)}>
                          <Copy aria-hidden />
                        </button>
                        <button type="button" className="qt-nut-icon qt-do" aria-label={`Xoá ảnh ${a.tenGoc}`} title="Xoá ảnh" onClick={() => xoaMot(a)}>
                          <Trash2 aria-hidden />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {loc.length > 0 && (
              <div className="qt-tai-them">
                {conNua ? (
                  <button type="button" disabled={dangNap} onClick={() => void taiThem()}>
                    {dangNap ? "Đang tải…" : `Tải thêm ${MOI_LAN} ảnh`}
                  </button>
                ) : (
                  !coLoc && <span>Đã hiện hết {soVN(tong)} ảnh.</span>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <XemLon
        anh={anhXem}
        vaoNhan={!!xem?.vaoNhan}
        noi={anhXem ? noiDung(anhXem) : []}
        goiY={nhanCo.map(([n]) => n)}
        truoc={iXem > 0 ? () => setXem({ id: loc[iXem - 1]!.id, vaoNhan: false }) : undefined}
        sau={iXem >= 0 && iXem < loc.length - 1 ? () => setXem({ id: loc[iXem + 1]!.id, vaoNhan: false }) : undefined}
        dong={() => setXem(null)}
        capNhat={(moi) => setDs((cu) => cu.map((a) => (a.id === moi.id ? moi : a)))}
        daThay={(cu, moi) => {
          setDs((d) => d.map((a) => (a.id === moi.id ? moi : a)));
          setNang((n) => n - cu.dungLuong + moi.dungLuong);
          router.refresh(); // bản đồ "đang dùng ở đâu" tính theo đường dẫn, mà đường dẫn vừa đổi
        }}
        xoa={xoaMot}
        saoChep={saoChep}
      />
    </div>
  );
}

/** XEM LỚN một ảnh: thấy trọn ảnh, thông tin, nhãn, nơi đang dùng, thay / xoá. */
function XemLon({
  anh,
  vaoNhan,
  noi,
  goiY,
  truoc,
  sau,
  dong,
  capNhat,
  daThay,
  xoa,
  saoChep,
}: {
  anh: Anh | undefined;
  vaoNhan: boolean;
  noi: NoiDung[];
  goiY: string[];
  truoc?: () => void;
  sau?: () => void;
  dong: () => void;
  capNhat: (a: Anh) => void;
  daThay: (cu: Anh, moi: Anh) => void;
  xoa: (a: Anh) => void;
  saoChep: (a: Anh) => Promise<void>;
}) {
  const hoi = useHoi();
  const tb = useThongBao();
  const hop = useRef<HTMLDialogElement>(null);
  const oNhan = useRef<HTMLInputElement>(null);
  const oTep = useRef<HTMLInputElement>(null);
  const [nhanMoi, setNhanMoi] = useState("");
  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    const d = hop.current;
    if (!d) return;
    if (anh && !d.open) d.showModal();
    if (!anh && d.open) d.close();
  }, [anh]);
  useEffect(() => {
    if (anh && vaoNhan) oNhan.current?.focus();
    setNhanMoi("");
  }, [anh?.id, vaoNhan]); // eslint-disable-line react-hooks/exhaustive-deps

  // Nhãn lưu NGAY khi thêm / gỡ — không có nút Lưu riêng cho một việc nhỏ thế này.
  async function luuNhan(nhan: string[]) {
    if (!anh || dangLuu) return;
    setDangLuu(true);
    try {
      const r = await viecSuaAnh(anh.id, { nhan });
      // `!== undefined` chứ không `if (r.loi)`: chỉ cách này TypeScript mới thu hẹp được sang nhánh có `anh`
      if (r.loi !== undefined) tb.loi(`Không lưu được nhãn: ${r.loi}`);
      else {
        capNhat(r.anh);
        tb.xong("Đã lưu nhãn.");
      }
    } catch (e) {
      tb.loi(`Không lưu được nhãn: ${chuLoi(e)}`);
    }
    setDangLuu(false);
  }
  function themNhan() {
    if (!anh) return;
    // chữ thường, gọn khoảng trắng, tối đa 30 ký tự, không trùng
    const n = nhanMoi.replace(/\s+/g, " ").trim().toLowerCase().slice(0, 30);
    setNhanMoi("");
    if (!n || anh.nhan.includes(n)) return;
    void luuNhan([...anh.nhan, n]);
  }

  function thay(tep: File | undefined | null) {
    if (!anh || !tep) return;
    const loi = kiemTep(tep);
    if (loi) return tb.loi(loi);
    const xemTruoc = URL.createObjectURL(tep);
    hoi({
      tieuDe: `Thay ảnh "${anh.tenGoc}"?`,
      moTa: (
        <>
          <p>
            {noi.length > 0
              ? `Ảnh này đang dùng ở ${noi.length} nơi. Tất cả sẽ đổi sang ảnh mới ngay.`
              : "Ảnh cũ sẽ bị thay bằng ảnh mới."}
          </p>
          <p>Không lấy lại được ảnh cũ.</p>
          <div className="qt-day-anh qt-to">
            <figure>
              <AnhKho src={anh.url} nho />
              Ảnh hiện tại
            </figure>
            <ChevronRight size={18} aria-hidden />
            <figure>
              <AnhKho src={xemTruoc} nho />
              Ảnh mới
            </figure>
          </div>
        </>
      ),
      nutXacNhan: "Thay ảnh",
      dangChay: "Đang thay…",
      nguyHiem: false,
      onXacNhan: async () => {
        try {
          const moi = await guiTep(tep, () => {}, anh.id).hua;
          daThay(anh, moi);
          tb.xong("Đã thay ảnh.");
        } finally {
          URL.revokeObjectURL(xemTruoc);
        }
      },
    });
  }

  return (
    <dialog
      ref={hop}
      className="qt-hop qt-hop-anh"
      aria-label={anh ? `Xem ảnh ${anh.tenGoc}` : "Xem ảnh"}
      onClose={dong}
      onClick={(e) => {
        if (e.target === hop.current) dong();
      }}
      onKeyDown={(e) => {
        // ← → chuyển ảnh, trừ khi đang gõ trong ô nhập
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        if (e.key === "ArrowLeft") truoc?.();
        if (e.key === "ArrowRight") sau?.();
      }}
    >
      {anh && (
        <>
          <div className="qt-hop-anh-khung">
            <button type="button" aria-label="Ảnh trước" title="Ảnh trước" disabled={!truoc} onClick={truoc}>
              <ChevronLeft aria-hidden />
            </button>
            <img src={anh.url} alt={anh.tenGoc} />
            <button type="button" aria-label="Ảnh sau" title="Ảnh sau" disabled={!sau} onClick={sau}>
              <ChevronRight aria-hidden />
            </button>
          </div>

          <div className="qt-hop-anh-tin">
            <div className="qt-hop-dau">
              <h2>{anh.tenGoc}</h2>
              <button type="button" className="qt-nut-icon" aria-label="Đóng" title="Đóng" onClick={dong}>
                <X aria-hidden />
              </button>
            </div>

            <dl className="qt-chi-tiet">
              {anh.rong && anh.cao && (
                <div>
                  <dt>Kích thước</dt>
                  <dd>
                    {anh.rong} × {anh.cao} px
                  </dd>
                </div>
              )}
              <div>
                <dt>Dung lượng</dt>
                <dd>{dungLuong(anh.dungLuong)}</dd>
              </div>
              <div>
                <dt>Định dạng</dt>
                <dd>{tenDinhDang(anh.loai)}</dd>
              </div>
              <div>
                <dt>Tải lên lúc</dt>
                <dd>{ngayGio(anh.taoLuc)}</dd>
              </div>
            </dl>

            <div>
              <h3 id="xl-duong-dan">Đường dẫn</h3>
              <div className="qt-dong-nhap">
                <input type="text" readOnly value={anh.url} aria-labelledby="xl-duong-dan" onFocus={(e) => e.currentTarget.select()} onClick={(e) => e.currentTarget.select()} />
                <button type="button" className="qt-nut-nho" onClick={() => void saoChep(anh)}>
                  <Copy aria-hidden />
                  Sao chép
                </button>
              </div>
            </div>

            <div>
              <h3 id="xl-nhan">Nhãn</h3>
              {anh.nhan.length > 0 && (
                <div className="qt-the-nhan" style={{ marginBottom: 8 }}>
                  {anh.nhan.map((n) => (
                    <span key={n} className="qt-nhan-anh qt-go">
                      {n}
                      <button type="button" aria-label={`Gỡ nhãn ${n}`} title={`Gỡ nhãn ${n}`} disabled={dangLuu} onClick={() => void luuNhan(anh.nhan.filter((x) => x !== n))}>
                        <X size={14} aria-hidden />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                ref={oNhan}
                type="text"
                value={nhanMoi}
                maxLength={30}
                list="xl-goi-y"
                placeholder="Thêm nhãn rồi bấm Enter"
                aria-labelledby="xl-nhan"
                disabled={dangLuu}
                onChange={(e) => setNhanMoi(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  themNhan();
                }}
              />
              <datalist id="xl-goi-y">
                {goiY
                  .filter((n) => !anh.nhan.includes(n))
                  .map((n) => (
                    <option key={n} value={n} />
                  ))}
              </datalist>
              <span className="qt-ghi-chu">Nhãn giúp tìm ảnh nhanh, ví dụ: banner, điều dưỡng, ký túc xá.</span>
            </div>

            <div>
              <h3>Đang dùng ở</h3>
              {noi.length === 0 ? (
                <p className="qt-phu" style={{ margin: 0 }}>
                  Chưa dùng ở đâu.
                </p>
              ) : (
                <ul className="qt-noi-dung-ds">
                  {noi.map((n, i) => {
                    const Icon = ICON_NOI[n.loai];
                    return (
                      <li key={i}>
                        <Link href={n.duong}>
                          <Icon aria-hidden />
                          {n.chu}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="qt-hop-anh-chan">
              <button type="button" onClick={() => oTep.current?.click()}>
                <Replace aria-hidden />
                Thay ảnh
              </button>
              <button type="button" className="qt-nguy" onClick={() => xoa(anh)}>
                <Trash2 aria-hidden />
                Xoá ảnh
              </button>
              <input
                ref={oTep}
                type="file"
                accept={CHAP_NHAN}
                className="qt-an-nhin"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  thay(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
