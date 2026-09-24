/**
 * ASSET REGISTRY — nguồn ảnh duy nhất của website.
 *
 * Theo ASSET LOCK trong master prompt:
 *   - Giai đoạn này CHỈ dùng ảnh trong `assets/**` của KIT.
 *   - Mọi ngành phải khai `source: "kit"` và `approved: true`.
 *   - KHÔNG glob quét thư mục để quyết định ảnh hiển thị. UI chỉ đọc từ đây.
 *   - Ảnh trong `du-lieu-goc/`, thư mục Drive/raw/incoming/downloads, và ảnh
 *     tự tạo ngoài KIT đều bị cách ly, không được tham chiếu.
 *
 * Đường dẫn trỏ vào `public/branchen/<thư mục KIT>/…` — bản sao nguyên trạng
 * của `assets/**`, giữ đúng tên file để sau này thay ảnh không phải sửa layout.
 */

export type AssetSource = "kit" | "approved-drive";

export interface IndustryAssetSet {
  /** 16:9 — dùng cho hero trang ngành và ảnh thẻ ngành */
  hero: string;
  /** 3:4 — chân dung đang làm việc */
  portraitWork: string;
  /** 3:4 — chân dung làm việc cùng đồng nghiệp */
  portraitTeam: string;
  /** 4:3 — cận cảnh chi tiết nghề */
  detail: string;
  source: AssetSource;
  approved: boolean;
}

function kit(dir: string): IndustryAssetSet {
  return {
    hero: `/branchen/${dir}/01-hero-16x9.jpg`,
    portraitWork: `/branchen/${dir}/02-portrait-work-3x4.jpg`,
    portraitTeam: `/branchen/${dir}/03-portrait-team-3x4.jpg`,
    detail: `/branchen/${dir}/04-detail-closeup.jpg`,
    source: "kit",
    approved: true,
  };
}

/** Khoá là slug ngành; giá trị là bốn slot ảnh đã duyệt. */
export const INDUSTRY_ASSETS: Record<string, IndustryAssetSet> = {
  "gastronomie-koch": kit("01-gastronomie-koch"),
  "baeckerei-baecker": kit("02-baeckerei-baecker"),
  "fleischerei-fleischer": kit("03-fleischerei-fleischer"),
  "elektrotechnik-elektroniker": kit("04-elektrotechnik-elektroniker"),
  "logistik-fachkraft-lagerlogistik": kit("05-logistik-fachkraft-lagerlogistik"),
  "gartenbau-gaertner": kit("06-gartenbau-gaertner"),
  "akademische-fachkraefte": kit("07-akademische-fachkraefte-CAN-DIEN"),
  "produktion-maschinen-anlagen": kit("08-produktion-maschinenfuehrer"),
};

export function assetsFor(slug: string): IndustryAssetSet | undefined {
  return INDUSTRY_ASSETS[slug];
}

/** Ảnh dùng cho hero các trang không thuộc ngành nào, vẫn lấy từ KIT. */
export const PAGE_HERO = {
  // Ảnh KIT gần bố cục mẫu 01 nhất: phòng họp sáng, cửa kính, skyline.
  home: INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero,
  fuerUnternehmen: INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam,
  fuerBewerber: INDUSTRY_ASSETS["elektrotechnik-elektroniker"]!.portraitTeam,
  branchen: INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.portraitTeam,
  // Mẫu 06 là ba người cúi xem tài liệu trên bàn — gần nhất là phòng họp sáng.
  prozess: INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero,
} as const;

/**
 * Ấn phẩm chính thức của công ty (Drive → `kit/nguon-cong-ty/`).
 * Đây là ảnh có chữ, dùng đúng vai trò tài liệu: trang Über uns trích dẫn
 * chúng làm nguồn cho dữ liệu pháp nhân. KHÔNG dùng làm ảnh nền.
 *
 * Ba tin tuyển dụng là ấn phẩm tiếng Việt của từng đợt, có ghi mức lương của
 * đợt đó → chỉ hiện ở bản tiếng Việt, kèm chú thích, không phải bảng lương
 * chung (CẦN ĐIỀN 03).
 */
export const COMPANY_PUBLICATIONS = [
  {
    src: "/unternehmen/01-poster-arbeiten-in-deutschland.jpg",
    w: 1585,
    h: 992,
    kind: "poster" as const,
  },
  { src: "/unternehmen/02-stellenanzeige-gewaechshaus.jpg", w: 708, h: 1138, kind: "anzeige" as const },
  { src: "/unternehmen/03-stellenanzeige-gewaechshaus-leitung.jpg", w: 708, h: 1138, kind: "anzeige" as const },
  { src: "/unternehmen/04-stellenanzeige-instandhaltung.jpg", w: 708, h: 1138, kind: "anzeige" as const },
] as const;

export const COMPANY_PUBLICATIONS_SOURCE: AssetSource = "kit";

/**
 * Banner trang chủ — hai lớp do Sếp đặt trong KIT (screens/B1.png, B2.png).
 * B2 là nền (skyline qua cửa kính), B1 là PNG người + bàn đã tách nền.
 * Rê chuột thì nền chạy ngược hướng chuột để tạo chiều sâu.
 */
export const HOME_BANNER = {
  background: "/kit/banner/b2.jpg",
  foreground: "/kit/banner/b1.png",
  source: "kit" as AssetSource,
  approved: true,
} as const;
