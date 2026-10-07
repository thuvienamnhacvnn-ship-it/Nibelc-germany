import { DauXuong, VungXuong, Xuong } from "./_chung/Rong";

/**
 * Khung xương dùng cho Tổng quan — và là mặc định cho mọi trang con chưa có
 * `loading.tsx` riêng (nhật ký, banner, đổi mật khẩu): thanh bên hiện ngay,
 * chỉ vùng nội dung là xương.
 */
export default function DangTai() {
  return (
    <>
      <DauXuong />
      <VungXuong>
        <div className="qt-so-luoi">
          {Array.from({ length: 4 }, (_, i) => (
            <Xuong key={i} cao={132} bo={14} />
          ))}
        </div>
        <div className="qt-hai-cot qt-cach">
          <Xuong cao={280} bo={14} />
          <Xuong cao={280} bo={14} />
        </div>
      </VungXuong>
    </>
  );
}
