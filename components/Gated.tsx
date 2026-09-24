import type { ReactNode } from "react";
import {
  fieldDefinition,
  isApproved,
  shouldShowPlaceholder,
} from "@/lib/field-gate";
import type { FieldCode } from "@/content/fields";

interface GatedProps {
  code: FieldCode;
  children: ReactNode;
}

/**
 * Bọc quanh mọi block phụ thuộc một mục CAN DIEN.
 *
 *   production + chưa duyệt  → không render gì (null)
 *   dev + chưa duyệt         → khung cảnh báo nói rõ đang thiếu dữ liệu nào
 *   đã duyệt                 → render children
 */
export function Gated({ code, children }: GatedProps) {
  if (isApproved(code)) return <>{children}</>;

  if (!shouldShowPlaceholder(code)) return null;

  const def = fieldDefinition(code);

  return (
    <div
      role="note"
      data-field-gate={code}
      className="rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-warning)] bg-amber-50 p-5 text-sm"
    >
      <p className="font-semibold text-[var(--color-warning)]">
        Thiếu dữ liệu — mục {def.code}: {def.label}
      </p>
      <p className="mt-2 text-[var(--color-ink)]">{def.requires}</p>
      <p className="mt-2 text-[var(--color-ink)]/70">
        Khóa: {def.blocks}
        {def.blocksGoLive ? " · CHẶN GO-LIVE" : ""}
      </p>
      <p className="mt-2 text-xs text-[var(--color-ink)]/60">
        Khung này chỉ hiện khi chạy development. Production sẽ ẩn hẳn block.
      </p>
    </div>
  );
}
