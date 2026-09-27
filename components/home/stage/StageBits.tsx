import { Icon } from "@/components/ui/Icon";

/**
 * Các mảnh dùng chung của banner trang chủ (bản desktop và bản điện thoại).
 */

/** Lá cờ Đức trong vòng tròn — vẽ bằng CSS, không cần thêm file ảnh. */
export function FlagDE({ size }: { size: string }) {
  return (
    <span
      className="inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-white/50"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="block h-1/3 w-full bg-[#111]" />
      <span className="block h-1/3 w-full bg-[#dd0000]" />
      <span className="block h-1/3 w-full bg-[#ffce00]" />
    </span>
  );
}

/** Lá cờ Việt Nam trong vòng tròn — dùng ở ô chọn ngôn ngữ của mẫu. */
export function FlagVN({ size }: { size: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#da251d] ring-1 ring-white/50"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="text-[#ff0] leading-none" style={{ fontSize: `calc(${size} * .72)` }}>
        ★
      </span>
    </span>
  );
}

/** Ô số liệu nhỏ trong thẻ đơn hàng: icon viền vàng + số + nhãn. */
export function Fact({
  icon,
  value,
  label,
  u,
  compact = false,
}: {
  icon: string;
  value: string;
  label: string;
  /** Hàm đổi px của ảnh mẫu sang CSS */
  u: (n: number) => string;
  compact?: boolean;
}) {
  const box = compact ? 26 : 34;
  return (
    <span className="flex min-w-0 items-center" style={{ gap: u(compact ? 7 : 10) }}>
      <span
        className="flex shrink-0 items-center justify-center rounded-md border border-[var(--nb-gold-line)] text-[var(--nb-gold)]"
        style={{ width: u(box), height: u(box) }}
      >
        <Icon name={icon} className="shrink-0" style={{ width: u(box * 0.55), height: u(box * 0.55) }} strokeWidth={1.7} />
      </span>
      <span className="min-w-0 leading-tight">
        <b className="block font-bold text-white" style={{ fontSize: u(compact ? 14 : 17) }}>
          {value}
        </b>
        <span className="block truncate text-white/60" style={{ fontSize: u(compact ? 10 : 12) }}>
          {label}
        </span>
      </span>
    </span>
  );
}
