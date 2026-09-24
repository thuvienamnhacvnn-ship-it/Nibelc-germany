"use client";

import { Icon } from "@/components/ui/Icon";

/** Chưa có file PDF thật → mở hộp thoại in, người xem chọn "Lưu thành PDF". */
export function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {label}
      <Icon name="download" className="h-4 w-4 lg:h-[calc(15*var(--u))] lg:w-[calc(15*var(--u))]" strokeWidth={2} />
    </button>
  );
}
