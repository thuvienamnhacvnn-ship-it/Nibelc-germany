import type { CSSProperties } from "react";

/**
 * CỤM TIÊU ĐỀ HERO — CHỮ HTML THẬT, 3 TẦNG
 *
 * Bản trước là SVG chữ vàng kim loại 7 chặng + viền nâu + 3 lớp bóng, 5 dòng
 * 6 cỡ chữ trộn nghiêng/đứng, thêm vệt cờ và chấm vạch trang trí → Sếp chê
 * xấu (01/10/2026). Nay gom lại 3 tầng, mỗi chữ MỘT màu đặc, không viền,
 * không gradient, không glow; chỉ một bóng mềm để tách chữ khỏi nền trời.
 *
 *   Tầng 1 (nhỏ):    Arbeiten in Deutschland / mit Nibelc Germany GmbH
 *   Tầng 2 (lớn):    ĐỐI TÁC UY TÍN
 *   Tầng 3 (chữ hoa giãn): hai dòng khẩu hiệu, ngăn với tầng 2 bằng vạch vàng 1px
 *
 * Mọi cỡ chữ co theo vw (clamp) để ở 1280px cụm chữ không đè đầu hai nhóm
 * nhân vật, và trên 390px vẫn gọn trong khung.
 *
 * Chuyển ngữ: bản en/de nằm ở lib/i18n/dict/home.ts (khoá `hero`); chỉ thay chuỗi trong `chu`, chữ dài ngắn khác nhau tự xuống dòng
 * cân đối nhờ text-balance.
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

/* Token riêng của cụm tiêu đề (không rải mã màu lẻ trong JSX) */
const TOKEN = {
  "--td-vang": "#E8C987",
  "--td-trang": "#FFFFFF",
  "--td-trang-phu": "rgba(255,255,255,.88)",
  /* tấm nền RIÊNG của cụm chữ (không phủ cả ảnh) — nền trời/núi tuyết quá
     sáng, chỉ bóng chữ thì "ĐỐI TÁC UY TÍN" vàng chìm vào mây */
  "--td-nen": "rgba(6,17,34,.56)",
  "--td-vien": "rgba(232,201,135,.22)",
  "--td-bong": "none", // Sếp cấm glow/bóng chữ
} as CSSProperties;

/** Cỡ chữ tầng 2: giữ nguyên cỡ gốc tới 15 ký tự, dài hơn thì co tỉ lệ nghịch */
function coDong3(s: string): string {
  const k = Math.min(1, 15 / Math.max(1, s.length));
  const r = (n: number) => Math.round(n * k * 100) / 100;
  return `clamp(${r(34)}px, ${r(4.85)}vw, ${r(70)}px)`;
}

export function CumTieuDe({
  chu = CHU_VI,
  className = "",
  langDong1,
}: {
  chu?: ChuTieuDe;
  className?: string;
  /** dòng 1–2 là câu ngoại ngữ cố ý giữ (bản vi giữ câu tiếng Đức) → "de" */
  langDong1?: string;
}) {
  return (
    <div
      className={`flex w-fit max-w-full shrink-0 flex-col items-center rounded-[20px] border border-[color:var(--td-vien)] bg-[color:var(--td-nen)] px-5 py-6 text-center [text-shadow:var(--td-bong)] sm:px-10 lg:rounded-[24px] lg:px-12 lg:py-7 ${className}`}
      style={TOKEN}
    >
      <h1 className="flex flex-col items-center">
        {/* Tầng 1 */}
        <span
          className="block font-semibold leading-[1.15] text-[color:var(--td-trang)] text-[clamp(21px,2.3vw,34px)]"
          style={{ fontFamily: "var(--font-display)" }}
          lang={langDong1}
        >
          {chu.dong1a} <span className="text-[color:var(--td-vang)]">{chu.dong1b}</span>
        </span>
        <span
          className="mt-1.5 block font-medium leading-[1.3] text-[color:var(--td-trang-phu)] text-[clamp(13.5px,1.25vw,18px)] lg:mt-2"
          style={{ fontFamily: "var(--font-inter)" }}
          lang={langDong1}
        >
          {chu.dong2}
        </span>

        {/* Tầng 2 — lớn nhất. Cỡ gốc clamp(34px,4.85vw,70px) cho câu ~15 ký tự
            ("ĐỐI TÁC UY TÍN"); câu dài hơn (en/de) co theo tỉ lệ để vẫn MỘT
            dòng — xuống hai dòng thì khung chữ cao thêm và đè lên mặt nhân vật. */}
        <span
          className="mt-3 block font-bold leading-[1.08] tracking-[0.02em] text-balance text-[color:var(--td-vang)] lg:mt-3"
          style={{ fontFamily: "var(--font-display)", fontSize: coDong3(chu.dong3) }}
        >
          {chu.dong3}
        </span>
      </h1>

      {/* Vạch vàng mảnh ngăn tầng 2 với tầng 3 */}
      <span
        aria-hidden="true"
        className="mt-3.5 block h-px w-[clamp(56px,6vw,88px)] bg-[color:var(--td-vang)] lg:mt-4"
      />

      {/* Tầng 3 */}
      <p
        className="mt-3.5 font-semibold uppercase leading-[1.65] tracking-[0.1em] text-balance text-[color:var(--td-trang)] text-[clamp(11px,1.12vw,16px)] lg:mt-4 lg:tracking-[0.14em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <span className="block">{chu.dong4}</span>
        <span className="block">{chu.dong5}</span>
      </p>
    </div>
  );
}
