/**
 * Tám mục dữ liệu NIBELC còn thiếu (mã CAN DIEN 01–08).
 *
 * Quy tắc tuyệt đối từ master prompt:
 *   - Không ai được tự điền tám mục này (kể cả Claude, kể cả ChatGPT).
 *   - `status: "blocked"` nghĩa là production KHÔNG render block liên quan.
 *   - Chỉ người có quyền mới đổi sang "approved", qua /admin/content.
 *
 * Giá trị thật sẽ nằm ở bảng `field_values` trong DB, không nằm trong repo.
 * File này chỉ khai báo *có những mục nào* và *chúng khóa cái gì*.
 */

export const FIELD_CODES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
] as const;

export type FieldCode = (typeof FIELD_CODES)[number];

export type FieldStatus = "blocked" | "approved";

export interface FieldDefinition {
  code: FieldCode;
  /** Tên tiếng Việt để người duyệt nội dung hiểu mình đang điền gì */
  label: string;
  /** Mô tả chính xác dữ liệu cần có, lấy từ docs/05-CAN-DIEN.md */
  requires: string;
  /** Những gì bị ẩn khi mục này chưa được duyệt */
  blocks: string;
  /** Không có dữ liệu này thì có được phép go-live không */
  blocksGoLive: boolean;
  status: FieldStatus;
}

export const FIELD_DEFINITIONS: Record<FieldCode, FieldDefinition> = {
  "01": {
    code: "01",
    label: "Pháp nhân & Impressum",
    requires:
      "Tên pháp nhân chính xác, Rechtsform, địa chỉ đăng ký, Geschäftsführer/Vertretungsberechtigte, Handelsregistergericht, HRB, USt-IdNr. nếu có, email, điện thoại.",
    blocks: "/impressum, structured data pháp nhân, chân trang pháp lý",
    // §5 TMG: site thương mại tại Đức bắt buộc có Impressum.
    blocksGoLive: true,
    status: "blocked",
  },
  "02": {
    code: "02",
    label: "Chuyên gia đại học — ngành cụ thể",
    requires:
      "Danh sách ngành cụ thể (IT, Ingenieurwesen, Pflege, BWL…). Không gộp chung nếu quy trình và đối tượng khác nhau.",
    blocks:
      "Route /branchen/akademische-fachkraefte (không publish, noindex, ngoài sitemap)",
    blocksGoLive: false,
    status: "blocked",
  },
  "03": {
    code: "03",
    label: "Mức lương",
    requires:
      "Theo từng nghề/vị trí: brutto, đơn vị giờ/tháng/năm, vùng, phụ cấp, nguồn và ngày áp dụng.",
    blocks: "Block lương ở mọi trang ngành",
    blocksGoLive: false,
    status: "blocked",
  },
  "04": {
    code: "04",
    label: "Yêu cầu tiếng Đức",
    requires:
      "Mức CEFR theo từng nghề/giai đoạn; ai kiểm tra; chứng chỉ nào được chấp nhận; có đào tạo bổ sung không.",
    blocks: "Block Anforderungen ở trang ngành",
    blocksGoLive: false,
    status: "blocked",
  },
  "05": {
    code: "05",
    label: "Số liệu thành tích",
    requires:
      "Số ứng viên, doanh nghiệp, đối tác, tỷ lệ thành công, retention, năm hoạt động — kèm phạm vi, kỳ đo và bằng chứng.",
    blocks: "Toàn bộ block trust/số liệu ở trang chủ và /fuer-unternehmen",
    blocksGoLive: false,
    status: "blocked",
  },
  "06": {
    code: "06",
    label: "Bộ nhận diện",
    requires:
      "Logo master và biến thể, mã màu, font có license, vùng an toàn, quy tắc nền sáng/tối, favicon, social mark.",
    blocks: "Favicon, OG image, biến thể logo nền tối",
    blocksGoLive: false,
    status: "blocked",
  },
  "07": {
    code: "07",
    label: "Phạm vi dịch vụ & chi phí",
    requires:
      "Ai trả phí gì; NIBELC trực tiếp làm hay phối hợp đối tác; cancellation/refund; dịch vụ ngoài gói.",
    blocks: "Block dịch vụ/chi phí ở /fuer-unternehmen và /vi/lo-trinh",
    blocksGoLive: false,
    status: "blocked",
  },
  "08": {
    code: "08",
    label: "Điều kiện ứng viên & thời gian",
    requires:
      "Bằng cấp/kinh nghiệm/tuổi nếu có cơ sở hợp pháp; thời gian dự kiến từng luồng; yếu tố gây chậm; tài liệu bắt buộc.",
    blocks: "Block điều kiện và timeline ở trang ngành và cổng ứng viên",
    blocksGoLive: false,
    status: "blocked",
  },
};

/** Những mục chưa duyệt mà chặn go-live. Dùng cho deployment checklist. */
export function goLiveBlockers(): FieldDefinition[] {
  return Object.values(FIELD_DEFINITIONS).filter(
    (f) => f.blocksGoLive && f.status !== "approved",
  );
}
