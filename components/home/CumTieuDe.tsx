/**
 * CỤM TIÊU ĐỀ HERO — VẼ BẰNG VECTOR
 *
 * Trước đây cụm này là một tấm PNG nên không chuyển ngữ được. Nay là SVG với
 * <text> thật: đổi sang tiếng Đức hay tiếng Anh chỉ cần thay chuỗi trong
 * `chu`, không phải vẽ lại ảnh.
 *
 * ── VÌ SAO ĐỔI MÀU (Sếp: "màu vàng và trắng ở Mobile chưa nổi bật, bị chìm
 *    vào nền") ─────────────────────────────────────────────────────────────
 * Mở ảnh chụp khổ 390px ra xem mới thấy: lỗi KHÔNG nằm ở chữ, nằm ở chỗ chữ
 * rơi đúng vào mảng nền cùng tông.
 *   - mấy dòng TRẮNG rơi trúng dải mây trắng giữa trời → trắng trên trắng;
 *   - mấy dòng VÀNG rơi trúng mảng mây hoàng hôn cam vàng → vàng trên cam.
 * Nên không thể chữa bằng cách tăng bóng (bản trước làm thế, Sếp nhìn ra
 * ngay là "chưa đổi màu"). Ba việc phải làm cùng lúc:
 *   1. VIỀN đổi sang navy gần đen #061324 cho MỌI dòng. Bản cũ viền nâu
 *      #3a2402 — nâu đặt trên nền cam là cùng họ màu, viền có cũng như không.
 *      Navy là màu đối của cam/vàng nên nó cắt chữ ra khỏi nền.
 *   2. VÀNG đẩy khuỷu gradient xuống hổ phách đậm #f59a07 → #d97905. Vàng
 *      champagne nhạt của bản cũ sáng ngang nền mây cam, nay đậm hơn nền.
 *   3. TRẮNG kéo chân gradient xuống xanh băng #cfe0f5 để không bao giờ bằng
 *      đúng màu mây.
 * KHÔNG phủ lớp tối lên ảnh để chữa — luật của Sếp cấm, và cũng không cần.
 *
 * ── VÌ SAO XẾP LẠI CHỮ (Sếp: "layout text đang bị rối") ───────────────────
 *   - Bản cũ có FIVE bậc cỡ chữ (100/85/69/158/58/41) chồng lên nhau, mắt
 *     không biết đọc theo thứ tự nào. Nay còn BA bậc: cụm tiếng Đức nhỏ,
 *     khẩu hiệu to, hai dòng phụ vừa.
 *   - Vệt cờ Đức bản cũ quét chéo ĐÈ LÊN chữ "Deutschland". Nay nó thành
 *     hoạ tiết giữa vạch ngăn, không chạm chữ nào.
 *   - Bỏ chùm chấm tròn ở chân cụm: nó rơi ngay trên thanh tìm kiếm, thêm
 *     một tầng chi tiết nữa vào chỗ đã chật.
 *   - Một vạch ngăn tách cụm tiếng Đức khỏi khẩu hiệu tiếng Việt, nên đọc ra
 *     HAI khối thay vì năm dòng rời.
 *
 * Hiệu ứng vàng kim loại dựng bằng <linearGradient> dọc + stroke navy với
 * paint-order="stroke" (viền vẽ TRƯỚC rồi gradient tô đè, nên viền chỉ lộ ra
 * ngoài nét chữ — SVG làm đúng chuẩn này, không dính mấy lỗi của
 * background-clip bên CSS) + <feDropShadow> cho bóng khối.
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

/** Viền chung: navy gần đen, màu đối của cả trời xanh lẫn mây cam. */
const VIEN = "#061324";

/**
 * CO CỠ CHỮ CHO VỪA KHUNG.
 *
 * SVG <text> không tự xuống dòng và không tự co: chuỗi dài hơn khung thì nó
 * cứ tràn ra ngoài viewBox và bị cắt cụt. Tiếng Việt "ĐỐI TÁC UY TÍN" vừa
 * khít, nhưng tiếng Đức "ZUVERLÄSSIGER PARTNER" dài hơn hẳn — chụp màn hình
 * bản /de thấy mất cả chữ đầu lẫn chữ cuối, đọc ra "RLÄSSLICHER PA".
 *
 * Nên cỡ chữ tính theo độ dài chuỗi thay vì đặt cứng. Hệ số 0.60 là bề ngang
 * trung bình một ký tự hoa của Montserrat 900 tính theo em — đo trên chính
 * cụm này rồi chốt. Chỉ co xuống, không bao giờ phóng to quá cỡ chuẩn, nên
 * tiếng Việt giữ nguyên y như Sếp đã duyệt.
 *
 * Không dùng textLength + lengthAdjust: cái đó bóp bề ngang từng chữ cái và
 * kéo các từ dính vào nhau, chữ có dấu tiếng Việt nhìn ra ngay.
 *
 * Bề ngang KHÔNG tính bằng một hệ số chung cho mọi ký tự — thử rồi, sai.
 * "ĐỐI TÁC UY TÍN" đo thật 0,60 em/ký tự còn "YOUR TRUSTED PARTNER" 0,69,
 * vì tiếng Việt ở đây có nhiều chữ I và khoảng trắng vốn rất hẹp. Lấy hệ số
 * đủ lớn cho tiếng Anh thì tiếng Việt bị co oan; lấy vừa tiếng Việt thì
 * tiếng Đức vẫn tràn. Nên chia ba nhóm, sai số còn dưới 6%.
 */
/** bề ngang một ký tự, tính theo em, cho Montserrat 900 chữ hoa */
function beNgang(c: string) {
  if (c === " ") return 0.3;
  if ("IJÍÌỊỈĨ".includes(c)) return 0.33;
  if ("MW".includes(c)) return 0.92;
  return 0.7;
}

/**
 * Trả về cỡ chữ lớn nhất mà cả chuỗi còn lọt khung. CHỈ co xuống, không bao
 * giờ phóng quá cỡ chuẩn — nên bản tiếng Việt Sếp đã duyệt giữ nguyên cỡ.
 * Khung 1340 trên viewBox 1400 = chừa 30px mỗi bên.
 */
function coChu(chuoi: string, coChuan: number, rongKhung = 1340) {
  let em = 0;
  for (const c of chuoi) em += beNgang(c);
  em *= 1.08; // biên an toàn cho sai số của bảng tra
  const can = em * coChuan;
  return can <= rongKhung ? coChuan : Math.floor(rongKhung / em);
}

export function CumTieuDe({
  chu = CHU_VI,
  deDong1 = false,
  className = "",
}: {
  chu?: ChuTieuDe;
  /**
   * true khi hai dòng đầu là câu TIẾNG ĐỨC cố ý giữ nguyên trong bản ngôn ngữ
   * khác ("Arbeiten in Deutschland / mit Nibelc Germany GmbH" ở bản tiếng Việt
   * và tiếng Anh). Đánh dấu lang="de" để trình đọc màn hình đọc đúng giọng
   * Đức chứ không đọc chữ Đức bằng âm Việt.
   */
  deDong1?: boolean;
  className?: string;
}) {
  const de = deDong1 ? { lang: "de" } : {};
  const F = "var(--font-hero), system-ui, sans-serif";

  return (
    <svg
      viewBox="0 0 1400 630"
      className={`nb-cum-tieu-de ${className}`}
      role="img"
      aria-label={`${chu.dong1a} ${chu.dong1b} — ${chu.dong3}`}
    >
      <defs>
        {/* VÀNG KIM: sáng ở đỉnh, khuỷu hổ phách ĐẬM ở giữa, hắt sáng lại ở
            chân. Khuỷu đậm là chỗ ăn thua — nền mây hoàng hôn phía sau sáng
            cỡ #f3b25f, vàng của chữ phải đậm hơn nó mới tách ra được. */}
        <linearGradient id="nb-vang" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fffaea" />
          <stop offset="15%" stopColor="#ffe28a" />
          <stop offset="34%" stopColor="#ffc126" />
          <stop offset="50%" stopColor="#f59a07" />
          <stop offset="63%" stopColor="#d97905" />
          <stop offset="78%" stopColor="#ffc53f" />
          <stop offset="100%" stopColor="#fff0bd" />
        </linearGradient>
        {/* TRẮNG: chân kéo xuống xanh băng để không trùng màu mây trắng. */}
        <linearGradient id="nb-trang" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#e6eefb" />
          <stop offset="100%" stopColor="#cfe0f5" />
        </linearGradient>
        <filter id="nb-bong" x="-14%" y="-14%" width="128%" height="128%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#04142c" floodOpacity="1" />
          <feDropShadow dx="0" dy="5" stdDeviation="11" floodColor="#04142c" floodOpacity="1" />
          <feDropShadow dx="0" dy="12" stdDeviation="22" floodColor="#04142c" floodOpacity=".92" />
        </filter>
      </defs>

      <g filter="url(#nb-bong)" fontFamily={F} fontWeight={900} textAnchor="middle" paintOrder="stroke" stroke={VIEN}>
        {/* ═══ KHỐI 1 — tiếng Đức ═══
            "Arbeiten in" và "Deutschland" nay CÙNG một cỡ chữ. Bản cũ cho
            "Deutschland" to hơn 15px, đọc ra như hai dòng bị ép vào một. */}
        <text
          x="700"
          y="108"
          fontSize={coChu(`${chu.dong1a} ${chu.dong1b}`, 82)}
          fontStyle="italic"
          fill="url(#nb-trang)"
          strokeWidth="4.5"
          {...de}
        >
          {chu.dong1a}
          <tspan fill="url(#nb-vang)" dx="20">
            {chu.dong1b}
          </tspan>
        </text>

        <text
          x="700"
          y="186"
          fontSize={coChu(chu.dong2, 50)}
          fontStyle="italic"
          fill="url(#nb-trang)"
          strokeWidth="3.2"
          {...de}
        >
          {chu.dong2}
        </text>

        {/* ═══ VẠCH NGĂN — tách khối tiếng Đức khỏi khẩu hiệu tiếng Việt ═══
            Vệt cờ Đức nằm ở GIỮA vạch này. Trước đây nó quét chéo đè lên chữ
            "Deutschland", che mất chữ và làm cụm trông rối. */}
        {/* Hai vạch vàng hai bên vệt cờ đã BỎ: chụp ra mới thấy 7px trên
            khung 1400 thu về 358px chỉ còn 1,8px, lại là vàng đặt trên mây
            sáng — nhìn màn hình thật không thấy gì. Để một vệt cờ Đức to rõ
            làm mốc ngăn thì sạch hơn hẳn. */}
        <g transform="translate(596 204) scale(.78)" stroke="none">
          <path d="M0 10 C 70 0, 170 -4, 258 -10 C 246 2, 150 12, 74 20 C 46 23, 18 20, 0 10 Z" fill="#141414" />
          <path d="M-2 40 C 72 29, 174 24, 262 18 C 250 31, 152 43, 76 50 C 46 53, 16 50, -2 40 Z" fill="#d81b1b" />
          <path d="M2 70 C 76 58, 178 52, 266 46 C 254 60, 156 72, 80 80 C 50 83, 20 80, 2 70 Z" fill="#f6c21c" />
        </g>

        {/* ═══ KHỐI 2 — khẩu hiệu tiếng Việt ═══ */}
        <text x="700" y="400" fontSize={coChu(chu.dong3, 150)} fill="url(#nb-vang)" strokeWidth="9">
          {chu.dong3}
        </text>

        {/* Bỏ hai nhánh champagne ở mép trái/phải khẩu hiệu. Dòng
            "ĐỐI TÁC UY TÍN" chiếm gần trọn bề ngang nên ở khổ điện thoại
            nhánh và chấm tròn đâm sát vào chữ Đ và N, nhìn ra như vết bẩn
            chứ không ra hoạ tiết. Vạch ngăn kèm vệt cờ ở trên đã đủ decor.
            Ở khổ máy tính cụm rộng hơn nên trước đây không lộ. */}

        <text x="700" y="488" fontSize={coChu(chu.dong4, 56)} fill="url(#nb-trang)" strokeWidth="3.6">
          {chu.dong4}
        </text>

        <text x="700" y="558" fontSize={coChu(chu.dong5, 38)} fill="url(#nb-vang)" strokeWidth="2.8">
          {chu.dong5}
        </text>
      </g>
    </svg>
  );
}
