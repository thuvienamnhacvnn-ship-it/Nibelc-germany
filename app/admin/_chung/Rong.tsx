import type { LucideIcon } from "lucide-react";

/**
 * TRẠNG THÁI RỖNG. Luôn nói rõ vì sao trống và đưa sẵn một việc để làm tiếp
 * (trừ Nhật ký chưa có gì — ở đó không có hành động nào hợp lý).
 */
export function Rong({
  icon: Icon,
  tieuDe,
  moTa,
  gon = false,
  children,
}: {
  icon: LucideIcon;
  tieuDe: string;
  moTa?: React.ReactNode;
  /** bản gọn đặt trong một tấm: không viền, ít đệm */
  gon?: boolean;
  /** hàng nút: tối đa một nút chính + một nút thường */
  children?: React.ReactNode;
}) {
  return (
    <div className={`qt-rong${gon ? " qt-gon" : ""}`}>
      <div>
        <span className="qt-rong-icon" aria-hidden>
          <Icon />
        </span>
        <h3>{tieuDe}</h3>
        {moTa && <p>{moTa}</p>}
        {children && <div className="qt-hang-nut">{children}</div>}
      </div>
    </div>
  );
}

/**
 * KHUNG XƯƠNG khi đang tải. Chỉ nhịp mờ, KHÔNG có vệt sáng chạy ngang (vệt
 * sáng là "shine", Sếp cấm).
 */
export function Xuong({ cao, rong, bo, tyLe }: { cao?: number | string; rong?: number | string; bo?: number; tyLe?: string }) {
  return <div className="qt-xuong" style={{ height: cao, width: rong, borderRadius: bo, aspectRatio: tyLe }} />;
}

/** Bọc vùng xương: báo cho trình đọc màn hình là đang tải. */
export function VungXuong({ children }: { children: React.ReactNode }) {
  return (
    <div className="qt-khung" aria-busy="true">
      <span className="qt-an-nhin">Đang tải…</span>
      {children}
    </div>
  );
}

/** Đầu trang dạng xương — giữ đúng chỗ của tiêu đề thật để trang không nhảy. */
export function DauXuong() {
  return (
    <div className="qt-dau-trang" aria-hidden>
      <div>
        <Xuong cao={30} rong={220} bo={6} />
        <div style={{ height: 8 }} />
        <Xuong cao={16} rong="min(420px, 80%)" bo={6} />
      </div>
    </div>
  );
}

/** Lưới thẻ xương dùng chung cho Đơn hàng và Bài viết. */
export function LuoiTheXuong() {
  return (
    <>
      <Xuong cao={66} bo={14} />
      <div style={{ height: 16 }} />
      <div className="qt-luoi-the">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="qt-the">
            <Xuong tyLe="16/9" bo={0} />
            <div className="qt-the-than">
              <Xuong cao={14} rong="80%" bo={6} />
              <Xuong cao={14} rong="60%" bo={6} />
              <Xuong cao={14} rong="40%" bo={6} />
              <Xuong cao={44} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** Form hai cột dạng xương. */
export function FormXuong() {
  return (
    <div className="qt-form-2cot">
      <div className="qt-cot-trai" style={{ display: "grid", gap: 16 }}>
        <Xuong cao={220} bo={14} />
        <Xuong cao={220} bo={14} />
        <Xuong cao={220} bo={14} />
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        <Xuong cao={260} bo={14} />
        <Xuong cao={160} bo={14} />
      </div>
    </div>
  );
}
