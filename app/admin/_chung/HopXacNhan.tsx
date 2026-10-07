"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { CircleHelp, LoaderCircle, TriangleAlert } from "lucide-react";
import { AnhKho } from "./AnhKho";
import { chuLoi } from "./dinh-dang";

/**
 * HỘP XÁC NHẬN — một hộp dùng chung cho mọi thao tác xoá / khôi phục / rời
 * trang chưa lưu. Thay hẳn `window.confirm`: hộp của trình duyệt không cho
 * hiện ảnh của thứ sắp xoá, không nói được hậu quả, và nút mặc định là "OK".
 *
 * Dùng thẻ <dialog> gốc: có sẵn Esc, giữ tiêu điểm bàn phím, không cần gói.
 * Tiêu điểm mặc định đặt vào nút HUỶ — gõ Enter theo quán tính không xoá gì.
 */

export type YeuCauXacNhan = {
  tieuDe: string;
  moTa: React.ReactNode;
  /** ảnh nhỏ của mục sắp xử lý; chuỗi rỗng = hiện ô giữ chỗ; bỏ trống = không có ảnh */
  anh?: string | null;
  anhVuong?: boolean;
  nutXacNhan: string;
  nutHuy?: string;
  /** true (mặc định) = nút đỏ + icon cảnh báo */
  nguyHiem?: boolean;
  /** chữ trên nút khi đang chạy */
  dangChay?: string;
  /** Trả chuỗi = lời báo lỗi (hộp ở lại); ném lỗi cũng vậy. Không trả gì = xong, hộp đóng. */
  onXacNhan: () => Promise<string | void> | string | void;
};

const Ngu = createContext<((y: YeuCauXacNhan) => void) | null>(null);

/** `const hoi = useHoi(); hoi({ tieuDe, moTa, nutXacNhan, onXacNhan })` */
export function useHoi() {
  const h = useContext(Ngu);
  if (!h) throw new Error("useHoi phải nằm trong khung quản trị");
  return h;
}

export function VungXacNhan({ children }: { children: React.ReactNode }) {
  const [yc, setYc] = useState<YeuCauXacNhan | null>(null);
  const [chay, setChay] = useState(false);
  const [loi, setLoi] = useState("");
  const hop = useRef<HTMLDialogElement>(null);
  const nutHuy = useRef<HTMLButtonElement>(null);
  const idTieuDe = useId();
  const idMoTa = useId();

  const hoi = useCallback((y: YeuCauXacNhan) => {
    setLoi("");
    setChay(false);
    setYc(y);
  }, []);

  useEffect(() => {
    const d = hop.current;
    if (!d) return;
    if (yc && !d.open) {
      d.showModal();
      nutHuy.current?.focus();
    }
    if (!yc && d.open) d.close();
  }, [yc]);

  async function dongY() {
    if (!yc || chay) return;
    setChay(true);
    setLoi("");
    try {
      const r = await yc.onXacNhan();
      if (typeof r === "string" && r) {
        setLoi(r);
        setChay(false);
        return;
      }
      setYc(null);
    } catch (e) {
      setLoi(chuLoi(e));
    }
    setChay(false);
  }

  const nguy = yc?.nguyHiem !== false;

  return (
    <Ngu.Provider value={hoi}>
      {children}
      <dialog
        ref={hop}
        className="qt-hop qt-hop-xn"
        role="alertdialog"
        aria-labelledby={idTieuDe}
        aria-describedby={idMoTa}
        // Esc: đang chạy thì không cho đóng — đóng giữa chừng là không biết việc đã xong hay chưa
        onCancel={(e) => {
          e.preventDefault();
          if (!chay) setYc(null);
        }}
        onClose={() => setYc(null)}
        // bấm ra nền = Huỷ. Chỉ tính khi bấm đúng vào chính thẻ dialog (phần nền).
        onClick={(e) => {
          if (e.target === hop.current && !chay) setYc(null);
        }}
      >
        {yc && (
          <>
            <div className="qt-hop-xn-dau">
              <span className={`qt-hop-icon${nguy ? " qt-do" : ""}`} aria-hidden>
                {nguy ? <TriangleAlert /> : <CircleHelp />}
              </span>
              <h2 id={idTieuDe}>{yc.tieuDe}</h2>
            </div>
            <div className="qt-hop-xn-than">
              {yc.anh !== undefined && <AnhKho src={yc.anh} className={`qt-hop-xn-anh${yc.anhVuong ? " qt-vuong" : ""}`} nho />}
              <div id={idMoTa}>{yc.moTa}</div>
            </div>
            {loi && <p className="qt-loi">Không làm được: {loi}</p>}
            <div className="qt-hop-xn-nut">
              <button type="button" ref={nutHuy} disabled={chay} onClick={() => setYc(null)}>
                {yc.nutHuy ?? "Huỷ"}
              </button>
              <button type="button" className={nguy ? "qt-nguy-dac" : "qt-chinh"} disabled={chay} aria-busy={chay} onClick={dongY}>
                {chay && <LoaderCircle className="qt-quay" aria-hidden />}
                {chay ? (yc.dangChay ?? "Đang làm…") : yc.nutXacNhan}
              </button>
            </div>
          </>
        )}
      </dialog>
    </Ngu.Provider>
  );
}
