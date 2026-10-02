"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, Flame, Search } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { CAM_NANG, type Bai } from "@/data/articles";

/**
 * TRUNG TÂM CẨM NANG
 *
 * Bố cục tạp chí: điều hướng chuyên mục bên trái, thẻ bài ở giữa, cột "Được
 * đọc nhiều nhất" bên phải. Lọc và tìm chạy ngay trên dữ liệu có sẵn.
 */

/** Mười chuyên mục theo KIT, ánh xạ sang nhóm bài đang có */
const CHUYEN_MUC = [
  "Tất cả bài viết",
  "Visa & hồ sơ",
  "Học tiếng Đức",
  "Du học nghề",
  "Việc làm tại Đức",
  "Cuộc sống tại Đức",
  "Nhà ở",
  "Bảo hiểm",
  "Thuế & lương",
  "Văn hóa Đức",
  "Kinh nghiệm phỏng vấn",
];

/** Bài nào thuộc chuyên mục nào — suy từ nội dung, không gán tay từng bài */
function mucCuaBai(b: Bai): string[] {
  const t = `${b.tieuDe} ${b.tomTat}`.toLowerCase();
  const ra: string[] = [];
  if (/visa|hồ sơ|giấy tờ|lãnh sự/.test(t)) ra.push("Visa & hồ sơ");
  if (/tiếng đức|a1|b1|b2/.test(t)) ra.push("Học tiếng Đức");
  if (/học nghề|ausbildung/.test(t)) ra.push("Du học nghề");
  if (/việc làm|công việc|nghề/.test(t)) ra.push("Việc làm tại Đức");
  if (/cuộc sống|sinh hoạt|tháng đầu|hành lý/.test(t)) ra.push("Cuộc sống tại Đức");
  if (/nhà ở|thuê nhà|anmeldung/.test(t)) ra.push("Nhà ở");
  if (/bảo hiểm/.test(t)) ra.push("Bảo hiểm");
  if (/lương|thuế|tiền|thu nhập/.test(t)) ra.push("Thuế & lương");
  if (/văn hoá|văn hóa|đúng giờ/.test(t)) ra.push("Văn hóa Đức");
  if (/phỏng vấn/.test(t)) ra.push("Kinh nghiệm phỏng vấn");
  return ra.length ? ra : ["Cuộc sống tại Đức"];
}

/** Ảnh minh hoạ cho bài, xoay vòng trong kho ảnh nghề đã có */
const ANH = [
  "/assets/jobs/handel/01-hero-16x9.jpg",
  "/assets/jobs/gastronomie/04-detail-closeup.jpg",
  "/assets/jobs/it/01-hero-16x9.jpg",
  "/assets/jobs/logistik/01-hero-16x9.jpg",
  "/assets/jobs/elektro/04-detail-closeup.jpg",
  "/assets/jobs/soziales/01-hero-16x9.jpg",
  "/assets/jobs/mechanik/01-hero-16x9.jpg",
  "/assets/jobs/landwirtschaft/01-hero-16x9.jpg",
];

function bo(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

export function GuideHub() {
  const [muc, setMuc] = useState(CHUYEN_MUC[0]!);
  const [tu, setTu] = useState("");

  const ds = useMemo(() => {
    const q = bo(tu.trim());
    return CAM_NANG.filter((b) => {
      if (muc !== CHUYEN_MUC[0] && !mucCuaBai(b).includes(muc)) return false;
      if (q && !bo(`${b.tieuDe} ${b.tomTat}`).includes(q)) return false;
      return true;
    });
  }, [muc, tu]);

  const noiBat = ds[0];
  const conLai = ds.slice(1);
  const docNhieu = CAM_NANG.slice(0, 5);

  return (
    <div className="nb-wrap grid gap-7 py-10 sm:gap-8 sm:py-14 lg:grid-cols-[236px_minmax(0,1fr)_280px] lg:py-20">
      {/* ---------- CHUYÊN MỤC ---------- */}
      {/* min-w-0 là BẮT BUỘC: ô của lưới mặc định min-width:auto, nên bề rộng
          max-content của hàng chip kéo ngang (11 chip whitespace-nowrap, ~1500px)
          lọt ra ngoài và nới rộng cả trang. Thiếu dòng này, khung trang phình
          quá 1024px, `lg:` bật lên, hàng chip mất overflow-x và càng phình to. */}
      {/* Máy tính: cùng khung thẻ trắng với cột "Được đọc nhiều nhất" bên phải cho cân
          (viết bằng utility lg: thay vì .nb-panel để khổ điện thoại giữ nguyên). */}
      <aside className="h-fit min-w-0 lg:sticky lg:top-[calc(var(--nb-header)+20px)] lg:rounded-[16px] lg:border lg:border-[var(--nb-line-soft)] lg:bg-white lg:shadow-[0_1px_2px_rgba(7,21,37,.05),0_4px_12px_rgba(7,21,37,.04)] lg:p-5">
        <b className="block text-[15px] font-semibold text-white">Danh mục chủ đề</b>
        {/* Mười một chuyên mục xếp dọc ở khổ điện thoại chiếm gần 500px, đẩy bài
            viết xuống quá xa. Dưới lg thì cho chúng thành một hàng kéo ngang. */}
        <ul className="nb-no-scrollbar mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:max-w-none lg:space-y-1 lg:overflow-x-visible lg:pb-0">
          {CHUYEN_MUC.map((m) => {
            const so = m === CHUYEN_MUC[0] ? CAM_NANG.length : CAM_NANG.filter((b) => mucCuaBai(b).includes(m)).length;
            const on = muc === m;
            return (
              <li key={m} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setMuc(m)}
                  aria-pressed={on}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-left text-[13.5px] whitespace-nowrap transition lg:min-h-0 lg:rounded-lg lg:border-0 lg:px-3 lg:whitespace-normal ${
                    on
                      ? "border-[var(--nb-gold)] bg-[var(--nb-gold)]/12 text-[var(--nb-gold-soft)]"
                      : "border-[var(--nb-line-soft)] text-[var(--nb-text-dim)] hover:bg-white/5"
                  }`}
                >
                  <span className="min-w-0 lg:truncate">{m}</span>
                  <span className="text-[12px] text-[var(--nb-text-mute)] lg:text-[11.5px]">{so}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ---------- BÀI VIẾT ---------- */}
      <div className="min-w-0">
        <div className="flex items-center gap-3 rounded-full border border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]/70 px-5 py-2.5 focus-within:border-[var(--nb-gold)] lg:bg-white lg:shadow-[0_1px_2px_rgba(7,21,37,.05),0_4px_12px_rgba(7,21,37,.04)]">
          <Search size={17} className="shrink-0 text-[var(--nb-gold)]" />
          <input
            value={tu}
            onChange={(e) => setTu(e.target.value)}
            placeholder="Tìm kiếm trong cẩm nang..."
            aria-label="Tìm kiếm trong cẩm nang"
            className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-white outline-none placeholder:text-[var(--nb-text-mute)] lg:h-8"
          />
        </div>

        {ds.length === 0 ? (
          <p className="nb-panel mt-6 p-8 text-center text-[14.5px] text-[var(--nb-text-dim)] sm:p-12">
            Không có bài viết nào khớp. Thử từ khoá khác hoặc chọn “Tất cả bài viết”.
          </p>
        ) : (
          <>
            {noiBat && (
              <NavLink
                href={`/cam-nang/${noiBat.id}`}
                className="nb-card group mt-6 block overflow-hidden lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
              >
                {/* ẢNH SẠCH, CHỮ NẰM DƯỚI — không lớp phủ, không chữ đè lên ảnh
                    (luật Sếp). Điện thoại (phiên mobile): ảnh 16:9 trên, chữ dưới
                    như các thẻ bài còn lại. Máy tính: chữ nằm BÊN PHẢI ảnh. */}
                <span className="relative block aspect-[16/9] overflow-hidden lg:aspect-auto lg:h-auto lg:min-h-[300px]">
                  <Image
                    src={ANH[0]!}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 400px, 100vw"
                    className="object-cover transition-transform duration-[700ms] group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-col justify-center p-5 sm:p-7">
                    <span className="self-start rounded-full border border-[var(--nb-line)] bg-[var(--nb-navy-900)]/70 px-3 py-1 text-[12px] lg:bg-[#F6F1E7] font-semibold text-[var(--nb-gold-soft)] lg:text-[11.5px]">
                      {mucCuaBai(noiBat)[0]}
                    </span>
                    <b className="nb-display mt-3 block max-w-[34ch] text-[21px] leading-tight text-white sm:text-[26px] lg:text-[24px]">
                      {noiBat.tieuDe}
                    </b>
                    <span className="mt-2 block max-w-[62ch] text-[14px] text-[var(--nb-text-dim)] [display:-webkit-box] [overflow:hidden] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:[display:block]">
                      {noiBat.tomTat}
                    </span>
                    <span className="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--nb-text-mute)]">
                      <Clock size={12} />
                      {noiBat.phut} phút đọc
                    </span>
                </span>
              </NavLink>
            )}

            <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:gap-6">
              {conLai.map((b, i) => {
                // Số bài lẻ thì thẻ cuối trải hai cột (ảnh trái, chữ phải) để
                // hàng cuối không còn một thẻ lẻ bỏ trống nửa phải.
                const le = conLai.length % 2 === 1 && i === conLai.length - 1;
                return (
                <li key={b.id} className={le ? "lg:col-span-2" : undefined}>
                  <NavLink
                    href={`/cam-nang/${b.id}`}
                    className={`nb-card group flex h-full flex-col overflow-hidden ${le ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}
                  >
                    <span className={`relative block h-[150px] overflow-hidden ${le ? "lg:h-auto lg:min-h-[200px]" : ""}`}>
                      <Image
                        src={ANH[(i + 1) % ANH.length]!}
                        alt=""
                        fill
                        sizes="(min-width:768px) 360px, 100vw"
                        className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                      />
                    </span>
                    <span className="flex flex-1 flex-col p-5">
                      <span className="text-[12px] font-semibold tracking-wide text-[var(--nb-gold)] uppercase lg:text-[11.5px]">
                        {mucCuaBai(b)[0]}
                      </span>
                      <b className="mt-2 block text-[16.5px] leading-snug font-semibold text-white">{b.tieuDe}</b>
                      <span className="mt-2 block text-[13.5px] leading-[1.6] text-[var(--nb-text-dim)]">
                        {b.tomTat.slice(0, 110)}…
                      </span>
                      <span className="mt-auto flex items-center gap-2 pt-4 text-[12.5px] text-[var(--nb-text-mute)]">
                        <Clock size={12} />
                        {b.phut} phút đọc
                        <ArrowRight
                          size={13}
                          className="ml-auto text-[var(--nb-gold)] transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </span>
                  </NavLink>
                </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* ---------- ĐƯỢC ĐỌC NHIỀU NHẤT ---------- */}
      <aside className="nb-panel h-fit min-w-0 p-5 lg:sticky lg:top-[calc(var(--nb-header)+20px)]">
        <b className="flex items-center gap-2 text-[15px] font-semibold text-white">
          <Flame size={16} className="text-[var(--nb-gold)]" />
          Được đọc nhiều nhất
        </b>
        <ol className="mt-4 space-y-3">
          {docNhieu.map((b, i) => (
            <li key={b.id}>
              <NavLink href={`/cam-nang/${b.id}`} className="group flex min-h-[44px] gap-3 lg:min-h-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[12px] font-bold text-[var(--nb-gold)] lg:text-[11.5px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] leading-snug font-medium text-[var(--nb-text)] transition group-hover:text-[var(--nb-gold-soft)]">
                    {b.tieuDe}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-[var(--nb-text-mute)] lg:text-[11.5px]">{b.phut} phút đọc</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
