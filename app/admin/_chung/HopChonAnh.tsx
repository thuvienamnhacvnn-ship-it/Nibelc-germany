"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ImageOff, LoaderCircle, Search, SearchX, Upload, X } from "lucide-react";
import type { Anh } from "@/lib/quan-tri/kho-anh";
import { viecLietKeAnh } from "../viec-anh";
import { AnhKho } from "./AnhKho";
import { Rong } from "./Rong";
import { CHAP_NHAN, DanhSachTai, useTaiLen } from "./tai-len";
import { boDau, chuLoi } from "./dinh-dang";

/**
 * HỘP CHỌN ẢNH TỪ THƯ VIỆN — dùng chung cho ảnh bìa đơn hàng / bài viết (một
 * ảnh), thư viện ảnh của đơn (nhiều ảnh) và banner (một ảnh).
 *
 * Tải lên được NGAY TRONG HỘP: nhân viên đang sửa đơn mà ảnh chưa có trong
 * kho thì không phải bỏ form đi sang trang Thư viện ảnh rồi quay lại.
 *
 * Mỗi lần nạp 200 ảnh (trần của máy chủ) rồi tìm / lọc tại trình duyệt: kho
 * cỡ vài trăm ảnh thì gõ tới đâu lọc tới đó, không chờ mạng.
 */

const MOI_LAN = 60;
const MOI_TRANG = 200;

export function HopChonAnh({
  mo,
  tieuDe,
  nhieu = false,
  daCo = [],
  onChon,
  onDong,
}: {
  mo: boolean;
  tieuDe: string;
  /** true = chọn nhiều ảnh (thư viện của đơn); false = một ảnh */
  nhieu?: boolean;
  /** đường dẫn các ảnh nơi gọi ĐÃ CÓ — chế độ nhiều thì khoá lại, khỏi thêm trùng */
  daCo?: string[];
  onChon: (ds: Anh[]) => void;
  onDong: () => void;
}) {
  const hop = useRef<HTMLDialogElement>(null);
  const oTim = useRef<HTMLInputElement>(null);
  const oTep = useRef<HTMLInputElement>(null);
  const luoi = useRef<HTMLDivElement>(null);

  const [ds, setDs] = useState<Anh[]>([]);
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(0);
  const [dangNap, setDangNap] = useState(false);
  const [loiNap, setLoiNap] = useState("");
  const [tim, setTim] = useState("");
  const [nhan, setNhan] = useState("");
  const [hien, setHien] = useState(MOI_LAN);
  const [chon, setChon] = useState<Anh[]>([]);
  const [keo, setKeo] = useState(false);

  const nap = useCallback(async (tr: number) => {
    setDangNap(true);
    setLoiNap("");
    try {
      const r = await viecLietKeAnh({ trang: tr, moiTrang: MOI_TRANG });
      setDs((cu) => (tr === 1 ? r.ds : [...cu, ...r.ds.filter((a) => !cu.some((c) => c.id === a.id))]));
      setTong(r.tong);
      setTrang(tr);
    } catch (e) {
      setLoiNap(chuLoi(e));
    }
    setDangNap(false);
  }, []);

  const tai = useTaiLen((a) => {
    // ảnh vừa lên: chèn đầu lưới và TỰ CHỌN — tải lên trong hộp này thì chắc chắn là để dùng ngay
    setDs((cu) => [a, ...cu]);
    setTong((n) => n + 1);
    setChon((cu) => (nhieu ? [...cu, a] : [a]));
  });

  useEffect(() => {
    const d = hop.current;
    if (!d) return;
    if (mo && !d.open) {
      setChon([]);
      setTim("");
      setNhan("");
      setHien(MOI_LAN);
      tai.don();
      d.showModal();
      oTim.current?.focus();
      void nap(1);
    }
    if (!mo && d.open) d.close();
    // chỉ chạy khi `mo` đổi; `tai`, `nap` ổn định về hành vi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mo]);

  const moiNhan = useMemo(() => [...new Set(ds.flatMap((a) => a.nhan))].sort((a, b) => a.localeCompare(b, "vi")), [ds]);

  const loc = useMemo(() => {
    const t = boDau(tim.trim());
    return ds.filter((a) => (!nhan || a.nhan.includes(nhan)) && (!t || boDau(a.tenGoc).includes(t) || a.nhan.some((n) => boDau(n).includes(t))));
  }, [ds, tim, nhan]);
  const thay = loc.slice(0, hien);
  const coLoc = !!tim.trim() || !!nhan;
  const conNua = hien < loc.length || ds.length < tong;

  function bam(a: Anh) {
    if (nhieu && daCo.includes(a.url)) return;
    setChon((cu) => {
      const co = cu.some((c) => c.id === a.id);
      if (!nhieu) return co ? [] : [a];
      return co ? cu.filter((c) => c.id !== a.id) : [...cu, a];
    });
  }
  function xong(dsChon: Anh[]) {
    if (dsChon.length === 0) return;
    onChon(dsChon);
    onDong();
  }

  /** mũi tên di chuyển giữa các ô theo đúng số cột đang hiện */
  function phim(e: React.KeyboardEvent) {
    const o = Array.from(luoi.current?.querySelectorAll<HTMLButtonElement>("button.qt-chon-o") ?? []);
    const i = o.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const cot = Math.max(1, getComputedStyle(luoi.current!).gridTemplateColumns.split(" ").length);
    const buoc = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cot, ArrowUp: -cot }[e.key];
    if (!buoc) return;
    e.preventDefault();
    o[Math.min(o.length - 1, Math.max(0, i + buoc))]?.focus();
  }

  return (
    <dialog
      ref={hop}
      className="qt-hop qt-hop-chon"
      aria-label={tieuDe}
      onClose={onDong}
      onClick={(e) => {
        if (e.target === hop.current) onDong();
      }}
    >
      {mo && (
        <>
          <div className="qt-hop-chon-dau">
            <div className="qt-hop-dau">
              <h2>{tieuDe}</h2>
              <button type="button" className="qt-nut-icon" aria-label="Đóng" title="Đóng" onClick={onDong}>
                <X aria-hidden />
              </button>
            </div>
            <div className="qt-hop-chon-loc">
              <div className="qt-tim">
                <Search aria-hidden />
                <input
                  ref={oTim}
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
              <select
                value={nhan}
                aria-label="Lọc theo nhãn"
                onChange={(e) => {
                  setNhan(e.target.value);
                  setHien(MOI_LAN);
                }}
              >
                <option value="">Mọi nhãn</option>
                {moiNhan.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
              <button type="button" onClick={() => oTep.current?.click()}>
                <Upload aria-hidden />
                Tải ảnh mới lên
              </button>
              <input
                ref={oTep}
                type="file"
                multiple
                accept={CHAP_NHAN}
                className="qt-an-nhin"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  tai.them(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          <div
            className={`qt-hop-chon-giua${keo ? " qt-dang-keo" : ""}`}
            onDragOver={(e) => {
              if (!e.dataTransfer.types.includes("Files")) return;
              e.preventDefault();
              setKeo(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeo(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setKeo(false);
              tai.them(e.dataTransfer.files);
            }}
          >
            {keo && (
              <p className="qt-tab-chu" style={{ marginTop: 0, fontWeight: 600, color: "var(--qt-xanh-dam)" }}>
                Thả ra để tải lên
              </p>
            )}
            <DanhSachTai tai={tai} gon />

            {loiNap ? (
              <Rong icon={ImageOff} tieuDe="Không đọc được thư viện ảnh" moTa={loiNap} gon>
                <button type="button" onClick={() => void nap(1)}>
                  Thử lại
                </button>
              </Rong>
            ) : dangNap && ds.length === 0 ? (
              <div className="qt-luoi-chon" aria-busy="true">
                <span className="qt-an-nhin">Đang tải…</span>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="qt-xuong" style={{ aspectRatio: "1" }} />
                ))}
              </div>
            ) : ds.length === 0 ? (
              <Rong icon={ImageOff} tieuDe="Thư viện chưa có ảnh nào" moTa="Tải ảnh lên ngay tại đây." gon>
                <button type="button" className="qt-chinh" onClick={() => oTep.current?.click()}>
                  <Upload aria-hidden />
                  Tải ảnh mới lên
                </button>
              </Rong>
            ) : loc.length === 0 ? (
              <Rong
                icon={SearchX}
                tieuDe="Không có ảnh nào khớp"
                moTa={tim.trim() ? `Không tìm thấy ảnh nào cho "${tim.trim()}".` : `Không có ảnh nào mang nhãn "${nhan}".`}
                gon
              >
                <button
                  type="button"
                  onClick={() => {
                    setTim("");
                    setNhan("");
                  }}
                >
                  Xoá bộ lọc
                </button>
              </Rong>
            ) : (
              <>
                <div className="qt-luoi-chon" ref={luoi} onKeyDown={phim}>
                  {thay.map((a) => {
                    const thuTu = chon.findIndex((c) => c.id === a.id);
                    const khoa = nhieu && daCo.includes(a.url);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className="qt-chon-o"
                        aria-pressed={thuTu >= 0}
                        disabled={khoa}
                        // `disabled` làm mờ cả nút; ảnh "đã có" phải giữ nguyên màu nên trả opacity về 1
                        style={khoa ? { opacity: 1 } : undefined}
                        title={a.tenGoc}
                        onClick={() => bam(a)}
                        onDoubleClick={() => {
                          if (!nhieu) xong([a]); // chế độ một ảnh: bấm đúp = chọn và đóng luôn
                        }}
                      >
                        <AnhKho src={a.url} alt={a.tenGoc} />
                        {thuTu >= 0 && <span className="qt-chon-dau">{nhieu ? thuTu + 1 : <Check aria-hidden />}</span>}
                        <small>{a.tenGoc}</small>
                        {khoa && <span className="qt-nhan xam">Đã có</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="qt-tai-them">
                  {conNua ? (
                    <button
                      type="button"
                      disabled={dangNap}
                      onClick={() => {
                        // hết phần đã nạp mà kho còn → nạp trang kế rồi mới mở rộng phần hiện
                        if (hien + MOI_LAN > loc.length && ds.length < tong) void nap(trang + 1);
                        setHien((n) => n + MOI_LAN);
                      }}
                    >
                      {dangNap ? "Đang tải…" : `Tải thêm ${MOI_LAN} ảnh`}
                    </button>
                  ) : (
                    !coLoc && <span>Đã hiện hết {tong} ảnh.</span>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="qt-hop-chon-chan">
            <span aria-live="polite">
              {nhieu ? (
                <>
                  Đã chọn {chon.length} ảnh
                  {chon.length > 0 && (
                    <>
                      {" · "}
                      <button type="button" className="qt-lien-ket" onClick={() => setChon([])}>
                        Bỏ chọn
                      </button>
                    </>
                  )}
                </>
              ) : (
                (chon[0]?.tenGoc ?? "Chưa chọn ảnh nào")
              )}
            </span>
            <button type="button" onClick={onDong}>
              Huỷ
            </button>
            <button type="button" className="qt-chinh" disabled={chon.length === 0} onClick={() => xong(chon)}>
              {dangNap && ds.length === 0 && <LoaderCircle className="qt-quay" aria-hidden />}
              {nhieu ? `Thêm ${chon.length} ảnh` : "Dùng ảnh này"}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
