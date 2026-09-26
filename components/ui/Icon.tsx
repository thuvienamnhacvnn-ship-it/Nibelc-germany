/**
 * Bộ icon nét dùng chung cho sáu trang. Vẽ bằng SVG, không kéo thư viện ngoài.
 * Nét 1,7 như icon trong ảnh mẫu.
 */

const G: Record<string, React.ReactNode> = {
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5" /></>,
  helmet: <><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2.5 16h19v2.5h-19zM10 8.5V6h4v2.5" /></>,
  heart: <><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z" /><path d="M6 12h3l1.5-2.5L13 15l1.5-3H18" /></>,
  bolt: <path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9Z" />,
  factory: <><path d="M3 20V10l5 3V10l5 3V10l5 3V5h3v15Z" /><path d="M7 16h2M12 16h2M17 16h2" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3" /></>,
  laptop: <><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 18.5h19" /></>,
  utensils: <><path d="M7 3v8a2 2 0 0 0 2 2V3M9.5 3v6M17 3c-1.5 1.5-2 3.5-2 5.5V13h2V3Z" /><path d="M9 13v8M16 13v8" /></>,
  bread: <><path d="M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 0 8H8a4 4 0 0 1-4-4Z" /><path d="M9 11v4M13 11v4" /></>,
  meat: <><circle cx="12" cy="12" r="7" /><path d="M9.5 10.5h.01M14 10h.01M11.5 14h.01" /></>,
  box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M4 7.5 12 12l8-4.5M12 12v9" /></>,
  leaf: <><path d="M20 4c0 8-5 13-13 13H4c0-8 5-13 13-13h3Z" /><path d="M4 20c3-5 7-8 11-9" /></>,
  cap: <><path d="m12 4 10 5-10 5L2 9l10-5Z" /><path d="M6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 11.5a3 3 0 1 0-1.8-5.4M18.5 20a5.5 5.5 0 0 0-3-4.9" /></>,
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h4" /></>,
  home: <><path d="m3.5 11 8.5-7 8.5 7" /><path d="M6 9.5V20h12V9.5M10 20v-5h4v5" /></>,
  handshake: <path d="m2 11 4-4 4 3 3-2 3 1 6 5-4 4-3-2-3 3-3-3-3 1-2-3Zm8 3 3 3M13 12l3 3" />,
  plane: <path d="M10.5 3.5a1.5 1.5 0 0 1 3 0v6l7.5 4.2v2.3l-7.5-2.2v4.4l2.5 1.8v1.7L12 20.6l-4 1.1v-1.7l2.5-1.8v-4.4L3 16v-2.3l7.5-4.2Z" />,
  chat: <><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8l-5 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5Z" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  chart: <path d="M4 20V11M10 20V5M16 20v-7M21 20H3" />,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.5 7.5 9.5 4.4-1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12.2 2.3 2.3 4.3-4.6" /></>,
  check: <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  pin: <><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  badge: <><circle cx="12" cy="9.5" r="5.5" /><path d="m8.5 14.5-1 7 4.5-2.5 4.5 2.5-1-7" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  quote: <path d="M5 11h4v7H3v-5a6 6 0 0 1 4-5.7M15 11h4v7h-6v-5a6 6 0 0 1 4-5.7" />,
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="M8 5.5v13l11-6.5Z" fill="currentColor" stroke="none" />,
  briefcase: <><rect x="3" y="7.5" width="18" height="12" rx="2.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" /></>,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
  book: <><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z" /><path d="M12 6.5v13" /></>,
  wrench: <path d="M14.5 6.5a4 4 0 0 1 5.3-3.8l-2.6 2.6.5 2.3 2.3.5 2.6-2.6a4 4 0 0 1-5.3 5.3L9 19a2.1 2.1 0 0 1-3-3l8.3-8.3a4 4 0 0 1 .2-1.2Z" />,
  checkCircle: <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="m7.5 12.3 3 3 6-6.3" stroke="#fff" strokeWidth="2.4" /></>,
  checkSquare: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8 12 3 3 5-6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  burger: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  phone: <path d="M7 3.5 9.5 8l-2 2a12 12 0 0 0 6.5 6.5l2-2 4.5 2.5-1 3a2 2 0 0 1-2.2 1.2C10.8 20.2 3.8 13.2 2.8 6.7A2 2 0 0 1 4 4.5l3-1Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.5l3.5 2" /></>,
  send: <path d="M21 3 3 10.5l7 3 3 7L21 3Z" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
  sprout: <><path d="M12 21v-9" /><path d="M12 12c0-4-3-7-8-7 0 4 3 7 8 7ZM12 10c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6Z" /></>,
  circleOpen: <><circle cx="12" cy="12" r="9" /><path d="m8 12.3 2.8 2.8L16 9.6" /></>,
  // Bóng nước Đức giản lược, tự vẽ tay
  germany: <path d="M10 2.5 12.5 2l1 1.8 2.3.2.4 2.4 2.1 1.4-.8 2.2 1.6 2-1.1 2.4.9 2.8-2.2 1.3.3 2.4-2.9.6-1.7 1.5-2.4-.9-2.1.6-.8-2.3-2.2-1.1.9-2.5-1.6-2 1.3-2.2-.6-2.6 2.2-1.1.2-2.3Z" fill="currentColor" stroke="none" />,
};

export type IconName = keyof typeof G | string;

export function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 1.7,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {G[name] ?? G.grid}
    </svg>
  );
}
