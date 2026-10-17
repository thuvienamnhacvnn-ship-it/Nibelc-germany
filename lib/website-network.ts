export const CURRENT_SITE_ID = "nibelc-de";

export interface NetworkSite {
  id: string;
  name: string;
  url: string;
  host: string;
  logo: string;
  /** nền ô logo: logo màu tối cần nền sáng và ngược lại */
  plate: "light" | "dark";
}

export const WEBSITE_NETWORK: readonly NetworkSite[] = [
  { id: "nibelc-vn", name: "Nibelcgroup Vietnam", url: "https://nibelc.com.vn", host: "nibelc.com.vn", logo: "/network-logos/nibelc-vn.png", plate: "light" },
  { id: "vietduc", name: "Vietducgroup", url: "https://www.vietducgroup.com.vn", host: "www.vietducgroup.com.vn", logo: "/network-logos/vietduc.svg", plate: "dark" },
  { id: "nibelc-de", name: "NibelcGermany", url: "https://www.nibelcgermany.de", host: "www.nibelcgermany.de", logo: "/network-logos/nibelc-de.png", plate: "dark" },
  { id: "goldenvisa", name: "Goldenvisa", url: "https://golden-visa-europa.com", host: "golden-visa-europa.com", logo: "/network-logos/goldenvisa.svg", plate: "dark" },
];

export const WEBSITE_NETWORK_LABELS = {
  vi: { title: "Hệ thống website", current: "Bạn đang ở đây", newTab: "Mở trong tab mới" },
  de: { title: "Unsere Websites", current: "Sie sind hier", newTab: "Öffnet in neuem Tab" },
  en: { title: "Our websites", current: "You are here", newTab: "Opens in a new tab" },
} as const;

export function websiteNetworkLabels(lang: string) {
  return Object.hasOwn(WEBSITE_NETWORK_LABELS, lang)
    ? WEBSITE_NETWORK_LABELS[lang as keyof typeof WEBSITE_NETWORK_LABELS]
    : WEBSITE_NETWORK_LABELS.en;
}
