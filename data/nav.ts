/**
 * Menu chính — để ở file dữ liệu riêng, KHÔNG để trong Header.tsx.
 *
 * Header là client component; nếu Footer (server component) import hằng số từ
 * đó thì lúc dựng tĩnh giá trị về undefined và build đổ với lỗi
 * "NAV.map is not a function".
 */
export const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/don-hang", label: "Đơn hàng" },
  { href: "/du-hoc-nghe", label: "Du học nghề" },
  { href: "/lo-trinh", label: "Lộ trình" },
  { href: "/cam-nang", label: "Cẩm nang" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
  { href: "/lien-he", label: "Liên hệ" },
];
