/**
 * ẢNH MINH HOẠ MẶC ĐỊNH CỦA BÀI CẨM NANG — cho bài CHƯA có ảnh bìa riêng.
 *
 * Web công khai (components/guide/GuideHub.tsx) xoay vòng 8 tấm này theo VỊ
 * TRÍ bài trong danh sách đang hiện: bài đầu lấy tấm 0, bài thứ p lấy tấm
 * p % 8. File này cho trang quản trị tính ra ĐÚNG tấm web đang hiện, để danh
 * sách bài trong admin không phải một dãy ô trống trong khi ngoài web bài nào
 * cũng có ảnh.
 *
 * TODO: GuideHub.tsx vẫn giữ một bản danh sách y hệt (hằng `ANH`). Đổi ảnh ở
 * một nơi phải đổi nơi kia — nên cho GuideHub import `ANH_BAI_MAC_DINH` từ đây
 * để còn một nguồn. File không đụng CSDL nên dùng được ở cả client component.
 */
export const ANH_BAI_MAC_DINH = [
  "/assets/jobs/handel/01-hero-16x9.jpg",
  "/assets/jobs/gastronomie/04-detail-closeup.jpg",
  "/assets/jobs/it/01-hero-16x9.jpg",
  "/assets/jobs/logistik/01-hero-16x9.jpg",
  "/assets/jobs/elektro/04-detail-closeup.jpg",
  "/assets/jobs/soziales/01-hero-16x9.jpg",
  "/assets/jobs/mechanik/01-hero-16x9.jpg",
  "/assets/jobs/landwirtschaft/01-hero-16x9.jpg",
] as const;

/**
 * id bài → ảnh minh hoạ web đang hiện cho bài đó. `ds` phải theo đúng thứ tự
 * web (lietKeBaiViet trả sẵn). Chỉ tính bài cẩm nang ĐANG HIỆN: bài đang ẩn
 * hay bài cộng đồng không có mặt ngoài web nên không có tấm nào "đang dùng".
 * Vị trí tính trên danh sách tiếng Việt, chưa lọc chuyên mục — đúng cảnh mặc
 * định khi khách mở /cam-nang.
 */
export function banDoAnhMacDinhBai(ds: { id: string; loai: string; hien: boolean }[]): Record<string, string> {
  const m: Record<string, string> = {};
  let p = 0;
  for (const b of ds) {
    if (b.loai !== "cam-nang" || !b.hien) continue;
    m[b.id] = ANH_BAI_MAC_DINH[p % ANH_BAI_MAC_DINH.length]!;
    p++;
  }
  return m;
}
