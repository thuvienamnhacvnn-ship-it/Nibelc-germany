"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Circle, Eye, EyeOff, History, LoaderCircle, Pencil, Plus, RotateCcw, SearchX, Trash2, type LucideIcon } from "lucide-react";
import type { MucNhatKy } from "@/lib/quan-tri/nhat-ky";
import { viecKhoiPhuc } from "../viec";
import { Rong } from "../_chung/Rong";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { DUONG } from "../_chung/duong";
import { gio, khoaNgay, ngay, ngayGioGiay, tieuDeNgay, tuongDoi } from "../_chung/dinh-dang";

/**
 * DÒNG THỜI GIAN CỦA NHẬT KÝ — dùng ở trang Nhật ký (đủ: nhóm theo ngày, lọc,
 * nút Khôi phục) và ở Tổng quan (bản gọn 8 dòng).
 *
 * `nay` do MÁY CHỦ truyền xuống: "Hôm nay", "5 phút trước" mà tính riêng ở hai
 * bên thì máy chủ và trình duyệt dựng lệch nhau vài giây là React báo lỗi.
 */

type Kieu = "them" | "sua" | "xoa" | "hien" | "an" | "khoi-phuc" | "khac";
const ICON: Record<Kieu, LucideIcon> = { them: Plus, sua: Pencil, xoa: Trash2, hien: Eye, an: EyeOff, "khoi-phuc": RotateCcw, khac: Circle };

function kieuCua(m: MucNhatKy): Kieu {
  if (m.moTa.startsWith("Khôi phục")) return "khoi-phuc";
  return m.viec === "them" || m.viec === "sua" || m.viec === "xoa" || m.viec === "hien" || m.viec === "an" ? m.viec : "khac";
}

export type ConLai = { don: string[]; bai: string[] };

/** liên kết tới form sửa nếu bản ghi còn tồn tại */
function duongToi(m: MucNhatKy, con: { don: Set<string>; bai: Set<string> }) {
  if (!m.banGhi) return null;
  if (m.bang === "don_hang" && con.don.has(m.banGhi)) return DUONG.don(m.banGhi);
  if (m.bang === "bai_viet" && con.bai.has(m.banGhi)) return DUONG.bai(m.banGhi);
  if (m.bang === "noi_dung") return DUONG.noiDung;
  return null;
}

function Muc({ m, con, nay, gon }: { m: MucNhatKy; con: { don: Set<string>; bai: Set<string> }; nay: Date; gon: boolean }) {
  const k = kieuCua(m);
  const Icon = ICON[k];
  const ten = m.ten ?? m.banGhi;
  const duong = duongToi(m, con);
  return (
    <li className="qt-dtg-muc">
      <span className={`qt-dtg-icon ${k}`} aria-hidden>
        <Icon />
      </span>
      <span className="qt-dtg-noi" aria-hidden />
      <div>
        <p className="qt-dtg-chu">
          <b>{m.moTa}</b>
          {ten && m.bang !== "nap-ban-dau" && (
            <>
              {" "}
              {duong ? <Link href={duong}>“{ten}”</Link> : <b>“{ten}”</b>}
            </>
          )}
        </p>
        <p className="qt-dtg-phu">
          <time dateTime={m.luc} title={ngayGioGiay(m.luc)}>
            {gon ? tuongDoi(m.luc, nay) : gio(m.luc)}
          </time>
          {!gon && m.banGhi && <> · Mã: {m.banGhi}</>}
        </p>
      </div>
      {!gon && (m.khoiPhucDuoc ? <NutKhoiPhuc m={m} /> : m.bang === "anh" ? <span className="qt-dtg-khong qt-dtg-cot3">Không khôi phục được</span> : <span />)}
    </li>
  );
}

function NutKhoiPhuc({ m }: { m: MucNhatKy }) {
  const hoi = useHoi();
  const tb = useThongBao();
  const router = useRouter();
  const [chay, setChay] = useState(false);
  const ten = m.ten ?? m.banGhi ?? "";
  return (
    <button
      type="button"
      className="qt-nut-nho qt-dtg-cot3"
      disabled={chay}
      aria-busy={chay}
      onClick={() =>
        hoi({
          tieuDe: `Khôi phục "${ten}" về bản trước thay đổi này?`,
          moTa: (
            <p>
              {m.viec === "xoa"
                ? "Mục đã xoá sẽ có lại như trước lúc xoá."
                : `Nội dung hiện tại sẽ bị thay bằng bản lúc ${gio(m.luc)} ngày ${ngay(m.luc)}. Bản hiện tại vẫn được giữ trong nhật ký.`}
            </p>
          ),
          nutXacNhan: "Khôi phục",
          dangChay: "Đang khôi phục…",
          nguyHiem: false,
          onXacNhan: async () => {
            setChay(true);
            try {
              const r = await viecKhoiPhuc(m.id);
              if (r.loi) return r.loi;
              tb.xong(`Đã khôi phục "${ten}".`);
              router.refresh();
            } finally {
              setChay(false);
            }
          },
        })
      }
    >
      {chay ? <LoaderCircle className="qt-quay" aria-hidden /> : <RotateCcw aria-hidden />}
      {chay ? "Đang khôi phục…" : "Khôi phục"}
    </button>
  );
}

/** Bản gọn cho Tổng quan: không nhóm ngày, không nút, giờ tương đối. */
export function NhatKyGon({ ds, conLai, nay }: { ds: MucNhatKy[]; conLai: ConLai; nay: string }) {
  const con = useMemo(() => ({ don: new Set(conLai.don), bai: new Set(conLai.bai) }), [conLai]);
  if (ds.length === 0) return <p className="qt-ghi-chu">Chưa có thay đổi nào được ghi lại.</p>;
  return (
    <ul className="qt-dtg">
      {ds.map((m) => (
        <Muc key={m.id} m={m} con={con} nay={new Date(nay)} gon />
      ))}
    </ul>
  );
}

const BANG = [
  ["", "Tất cả"],
  ["don_hang", "Đơn hàng"],
  ["bai_viet", "Bài viết"],
  ["anh", "Ảnh"],
  ["noi_dung", "Banner & nội dung"],
] as const;
const VIEC = [
  ["them", "Thêm"],
  ["sua", "Sửa"],
  ["xoa", "Xoá"],
  ["an-hien", "Ẩn / hiện"],
] as const;

export function NhatKyDayDu({ ds, conLai, nay }: { ds: MucNhatKy[]; conLai: ConLai; nay: string }) {
  const con = useMemo(() => ({ don: new Set(conLai.don), bai: new Set(conLai.bai) }), [conLai]);
  const [bang, setBang] = useState("");
  const [viec, setViec] = useState<string[]>([]);
  const bayGio = new Date(nay);

  const loc = ds.filter((m) => {
    if (bang && m.bang !== bang) return false;
    if (viec.length === 0) return true;
    return viec.includes(m.viec === "hien" || m.viec === "an" ? "an-hien" : m.viec);
  });
  const coLoc = !!bang || viec.length > 0;
  const xoaLoc = () => {
    setBang("");
    setViec([]);
  };

  // gom theo ngày (giờ Việt Nam), giữ thứ tự mới trước
  const nhom: { khoa: string; tieuDe: string; muc: MucNhatKy[] }[] = [];
  for (const m of loc) {
    const k = khoaNgay(m.luc);
    const cuoi = nhom[nhom.length - 1];
    if (cuoi?.khoa === k) cuoi.muc.push(m);
    else nhom.push({ khoa: k, tieuDe: tieuDeNgay(m.luc, bayGio), muc: [m] });
  }

  if (ds.length === 0) {
    return <Rong icon={History} tieuDe="Chưa có thay đổi nào" moTa="Mỗi lần thêm, sửa, ẩn hay xoá sẽ được ghi lại ở đây." />;
  }

  return (
    <>
      <div className="qt-cong-cu">
        <div className="qt-chip-nhom" role="group" aria-label="Lọc theo mục">
          {BANG.map(([k, chu]) => (
            <button key={k} type="button" className="qt-chip" aria-pressed={bang === k} onClick={() => setBang(k)}>
              {chu}
            </button>
          ))}
        </div>
        <div className="qt-chip-nhom" role="group" aria-label="Lọc theo loại việc">
          {VIEC.map(([k, chu]) => (
            <button
              key={k}
              type="button"
              className="qt-chip"
              aria-pressed={viec.includes(k)}
              onClick={() => setViec((cu) => (cu.includes(k) ? cu.filter((x) => x !== k) : [...cu, k]))}
            >
              {chu}
            </button>
          ))}
        </div>
      </div>
      <div className="qt-ket-qua" aria-live="polite">
        <span>
          Đang hiện {loc.length} trên {ds.length} thay đổi
        </span>
        {coLoc && (
          <button type="button" className="qt-lien-ket" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        )}
      </div>

      {loc.length === 0 ? (
        <Rong icon={SearchX} tieuDe="Không có thay đổi nào khớp bộ lọc">
          <button type="button" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        </Rong>
      ) : (
        <div className="qt-tam">
          {nhom.map((n) => (
            <section key={n.khoa}>
              <h2 className="qt-dtg-ngay">{n.tieuDe}</h2>
              <ul className="qt-dtg">
                {n.muc.map((m) => (
                  <Muc key={m.id} m={m} con={con} nay={bayGio} gon={false} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
