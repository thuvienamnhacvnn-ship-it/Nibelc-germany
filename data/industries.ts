import type { Industry } from "@/types/industry";

/**
 * TAXONOMY 12 NHÓM NGÀNH — khoá cứng theo KIT, mã 01–12 không đổi.
 *
 * Tám nhóm đầu có ảnh phong bì riêng đã tách từ sprite Sếp gửi. Bốn nhóm cuối
 * chưa có phong bì; giao diện dựng phong bì cho chúng bằng CSS theo đúng dáng
 * của tám cái kia, KHÔNG vẽ lại kiểu khác.
 */
export const INDUSTRIES: Industry[] = [
  {
    id: "pflege",
    slug: "dieu-duong-y-te",
    code: "01",
    titleVi: "Điều dưỡng / Y tế",
    titleDe: "Pflege & Gesundheit",
    icon: "Stethoscope",
    envelope: "/assets/industries/pflege-envelope.png",
    cover: "/assets/jobs/soziales/01-hero-16x9.jpg",
    accent: "#2F8FE0",
  },
  {
    id: "gastronomie",
    slug: "nha-hang-khach-san",
    code: "02",
    titleVi: "Nhà hàng / Khách sạn",
    titleDe: "Gastronomie & Hotellerie",
    icon: "UtensilsCrossed",
    envelope: "/assets/industries/gastronomie-envelope.png",
    cover: "/assets/jobs/gastronomie/01-hero-16x9.jpg",
    accent: "#D9B878",
  },
  {
    id: "elektro",
    slug: "dien-dien-tu",
    code: "03",
    titleVi: "Điện / Điện tử",
    titleDe: "Elektrotechnik",
    icon: "Plug",
    envelope: "/assets/industries/elektro-envelope.png",
    cover: "/assets/jobs/elektro/01-hero-16x9.jpg",
    accent: "#2F8FE0",
  },
  {
    id: "mechanik",
    slug: "co-khi-han",
    code: "04",
    titleVi: "Cơ khí / Hàn",
    titleDe: "Metall & Schweißen",
    icon: "Cog",
    envelope: "/assets/industries/mechanik-envelope.png",
    cover: "/assets/jobs/mechanik/01-hero-16x9.jpg",
    accent: "#E0AC3D",
  },
  {
    id: "logistik",
    slug: "kho-van-logistics",
    code: "05",
    titleVi: "Kho vận / Logistics",
    titleDe: "Logistik",
    icon: "Package",
    envelope: "/assets/industries/logistik-envelope.png",
    cover: "/assets/jobs/logistik/01-hero-16x9.jpg",
    accent: "#D9B878",
  },
  {
    id: "kosmetik",
    slug: "nail-kosmetik",
    code: "06",
    titleVi: "Nail / Kosmetik",
    titleDe: "Beauty & Kosmetik",
    icon: "Flower2",
    envelope: "/assets/industries/kosmetik-envelope.png",
    cover: null,
    accent: "#D9B878",
  },
  {
    id: "bau",
    slug: "xay-dung-noi-that",
    code: "07",
    titleVi: "Xây dựng / Nội thất",
    titleDe: "Bau & Innenausbau",
    icon: "HardHat",
    envelope: "/assets/industries/bau-envelope.png",
    cover: null,
    accent: "#E0AC3D",
  },
  {
    id: "automotive",
    slug: "o-to-ky-thuat",
    code: "08",
    titleVi: "Ô tô / Kỹ thuật",
    titleDe: "Automotive & Technik",
    icon: "Car",
    envelope: "/assets/industries/automotive-envelope.png",
    cover: null,
    accent: "#2F8FE0",
  },
  {
    id: "it",
    slug: "cong-nghe-thong-tin",
    code: "09",
    titleVi: "Công nghệ thông tin",
    titleDe: "IT",
    icon: "MonitorSmartphone",
    envelope: null,
    cover: "/assets/jobs/it/01-hero-16x9.jpg",
    accent: "#2F8FE0",
  },
  {
    id: "handel",
    slug: "ban-hang-thuong-mai",
    code: "10",
    titleVi: "Bán hàng / Thương mại",
    titleDe: "Handel & Verkauf",
    icon: "ShoppingCart",
    envelope: null,
    cover: "/assets/jobs/handel/01-hero-16x9.jpg",
    accent: "#D9B878",
  },
  {
    id: "landwirtschaft",
    slug: "nong-nghiep-lam-vuon",
    code: "11",
    titleVi: "Nông nghiệp / Làm vườn",
    titleDe: "Landwirtschaft & Gartenbau",
    icon: "Sprout",
    envelope: null,
    cover: "/assets/jobs/landwirtschaft/01-hero-16x9.jpg",
    accent: "#D9B878",
  },
  {
    id: "soziales",
    slug: "cham-soc-xa-hoi",
    code: "12",
    titleVi: "Chăm sóc xã hội",
    titleDe: "Betreuung & Soziales",
    icon: "HeartHandshake",
    envelope: null,
    cover: "/assets/jobs/soziales/01-hero-16x9.jpg",
    accent: "#2F8FE0",
  },
];

export function industryById(id: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
