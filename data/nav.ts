import type { Bo } from "@/lib/i18n/dict";

/**
 * Menu chính — để ở file dữ liệu riêng, KHÔNG để trong Header.tsx.
 *
 * Header là client component; nếu Footer (server component) import hằng số từ
 * đó thì lúc dựng tĩnh giá trị về undefined và build đổ với lỗi
 * "NAV.map is not a function".
 *
 * `href` là đường dẫn GỐC (không tiền tố ngôn ngữ) — NavLink tự thêm /en|/de.
 * `label` đủ 3 ngôn ngữ; `ngan` là nhãn ngắn cho menu đáy điện thoại (5 ô hẹp).
 */
export interface MucMenu {
  href: string;
  label: Bo<string>;
  ngan: Bo<string>;
}

export const NAV: MucMenu[] = [
  {
    href: "/",
    label: { vi: "Trang chủ", en: "Home", de: "Startseite" },
    ngan: { vi: "Trang chủ", en: "Home", de: "Start" },
  },
  {
    href: "/don-hang",
    label: { vi: "Đơn hàng", en: "Jobs", de: "Stellenangebote" },
    ngan: { vi: "Đơn hàng", en: "Jobs", de: "Stellen" },
  },
  {
    href: "/du-hoc-nghe",
    label: { vi: "Du học nghề", en: "Vocational training", de: "Ausbildung" },
    ngan: { vi: "Du học nghề", en: "Training", de: "Ausbildung" },
  },
  {
    href: "/lo-trinh",
    label: { vi: "Lộ trình", en: "Your pathway", de: "Ihr Weg" },
    ngan: { vi: "Lộ trình", en: "Pathway", de: "Ihr Weg" },
  },
  {
    href: "/cam-nang",
    label: { vi: "Cẩm nang", en: "Guides", de: "Ratgeber" },
    ngan: { vi: "Cẩm nang", en: "Guides", de: "Ratgeber" },
  },
  {
    href: "/ve-chung-toi",
    label: { vi: "Về chúng tôi", en: "About us", de: "Über uns" },
    ngan: { vi: "Về chúng tôi", en: "About", de: "Über uns" },
  },
  {
    href: "/lien-he",
    label: { vi: "Liên hệ", en: "Contact", de: "Kontakt" },
    ngan: { vi: "Liên hệ", en: "Contact", de: "Kontakt" },
  },
];

export function mucMenu(href: string): MucMenu {
  const m = NAV.find((x) => x.href === href);
  if (!m) throw new Error(`data/nav.ts: không có mục ${href}`);
  return m;
}
