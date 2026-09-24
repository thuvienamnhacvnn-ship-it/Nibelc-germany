import {
  FIELD_DEFINITIONS,
  type FieldCode,
  type FieldDefinition,
} from "@/content/fields";

/**
 * Cổng chặn nội dung chưa được duyệt.
 *
 * Lý do tồn tại: master prompt cấm render bất kỳ chuỗi "[CẦN ĐIỀN]" nào ra
 * production, và cấm bịa nội dung thay thế. Nên chỗ nào phụ thuộc dữ liệu
 * chưa có thì **không render gì cả** — không render text mờ, không render
 * "coming soon", không render số ví dụ.
 *
 * Trong development thì ngược lại: phải thấy rõ chỗ nào đang thiếu, nếu
 * không sẽ không ai biết mà đi đòi dữ liệu.
 */

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Có được phép hiển thị nội dung phụ thuộc mục này không. */
export function isApproved(code: FieldCode): boolean {
  return FIELD_DEFINITIONS[code].status === "approved";
}

/**
 * Trả về giá trị nếu mục đã duyệt, ngược lại trả về null.
 *
 * Dùng cho dữ liệu: `const luong = gate("03", data.salary)`.
 * null nghĩa là gọi bên ngoài phải bỏ hẳn block, không phải render rỗng.
 */
export function gate<T>(code: FieldCode, value: T | null | undefined): T | null {
  if (!isApproved(code)) return null;
  if (value === null || value === undefined) return null;
  return value;
}

/** Có nên vẽ khung placeholder cảnh báo không (chỉ ở dev). */
export function shouldShowPlaceholder(code: FieldCode): boolean {
  return !isApproved(code) && !isProduction();
}

export function fieldDefinition(code: FieldCode): FieldDefinition {
  return FIELD_DEFINITIONS[code];
}
