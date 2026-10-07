"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  LoaderCircle,
  MapPin,
  PackageOpen,
  Pencil,
  Plus,
  Search,
  SearchX,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { DonHangQT } from "@/lib/quan-tri/don-hang";
import { anhHopLe } from "@/lib/anh";
import { chuoiLuong, noiLamViec } from "@/types/job";
import { viecAnHien, viecNoiBat, viecXoaDonHang } from "../viec";
import { viecHoanTacXoa } from "../_tam";
import { AnhKho } from "../_chung/AnhKho";
import { Rong } from "../_chung/Rong";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { DUONG } from "../_chung/duong";
import { boDau, chuLoi } from "../_chung/dinh-dang";

/**
 * DANH SÁCH ĐƠN HÀNG — lưới thẻ có ảnh (mặc định) hoặc bảng dày.
 *
 * Thẻ là mặc định vì lời Sếp: phải "dễ quan sát đầy đủ từ hình ảnh đến thông
 * tin". Bảng giữ lại cho lúc cần rà nhanh hai chục đơn trên màn hình lớn.
 */

type LocDacBiet = "chua-anh" | "chua-en" | "chua-de";
const CHU_LOC: Record<LocDacBiet, string> = {
  "chua-anh": "Chưa có ảnh bìa",
  "chua-en": "Chưa dịch tiếng Anh",
  "chua-de": "Chưa dịch tiếng Đức",
};
const KHOA_KIEU = "qt-kieu-don";

const tenDon = (d: DonHangQT) => d.duLieu.title || d.slug;
/** ảnh THẬT của đơn (không lùi về ảnh ngành): để nhân viên thấy đơn nào còn thiếu ảnh */
const anhDon = (d: DonHangQT) => [d.duLieu.thumbnail, d.duLieu.image].find(anhHopLe) ?? "";
/** ảnh để HIỆN: ảnh thật, không có thì đúng tấm web đang dùng thay (ảnh chung của ngành) — không để ô trống */
const anhHien = (d: DonHangQT) => anhDon(d) || d.anhBia;

export function DanhSachDon({
  don,
  nganhNghe,
  ttDau,
  locDau,
}: {
  don: DonHangQT[];
  nganhNghe: { id: string; ten: string }[];
  ttDau?: "hien" | "an";
  locDau?: LocDacBiet;
}) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();

  const [tim, setTim] = useState("");
  const [nganh, setNganh] = useState("");
  const [nuoc, setNuoc] = useState("");
  const [tt, setTt] = useState<"" | "hien" | "an">(ttDau ?? "");
  const [loc, setLoc] = useState<LocDacBiet | "">(locDau ?? "");
  const [kieu, setKieu] = useState<"the" | "bang">("the");
  const [rong, setRong] = useState(true);
  /** id đơn đang chạy thao tác nhanh + tên thao tác, để chỉ nút vừa bấm quay */
  const [ban, setBan] = useState<{ id: string; viec: string } | null>(null);

  useEffect(() => {
    // Đọc sau khi gắn vào trang, không đọc lúc dựng: máy chủ không có
    // localStorage, đọc sớm là hai bên dựng ra hai kiểu xem khác nhau.
    try {
      if (localStorage.getItem(KHOA_KIEU) === "bang") setKieu("bang");
    } catch {}
    const mq = window.matchMedia("(min-width: 900px)");
    const h = () => setRong(mq.matches);
    h();
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  function doiKieu(k: "the" | "bang") {
    setKieu(k);
    try {
      localStorage.setItem(KHOA_KIEU, k);
    } catch {}
  }

  const tenNganh = useMemo(() => new Map(nganhNghe.map((n) => [n.id, n.ten])), [nganhNghe]);
  const moiNuoc = useMemo(() => [...new Set(don.map((d) => d.nuoc ?? "").filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi")), [don]);
  const soHien = don.filter((d) => d.hien).length;

  const ds = useMemo(() => {
    const t = boDau(tim.trim());
    return don.filter((d) => {
      if (nganh && d.duLieu.industryId !== nganh) return false;
      if (nuoc && d.nuoc !== nuoc) return false;
      if (tt && d.hien !== (tt === "hien")) return false;
      if (loc === "chua-anh" && anhDon(d)) return false;
      if (loc === "chua-en" && d.coEn) return false;
      if (loc === "chua-de" && d.coDe) return false;
      return !t || [d.duLieu.title, d.duLieu.city, d.nuoc, d.slug, d.id].some((x) => boDau(x).includes(t));
    });
  }, [don, tim, nganh, nuoc, tt, loc]);

  const coLoc = !!(tim.trim() || nganh || nuoc || tt || loc);
  function xoaLoc() {
    setTim("");
    setNganh("");
    setNuoc("");
    setTt("");
    setLoc("");
    if (locDau || ttDau) router.replace(DUONG.donHang); // gỡ tham số trên thanh địa chỉ, kẻo tải lại là lọc lại
  }

  async function nhanh(d: DonHangQT, viec: "hien" | "noi-bat") {
    if (ban) return;
    setBan({ id: d.id, viec });
    const ten = tenDon(d);
    try {
      if (viec === "hien") {
        await viecAnHien(d.id, !d.hien);
        tb.xong(d.hien ? `Đã ẩn đơn "${ten}".` : `Đã cho hiện đơn "${ten}".`);
      } else {
        const r = await viecNoiBat(d.id, !d.noiBat);
        if (r.loi) throw new Error(r.loi);
        tb.xong(d.noiBat ? `Đã bỏ nổi bật "${ten}".` : `Đã đặt "${ten}" làm đơn nổi bật.`);
      }
      router.refresh();
    } catch (e) {
      tb.loi(`Không làm được: ${chuLoi(e).replace(/\.$/, "")}. Thử lại.`);
    }
    setBan(null);
  }

  function xoa(d: DonHangQT) {
    const ten = tenDon(d);
    hoi({
      tieuDe: `Xoá đơn "${ten}"?`,
      anh: anhHien(d),
      moTa: <p>Đơn sẽ biến mất khỏi web ngay. Vẫn khôi phục được ở mục Nhật ký.</p>,
      nutXacNhan: "Xoá đơn hàng",
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        await viecXoaDonHang(d.id);
        router.refresh();
        tb.xong(`Đã xoá đơn "${ten}".`, {
          hoanTac: () => {
            void viecHoanTacXoa("don_hang", d.id)
              .then((r) => {
                if (r.loi) return tb.loi(`Không khôi phục được: ${r.loi}`);
                tb.xong(`Đã khôi phục đơn "${ten}".`);
                router.refresh();
              })
              .catch((e) => tb.loi(`Không khôi phục được: ${chuLoi(e)}`));
          },
        });
      },
    });
  }

  /* Ba mảnh dưới đây là HÀM trả JSX chứ không phải component: khai component
     bên trong component thì mỗi lần vẽ lại là một kiểu mới, React gỡ nút cũ gắn
     nút mới và tiêu điểm bàn phím rơi mất ngay sau khi bấm. */
  /** Bốn thao tác nhanh — dùng chung cho chân thẻ và cột cuối của bảng. */
  function thaoTac(d: DonHangQT) {
    const dangBan = ban?.id === d.id;
    const quay = (v: string) => dangBan && ban?.viec === v;
    const nhanHien = d.hien ? "Ẩn khỏi web" : "Cho hiện lên web";
    const nhanSao = d.noiBat ? "Bỏ nổi bật" : "Đặt làm nổi bật";
    const nhanXem = d.hien ? "Xem trên web" : "Đơn đang ẩn nên chưa xem được trên web";
    return (
      <>
        <button type="button" className="qt-nut-icon" aria-label={nhanHien} title={nhanHien} disabled={dangBan} onClick={() => nhanh(d, "hien")}>
          {quay("hien") ? <LoaderCircle className="qt-quay" aria-hidden /> : d.hien ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </button>
        <button
          type="button"
          className="qt-nut-icon"
          aria-label={nhanSao}
          title={nhanSao}
          aria-pressed={d.noiBat}
          disabled={dangBan}
          onClick={() => nhanh(d, "noi-bat")}
        >
          {quay("noi-bat") ? <LoaderCircle className="qt-quay" aria-hidden /> : <Star className={d.noiBat ? "qt-sao-day" : undefined} aria-hidden />}
        </button>
        {d.hien ? (
          <a className="qt-nut qt-nut-icon" href={`/don-hang/${d.slug}`} target="_blank" rel="noreferrer" aria-label={nhanXem} title={nhanXem}>
            <ExternalLink aria-hidden />
          </a>
        ) : (
          <button type="button" className="qt-nut-icon" disabled aria-label={nhanXem} title={nhanXem}>
            <ExternalLink aria-hidden />
          </button>
        )}
        <button type="button" className="qt-nut-icon qt-do" aria-label="Xoá đơn hàng" title="Xoá đơn hàng" disabled={dangBan} onClick={() => xoa(d)}>
          <Trash2 aria-hidden />
        </button>
      </>
    );
  }

  function huyHieu(d: DonHangQT) {
    return (
      <>
        <span className={`qt-nhan ${d.hien ? "hien" : "an"}`}>{d.hien ? "Đang hiện" : "Đang ẩn"}</span>
        {d.noiBat && (
          <span className="qt-nhan noi-bat">
            <Star fill="currentColor" aria-hidden />
            Nổi bật
          </span>
        )}
        {!anhDon(d) && (
          <span className="qt-nhan cam" title="Đơn chưa có ảnh bìa riêng — web đang dùng tạm ảnh chung của ngành">
            Ảnh mặc định
          </span>
        )}
      </>
    );
  }
  function banDich(d: DonHangQT) {
    return (
      <>
        <span className={`qt-nhan ${d.coEn ? "hien" : "an"}`} title={d.coEn ? "Đã dịch tiếng Anh" : "Chưa dịch tiếng Anh"} aria-label={d.coEn ? "Đã dịch tiếng Anh" : "Chưa dịch tiếng Anh"}>
          EN
        </span>
        <span className={`qt-nhan ${d.coDe ? "hien" : "an"}`} title={d.coDe ? "Đã dịch tiếng Đức" : "Chưa dịch tiếng Đức"} aria-label={d.coDe ? "Đã dịch tiếng Đức" : "Chưa dịch tiếng Đức"}>
          DE
        </span>
      </>
    );
  }

  if (don.length === 0) {
    return (
      <Rong icon={PackageOpen} tieuDe="Chưa có đơn hàng nào" moTa="Thêm đơn đầu tiên để nó hiện lên trang Đơn hàng của web.">
        <Link href={DUONG.donMoi} className="qt-nut qt-chinh">
          <Plus aria-hidden />
          Thêm đơn hàng
        </Link>
      </Rong>
    );
  }

  const dangBang = kieu === "bang" && rong;

  return (
    <>
      <div className="qt-cong-cu">
        <div className="qt-tim">
          <Search aria-hidden />
          <input type="search" value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tên đơn, thành phố, nước…" aria-label="Tìm đơn hàng" />
          {tim && (
            <button type="button" aria-label="Xoá chữ đang tìm" onClick={() => setTim("")}>
              <X aria-hidden />
            </button>
          )}
        </div>
        <select value={nganh} onChange={(e) => setNganh(e.target.value)} aria-label="Lọc theo ngành">
          <option value="">Mọi ngành</option>
          {nganhNghe.map((n) => (
            <option key={n.id} value={n.id}>
              {n.ten}
            </option>
          ))}
        </select>
        <select className="qt-vua" value={nuoc} onChange={(e) => setNuoc(e.target.value)} aria-label="Lọc theo nước">
          <option value="">Mọi nước</option>
          {moiNuoc.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <div className="qt-chip-nhom" role="group" aria-label="Lọc theo trạng thái">
          {(
            [
              ["", `Tất cả (${don.length})`],
              ["hien", `Đang hiện (${soHien})`],
              ["an", `Đang ẩn (${don.length - soHien})`],
            ] as const
          ).map(([k, chu]) => (
            <button key={k} type="button" className="qt-chip" aria-pressed={tt === k} onClick={() => setTt(k)}>
              {chu}
            </button>
          ))}
          {loc && (
            <button type="button" className="qt-chip qt-cam" aria-label={`Gỡ bộ lọc: ${CHU_LOC[loc]}`} onClick={() => setLoc("")}>
              {CHU_LOC[loc]}
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
        <div className="qt-kieu-xem qt-day-phai">
          <button type="button" aria-label="Xem dạng thẻ" title="Xem dạng thẻ" aria-pressed={kieu === "the"} onClick={() => doiKieu("the")}>
            <LayoutGrid aria-hidden />
          </button>
          <button type="button" aria-label="Xem dạng bảng" title="Xem dạng bảng" aria-pressed={kieu === "bang"} onClick={() => doiKieu("bang")}>
            <List aria-hidden />
          </button>
        </div>
      </div>

      <div className="qt-ket-qua" aria-live="polite">
        <span>
          Đang hiện {ds.length} trên {don.length} đơn
        </span>
        {coLoc && (
          <button type="button" className="qt-lien-ket" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        )}
      </div>

      {ds.length === 0 ? (
        <Rong
          icon={SearchX}
          tieuDe="Không có đơn nào khớp"
          moTa={tim.trim() ? `Không tìm thấy đơn nào cho "${tim.trim()}".` : "Không có đơn nào khớp bộ lọc đang chọn."}
        >
          <button type="button" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        </Rong>
      ) : dangBang ? (
        <div className="qt-tam">
          <div className="qt-cuon">
            <table className="qt-bang">
              <thead>
                <tr>
                  <th style={{ width: 88 }}>
                    <span className="qt-an-nhin">Ảnh</span>
                  </th>
                  <th>Đơn hàng</th>
                  <th>Lương</th>
                  <th className="qt-phai qt-an-hep">Suất</th>
                  <th className="qt-an-hep">Bản dịch</th>
                  <th>Trạng thái</th>
                  <th>
                    <span className="qt-an-nhin">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ds.map((d) => (
                  <tr key={d.id} className={d.hien ? undefined : "qt-dang-an"} aria-busy={ban?.id === d.id}>
                    <td>
                      <AnhKho src={anhHien(d)} className="qt-anh-nho" nho />
                    </td>
                    {/* Ngành và nơi làm nằm NGAY DƯỚI tên thay vì hai cột riêng: bảng 9 cột rộng 1305px
                        không vừa khung 1134px, đẩy hết nút thao tác ra ngoài mép phải. */}
                    <td>
                      <Link href={DUONG.don(d.id)} className="qt-bang-ten">
                        {tenDon(d)}
                      </Link>
                      <small>
                        {tenNganh.get(d.duLieu.industryId) ?? "Chưa chọn ngành"} · {noiLamViec(d.duLieu) || "chưa có nơi làm"}
                      </small>
                    </td>
                    <td>{chuoiLuong(d.duLieu, "vi")}</td>
                    <td className="qt-phai qt-an-hep">{d.duLieu.vacancies ?? "—"}</td>
                    <td className="qt-khong-xuong qt-an-hep">
                      <span className="qt-the-nhan" style={{ flexWrap: "nowrap" }}>
                        {banDich(d)}
                      </span>
                    </td>
                    <td>
                      <span className="qt-bang-nhan">{huyHieu(d)}</span>
                    </td>
                    <td>
                      <div className="qt-bang-nut">
                        <Link href={DUONG.don(d.id)} className="qt-nut qt-nut-icon" aria-label={`Sửa đơn ${tenDon(d)}`} title="Sửa">
                          <Pencil aria-hidden />
                        </Link>
                        {thaoTac(d)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="qt-luoi-the">
          {ds.map((d) => (
            <article key={d.id} className={`qt-the${d.hien ? "" : " qt-dang-an"}`} aria-busy={ban?.id === d.id}>
              <Link href={DUONG.don(d.id)} aria-label={`Sửa đơn ${tenDon(d)}`} tabIndex={-1}>
                <AnhKho src={anhHien(d)} className="qt-the-anh" chuTrong="Chưa có ảnh" />
              </Link>
              <div className="qt-the-than">
                <div className="qt-the-nhan">
                  {huyHieu(d)}
                  {banDich(d)}
                </div>
                <Link href={DUONG.don(d.id)} className="qt-the-ten">
                  {tenDon(d)}
                </Link>
                <div className="qt-the-dong">
                  <Briefcase aria-hidden />
                  <span>{tenNganh.get(d.duLieu.industryId) ?? "Chưa chọn ngành"}</span>
                </div>
                <div className="qt-the-dong">
                  <MapPin aria-hidden />
                  <span>{noiLamViec(d.duLieu) || "Chưa có nơi làm"}</span>
                </div>
                <div className="qt-the-so">
                  <b>{chuoiLuong(d.duLieu, "vi")}</b>
                  <span>
                    <Users aria-hidden />
                    {d.duLieu.vacancies ?? 0} suất
                  </span>
                </div>
              </div>
              <div className="qt-the-chan">
                <Link href={DUONG.don(d.id)} className="qt-nut qt-chinh qt-nut-nho">
                  <Pencil aria-hidden />
                  Sửa
                </Link>
                {thaoTac(d)}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
