"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleCheck, X } from "lucide-react";
import type { Anh } from "@/lib/quan-tri/kho-anh";
import { useThongBao } from "./ThongBao";
import { dungLuong } from "./dinh-dang";

/**
 * TẢI ẢNH LÊN KHO — phần trình duyệt.
 *
 * Mỗi tệp một yêu cầu riêng tới POST /admin/api/anh, bằng XMLHttpRequest chứ
 * không `fetch`: chỉ XHR mới cho biết tiến độ GỬI (`upload.onprogress`), mà
 * ảnh 10 MB trên mạng điện thoại thì nhân viên cần thấy thanh chạy, không thì
 * tưởng treo rồi bấm lại. Mỗi tệp một yêu cầu cũng để một tệp hỏng không kéo
 * cả lô hỏng theo, và không chạm trần dung lượng của nginx.
 */

export const LOAI_NHAN = ["image/jpeg", "image/png", "image/webp"];
export const CHAP_NHAN = LOAI_NHAN.join(",");
export const NANG_TOI_DA = 15 * 1024 * 1024;
export const SO_TOI_DA = 20;
export const CHU_GIOI_HAN = "JPG, PNG, WebP · tối đa 15 MB mỗi ảnh · tối đa 20 ảnh mỗi lần";

/** Kiểm trước ở trình duyệt để khỏi gửi 15 MB lên rồi mới bị từ chối. Máy chủ vẫn kiểm lại. */
export function kiemTep(f: File): string | null {
  if (!LOAI_NHAN.includes(f.type)) return "Không phải tệp ảnh (chỉ nhận JPG, PNG, WebP).";
  if (f.size > NANG_TOI_DA) return "Ảnh nặng quá 15 MB.";
  return null;
}

/**
 * Gửi MỘT tệp. `thayId` có giá trị = thay tệp của ảnh đó (giữ id).
 * Trả về lời hứa + hàm huỷ.
 */
export function guiTep(tep: File, tienDo: (pt: number) => void, thayId?: string): { hua: Promise<Anh>; huy: () => void } {
  const xhr = new XMLHttpRequest();
  const hua = new Promise<Anh>((xong, hong) => {
    xhr.open("POST", thayId ? `/admin/api/anh/${encodeURIComponent(thayId)}` : "/admin/api/anh");
    xhr.responseType = "text";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) tienDo(Math.min(99, Math.round((e.loaded / e.total) * 100)));
    };
    xhr.onerror = () => hong(new Error("Mất kết nối khi đang tải. Bấm Thử lại."));
    xhr.onabort = () => hong(new Error("huy"));
    xhr.onload = () => {
      let j: { anh?: Anh | Anh[]; hong?: { loi: string }[]; loi?: string } = {};
      try {
        j = JSON.parse(xhr.responseText);
      } catch {
        /* máy chủ trả trang lỗi HTML (nginx 413…) — rơi xuống nhánh báo lỗi theo mã */
      }
      const a = Array.isArray(j.anh) ? j.anh[0] : j.anh;
      if (xhr.status >= 200 && xhr.status < 300 && a) return xong(a);
      const lyDo = j.hong?.[0]?.loi ?? j.loi ?? (xhr.status === 413 ? "Tệp nặng quá mức máy chủ cho phép" : `mã ${xhr.status}`);
      hong(new Error(`Máy chủ từ chối: ${lyDo.replace(/\.$/, "")}.`));
    };
    const fd = new FormData();
    fd.append("tep", tep);
    xhr.send(fd);
  });
  return { hua, huy: () => xhr.abort() };
}

export type MucTai = {
  id: number;
  tep: File;
  xemTruoc: string;
  trangThai: "cho" | "dang" | "xong" | "loi";
  pt: number;
  loi?: string;
  huy?: () => void;
};

/**
 * Hàng đợi tải lên: 2 tệp chạy cùng lúc, còn lại xếp hàng. `khiXong` được gọi
 * cho TỪNG ảnh ngay khi nó lên xong — để chèn vào đầu lưới mà không chờ cả lô.
 */
export function useTaiLen(khiXong: (a: Anh) => void) {
  const tb = useThongBao();
  const ds = useRef<MucTai[]>([]);
  const dem = useRef(0);
  const [, ve] = useState(0);
  const veLai = useCallback(() => ve((n) => n + 1), []);
  const khiXongRef = useRef(khiXong);
  khiXongRef.current = khiXong;
  /** lô đang chạy đã được báo tổng kết chưa */
  const daBao = useRef(true);

  const chay = useCallback(() => {
    const dang = ds.current.filter((m) => m.trangThai === "dang").length;
    const cho = ds.current.filter((m) => m.trangThai === "cho").slice(0, Math.max(0, 2 - dang));
    for (const m of cho) {
      m.trangThai = "dang";
      m.pt = 0;
      const g = guiTep(m.tep, (pt) => {
        m.pt = pt;
        veLai();
      });
      m.huy = g.huy;
      g.hua
        .then((a) => {
          m.trangThai = "xong";
          m.pt = 100;
          khiXongRef.current(a);
        })
        .catch((e: Error) => {
          if (e.message === "huy") ds.current = ds.current.filter((x) => x !== m);
          else {
            m.trangThai = "loi";
            m.loi = e.message;
          }
        })
        .finally(() => {
          m.huy = undefined;
          veLai();
          chay();
        });
    }
    veLai();
    // cả lô đã ngã ngũ → một lời tổng kết
    if (!daBao.current && ds.current.length > 0 && ds.current.every((m) => m.trangThai === "xong" || m.trangThai === "loi")) {
      daBao.current = true;
      const ok = ds.current.filter((m) => m.trangThai === "xong").length;
      const hong = ds.current.length - ok;
      if (ok > 0) tb.xong(`Đã tải lên ${ok} ảnh.`);
      if (hong > 0) tb.loi(`${hong} ảnh không tải được. Xem chi tiết trong danh sách.`);
    }
  }, [tb, veLai]);

  const them = useCallback(
    (tepMoi: FileList | File[] | null | undefined) => {
      let tep = Array.from(tepMoi ?? []);
      if (tep.length === 0) return;
      if (tep.length > SO_TOI_DA) {
        tb.canhBao(`Chỉ tải ${SO_TOI_DA} ảnh mỗi lần. Đã bỏ qua ${tep.length - SO_TOI_DA} ảnh còn lại.`);
        tep = tep.slice(0, SO_TOI_DA);
      }
      // lô trước đã xong hết thì dọn, để bộ đếm "Đang tải x/y" tính trên lô mới
      if (ds.current.every((m) => m.trangThai === "xong")) {
        ds.current.forEach((m) => URL.revokeObjectURL(m.xemTruoc));
        ds.current = [];
      }
      for (const f of tep) {
        const loi = kiemTep(f);
        ds.current.push({
          id: ++dem.current,
          tep: f,
          xemTruoc: URL.createObjectURL(f),
          trangThai: loi ? "loi" : "cho",
          pt: 0,
          loi: loi ?? undefined,
        });
      }
      daBao.current = false;
      chay();
    },
    [chay, tb],
  );

  const bo = useCallback(
    (id: number) => {
      const m = ds.current.find((x) => x.id === id);
      if (!m) return;
      if (m.huy) return m.huy(); // đang gửi: huỷ, nhánh catch sẽ gỡ khỏi danh sách
      URL.revokeObjectURL(m.xemTruoc);
      ds.current = ds.current.filter((x) => x !== m);
      veLai();
    },
    [veLai],
  );

  const thuLai = useCallback(
    (id: number) => {
      const m = ds.current.find((x) => x.id === id);
      if (!m || kiemTep(m.tep)) return;
      m.trangThai = "cho";
      m.loi = undefined;
      daBao.current = false;
      chay();
    },
    [chay],
  );

  const don = useCallback(() => {
    ds.current.forEach((m) => URL.revokeObjectURL(m.xemTruoc));
    ds.current = [];
    veLai();
  }, [veLai]);

  // rời trang: huỷ các yêu cầu đang gửi và trả bộ nhớ ảnh xem trước
  useEffect(
    () => () => {
      ds.current.forEach((m) => {
        m.huy?.();
        URL.revokeObjectURL(m.xemTruoc);
      });
    },
    [],
  );

  return { ds: ds.current, them, bo, thuLai, don };
}

/** Danh sách tệp đang tải, mỗi tệp một hàng có thanh tiến độ. */
export function DanhSachTai({ tai, gon = false }: { tai: ReturnType<typeof useTaiLen>; gon?: boolean }) {
  const { ds } = tai;
  if (ds.length === 0) return null;
  const tong = ds.length;
  const ok = ds.filter((m) => m.trangThai === "xong").length;
  const hong = ds.filter((m) => m.trangThai === "loi").length;
  const conChay = ok + hong < tong;

  return (
    <div className={`qt-tai-ds${gon ? " qt-gon" : ""}`}>
      <div className="qt-tai-dau">
        <span aria-live="polite">
          {conChay ? `Đang tải ${ok + hong}/${tong} ảnh` : hong > 0 ? `Đã tải ${ok}/${tong} ảnh · ${hong} ảnh lỗi` : `Đã tải xong ${tong} ảnh`}
        </span>
        {!conChay && (
          <button type="button" className="qt-nut-nho" onClick={tai.don}>
            Dọn danh sách
          </button>
        )}
      </div>
      {ds.map((m) => (
        <div key={m.id} className="qt-tai">
          <img src={m.xemTruoc} alt="" />
          <div style={{ minWidth: 0 }}>
            <b title={m.tep.name}>{m.tep.name}</b>
            {m.trangThai === "xong" ? (
              <small className="qt-ok">Đã tải xong</small>
            ) : m.trangThai === "loi" ? (
              <small className="qt-hong">{m.loi}</small>
            ) : (
              <small>
                {dungLuong(m.tep.size)} · {m.trangThai === "dang" ? `Đang tải… ${m.pt}%` : "Đang chờ"}
              </small>
            )}
            {(m.trangThai === "dang" || m.trangThai === "cho") && (
              <div className="qt-tien-do" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={m.pt} aria-label={`Tiến độ tải ${m.tep.name}`}>
                <i style={{ width: `${m.pt}%` }} />
              </div>
            )}
          </div>
          <div>
            {m.trangThai === "xong" ? (
              <CircleCheck aria-label="Đã tải xong" />
            ) : (
              <>
                {m.trangThai === "loi" && !kiemTep(m.tep) && (
                  <button type="button" className="qt-nut-nho" onClick={() => tai.thuLai(m.id)}>
                    Thử lại
                  </button>
                )}
                <button
                  type="button"
                  className="qt-nut-icon"
                  aria-label={m.trangThai === "loi" ? "Bỏ tệp này" : "Huỷ tải tệp này"}
                  title={m.trangThai === "loi" ? "Bỏ tệp này" : "Huỷ tải tệp này"}
                  onClick={() => tai.bo(m.id)}
                >
                  <X aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
