/**
 * CỤM TIÊU ĐỀ HERO — VẼ BẰNG VECTOR
 *
 * Trước đây cụm này là một tấm PNG nên không chuyển ngữ được. Nay là SVG với
 * <text> thật: đổi sang tiếng Đức hay tiếng Anh chỉ cần thay chuỗi trong
 * `chu`, không phải vẽ lại ảnh.
 *
 * Hiệu ứng vàng kim loại dựng bằng:
 *   - <linearGradient> dọc: sáng ở đỉnh, đậm ở giữa, sáng lại ở chân
 *   - stroke nâu sẫm + paint-order="stroke" → viền vẽ TRƯỚC rồi gradient tô
 *     đè lên, nên viền chỉ lộ ra ngoài nét chữ. SVG xử lý paint-order đúng
 *     chuẩn, không dính mấy lỗi của background-clip bên CSS
 *   - <feDropShadow> cho bóng khối
 *
 * Chữ nằm trong SVG nên máy tìm kiếm vẫn đọc được; trang vẫn giữ thêm một thẻ
 * h1 ẩn ở Hero cho chắc.
 */

export interface ChuTieuDe {
  dong1a: string;
  dong1b: string;
  dong2: string;
  dong3: string;
  dong4: string;
  dong5: string;
}

export const CHU_VI: ChuTieuDe = {
  dong1a: "Arbeiten in",
  dong1b: "Deutschland",
  dong2: "mit Nibelc Germany GmbH",
  dong3: "ĐỐI TÁC UY TÍN",
  dong4: "LỰA CHỌN TỐT NHẤT CỦA BẠN",
  dong5: "CHO VIỆC LÀM VÀ HỌC NGHỀ TẠI ĐỨC, CHÂU ÂU",
};

export function CumTieuDe({ chu = CHU_VI, className = "" }: { chu?: ChuTieuDe; className?: string }) {
  const F = "var(--font-hero), system-ui, sans-serif";

  return (
    <svg viewBox="0 0 1400 630" className={`nb-cum-tieu-de ${className}`} role="img" aria-label={`${chu.dong1a} ${chu.dong1b} — ${chu.dong3}`}>
      <defs>
        {/* vàng kim loại */}
        <linearGradient id="nb-vang" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="16%" stopColor="#ffeaa8" />
          <stop offset="40%" stopColor="#ffcc55" />
          <stop offset="58%" stopColor="#e0a32c" />
          <stop offset="70%" stopColor="#c98a1d" />
          <stop offset="86%" stopColor="#ffd977" />
          <stop offset="100%" stopColor="#fff6d8" />
        </linearGradient>
        {/* trắng hơi ngả bạc */}
        <linearGradient id="nb-trang" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="46%" stopColor="#eaf2fd" />
          <stop offset="100%" stopColor="#a9c4e6" />
        </linearGradient>
        <filter id="nb-bong" x="-12%" y="-12%" width="124%" height="124%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#04142c" floodOpacity="1" />
          <feDropShadow dx="0" dy="4" stdDeviation="9" floodColor="#04142c" floodOpacity="1" />
          <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#04142c" floodOpacity=".9" />
        </filter>
      </defs>

      {/* `textLength` + `lengthAdjust` ép mỗi dòng vừa đúng bề ngang đã định.
          Đây cũng là chỗ khiến bản vector hơn hẳn ảnh: chuyển sang tiếng Đức
          hay tiếng Anh, chữ dài ngắn khác nhau vẫn tự co về đúng khung, không
          tràn ra ngoài như vừa rồi. */}
      <g filter="url(#nb-bong)" fontFamily={F} fontWeight={900} textAnchor="middle" paintOrder="stroke">
        {/* ---- dòng 1: Arbeiten in Deutschland ---- */}
        <text x="700" y="150" fontSize="85" fontStyle="italic" fill="url(#nb-trang)" stroke="#0b1522" strokeWidth="3">
          {chu.dong1a}
          <tspan
            fill="url(#nb-vang)"
            stroke="#3a2402"
            strokeWidth="5"
            fontSize="100"
            dx="18"
          >
            {chu.dong1b}
          </tspan>
        </text>

        {/* vệt cờ Đức quét chéo sau dòng 1 */}
        <g transform="translate(1150 78) rotate(-13) scale(.78)" filter="none">
          <path d="M0 10 C 70 0, 170 -4, 258 -10 C 246 2, 150 12, 74 20 C 46 23, 18 20, 0 10 Z" fill="#141414" />
          <path d="M-2 40 C 72 29, 174 24, 262 18 C 250 31, 152 43, 76 50 C 46 53, 16 50, -2 40 Z" fill="#d81b1b" />
          <path d="M2 70 C 76 58, 178 52, 266 46 C 254 60, 156 72, 80 80 C 50 83, 20 80, 2 70 Z" fill="#f6c21c" />
        </g>

        {/* ---- dòng 2 ---- */}
        <text x="700" y="238" fontSize="69" fontStyle="italic" fill="url(#nb-trang)" stroke="#0b1522" strokeWidth="2.6">
          {chu.dong2}
        </text>

        {/* ---- dòng 3: khẩu hiệu ---- */}
        <text x="700" y="436" fontSize="158" fill="url(#nb-vang)" stroke="#3a2402" strokeWidth="6">
          {chu.dong3}
        </text>

        {/* ---- DECOR: hai nhánh champagne ôm hai bên khẩu hiệu ---- */}
        <g stroke="url(#nb-vang)" strokeLinecap="round" fill="none">
          <path d="M70 398 L150 398" strokeWidth="5" />
          <path d="M96 418 L150 418" strokeWidth="3" opacity=".7" />
          <path d="M1330 398 L1250 398" strokeWidth="5" />
          <path d="M1304 418 L1250 418" strokeWidth="3" opacity=".7" />
        </g>
        <g fill="url(#nb-vang)">
          <circle cx="58" cy="398" r="7" />
          <circle cx="1342" cy="398" r="7" />
        </g>

        {/* ---- dòng 4 ---- */}
        <text x="700" y="518" fontSize="58" fill="url(#nb-trang)" stroke="#0b1522" strokeWidth="2.4">
          {chu.dong4}
        </text>

        {/* ---- dòng 5 ---- */}
        <text x="700" y="588" fontSize="41" fill="url(#nb-vang)" stroke="#3a2402" strokeWidth="2.2">
          {chu.dong5}
        </text>

        {/* ---- DECOR: vạch champagne thon hai đầu, khép lại cả cụm ---- */}
        <path
          d="M430 618 L970 618"
          stroke="url(#nb-vang)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity=".85"
        />
        <g fill="url(#nb-vang)" opacity=".9">
          <circle cx="700" cy="618" r="5.5" />
          <circle cx="652" cy="618" r="3" />
          <circle cx="748" cy="618" r="3" />
        </g>
      </g>
    </svg>
  );
}
