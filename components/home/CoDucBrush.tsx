/**
 * CỜ ĐỨC DẠNG NÉT CỌ
 *
 * Một vệt quét chéo từ trái sang phải, ba dải đen – đỏ – vàng, mép không đều
 * và đuôi tua ra như lông cọ kéo hết mực. Đặt dưới cụm tiêu đề hero.
 *
 * Vẽ bằng SVG chứ không dùng ảnh: nét cọ co giãn theo bề ngang màn hình mà
 * không vỡ, và đổi màu hay độ nghiêng chỉ sửa một chỗ.
 */
export function CoDucBrush({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 86"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* mép cọ mòn dần: đậm ở thân, tan ở hai đầu */}
        <linearGradient id="nb-brush-mon" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="9%" stopColor="#fff" stopOpacity=".72" />
          <stop offset="26%" stopColor="#fff" stopOpacity="1" />
          <stop offset="82%" stopColor="#fff" stopOpacity="1" />
          <stop offset="94%" stopColor="#fff" stopOpacity=".5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="nb-brush-mask">
          <rect x="0" y="0" width="420" height="86" fill="url(#nb-brush-mon)" />
        </mask>
      </defs>

      {/* Ba dải màu, mỗi dải là một nét cọ riêng: bụng hơi phình, hai đầu
          vuốt nhọn, mép trên dưới lượn nhẹ cho ra chất lông cọ. */}
      <g mask="url(#nb-brush-mask)">
        <path
          d="M6 30 C 90 14, 230 10, 414 4 C 400 14, 250 24, 150 32 C 100 36, 42 38, 6 30 Z"
          fill="#141414"
        />
        <path
          d="M4 50 C 96 34, 236 28, 416 22 C 402 33, 252 44, 152 52 C 100 56, 40 58, 4 50 Z"
          fill="#d81b1b"
        />
        <path
          d="M8 72 C 100 56, 240 48, 418 42 C 404 54, 254 66, 154 74 C 102 78, 44 80, 8 72 Z"
          fill="#f6c21c"
        />

        {/* vài sợi lông tách ra ở đuôi, cho nét cọ đỡ phẳng */}
        <path d="M392 6 C 404 5, 412 4, 419 3" stroke="#141414" strokeWidth="1.6" fill="none" opacity=".75" />
        <path d="M396 25 C 406 23, 413 22, 419 21" stroke="#d81b1b" strokeWidth="1.5" fill="none" opacity=".7" />
        <path d="M398 45 C 408 43, 414 42, 419 41" stroke="#f6c21c" strokeWidth="1.4" fill="none" opacity=".7" />
      </g>
    </svg>
  );
}
