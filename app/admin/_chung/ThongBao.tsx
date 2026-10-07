"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

/**
 * THÔNG BÁO (toast) — tự dựng, không cài gói.
 *
 * Thành công / tin / cảnh báo tự tắt; LỖI thì không: nhân viên quay đi một
 * nhịp là lỡ mất lý do không lưu được. Rê chuột hoặc đưa tiêu điểm vào thì
 * dừng đếm giờ để kịp đọc và kịp bấm "Hoàn tác".
 */

type Loai = "xong" | "loi" | "canh-bao" | "tin";
type Muc = { id: number; loai: Loai; chu: string; song: number; hoanTac?: () => void };

type Api = {
  xong: (chu: string, tuy?: { hoanTac?: () => void }) => void;
  loi: (chu: string) => void;
  canhBao: (chu: string) => void;
  tin: (chu: string) => void;
  /** gỡ mọi toast LỖI đang treo — gọi khi việc vừa lỗi nay đã làm xong, kẻo lời báo đỏ cũ nằm cạnh lời báo xanh mới */
  xoaLoi: () => void;
};

const Ngu = createContext<Api | null>(null);

export function useThongBao(): Api {
  const a = useContext(Ngu);
  if (!a) throw new Error("useThongBao phải nằm trong khung quản trị");
  return a;
}

const ICON = { xong: CircleCheck, loi: CircleAlert, "canh-bao": TriangleAlert, tin: Info };

export function VungThongBao({ children }: { children: React.ReactNode }) {
  const [ds, setDs] = useState<Muc[]>([]);
  const dem = useRef(0);

  const them = useCallback((loai: Loai, chu: string, song: number, hoanTac?: () => void) => {
    setDs((cu) => {
      const moi = [...cu, { id: ++dem.current, loai, chu, song, hoanTac }];
      // Tối đa 3 cái cùng lúc; đẩy cái cũ nhất KHÔNG phải lỗi ra trước.
      while (moi.length > 3) {
        const i = moi.findIndex((m) => m.loai !== "loi");
        moi.splice(i < 0 ? 0 : i, 1);
      }
      return moi;
    });
  }, []);
  const bo = useCallback((id: number) => setDs((cu) => cu.filter((m) => m.id !== id)), []);

  const api = useMemo<Api>(
    () => ({
      xong: (chu, tuy) => them("xong", chu, tuy?.hoanTac ? 8000 : 4000, tuy?.hoanTac),
      loi: (chu) => them("loi", chu, 0),
      canhBao: (chu) => them("canh-bao", chu, 6000),
      tin: (chu) => them("tin", chu, 4000),
      xoaLoi: () => setDs((cu) => (cu.some((m) => m.loai === "loi") ? cu.filter((m) => m.loai !== "loi") : cu)),
    }),
    [them],
  );

  const ve = (m: Muc) => <Toast key={m.id} muc={m} dong={() => bo(m.id)} />;

  return (
    <Ngu.Provider value={api}>
      {children}
      {/* Hai vùng live luôn có mặt trong DOM: vùng chỉ được chèn vào cùng lúc
          với nội dung thì trình đọc màn hình thường bỏ qua lần đọc đầu. */}
      <div className="qt-toast-vung">
        <div role="status" aria-live="polite">
          {ds.filter((m) => m.loai !== "loi").map(ve)}
        </div>
        <div role="alert" aria-live="assertive">
          {ds.filter((m) => m.loai === "loi").map(ve)}
        </div>
      </div>
    </Ngu.Provider>
  );
}

function Toast({ muc, dong }: { muc: Muc; dong: () => void }) {
  const Icon = ICON[muc.loai];
  const conLai = useRef(muc.song);
  const batDau = useRef(0);
  const hen = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dongRef = useRef(dong);
  dongRef.current = dong;

  const chay = useCallback(() => {
    if (!muc.song || hen.current) return;
    batDau.current = Date.now();
    hen.current = setTimeout(() => dongRef.current(), conLai.current);
  }, [muc.song]);
  const dung = useCallback(() => {
    if (!hen.current) return;
    clearTimeout(hen.current);
    hen.current = null;
    conLai.current = Math.max(600, conLai.current - (Date.now() - batDau.current));
  }, []);
  useEffect(() => {
    chay();
    return () => {
      if (hen.current) clearTimeout(hen.current);
      hen.current = null;
    };
  }, [chay]);

  return (
    <div className={`qt-toast ${muc.loai}`} onMouseEnter={dung} onMouseLeave={chay} onFocus={dung} onBlur={chay}>
      <Icon aria-hidden />
      <p>{muc.chu}</p>
      <div className="qt-toast-phai">
        {muc.hoanTac && (
          <button
            type="button"
            className="qt-lien-ket"
            onClick={() => {
              muc.hoanTac?.();
              dong();
            }}
          >
            Hoàn tác
          </button>
        )}
        <button type="button" className="qt-toast-dong" aria-label="Đóng thông báo" onClick={dong}>
          <X aria-hidden />
        </button>
      </div>
      {muc.hoanTac && <span className="qt-toast-dem" style={{ animationDuration: `${muc.song}ms` }} aria-hidden />}
    </div>
  );
}
