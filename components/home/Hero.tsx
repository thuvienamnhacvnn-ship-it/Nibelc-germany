"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useHeroJobRotation } from "@/hooks/useHeroJobRotation";
import { IndustryRail } from "@/components/home/IndustryRail";
import { FeaturedJob } from "@/components/home/FeaturedJob";
import { SearchBar } from "@/components/home/SearchBar";
import { HeroVideo } from "@/components/home/HeroVideo";
import { NhomNhanVat } from "@/components/home/NhomNhanVat";

/**
 * HERO TRANG CHỦ
 *
 * Bố cục khoá theo mẫu Sếp duyệt:
 *   - nền là VIDEO (bản ngang cho desktop, bản dọc cho điện thoại), KHÔNG
 *     phủ lớp màu nào lên trên; chữ đọc được nhờ bóng chữ riêng
 *   - hai nhóm nhân vật đứng trên bệ nổi, ép sát hai mép, khoảng giữa để
 *     trống cho tiêu đề
 *   - KHÔNG có job card bay lơ lửng khi chưa chọn ngành
 *   - bấm một tệp ngành: video và hai nhân vật nhường chỗ cho BANNER ĐƠN HÀNG
 *     phủ kín hero, còn dải tệp vẫn nằm nguyên dưới chân
 */
export function Hero() {
  const hero = useHeroJobRotation();

  // Bấm 'Trang chủ' trong khi banner đơn hàng đang mở thì đóng banner lại,
  // vì điều hướng tới chính trang đang xem sẽ không làm gì cả.
  useEffect(() => {
    const f = () => hero.boChon();
    window.addEventListener('nibelc:ve-trang-hien-tai', f);
    return () => window.removeEventListener('nibelc:ve-trang-hien-tai', f);
  }, [hero]);

  return (
    <section className="relative isolate min-h-[calc(100svh-var(--nb-header))] overflow-hidden lg:min-h-[calc(100vh-40px)]">
      {/* ---------- NỀN: video, bản ngang cho desktop và bản dọc cho điện thoại ---------- */}
      <HeroVideo />

      {/* KHÔNG phủ lớp màu nào lên video. Chữ hero đọc được nhờ bóng chữ
          riêng (.nb-bong-chu), không nhờ làm tối cả khung hình. */}

      {/* Dải chuyển tiếp rất mỏng ở sát đáy, chỉ để video nối liền vào nền
          navy của phần dưới — không phải lớp phủ lên khung hình. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[14%]"
        style={{ background: "linear-gradient(180deg, rgba(5,11,22,0) 0%, var(--nb-navy-900) 92%)" }}
        aria-hidden="true"
      />

      {/* ---------- HAI NHÓM NHÂN VẬT ---------- */}
      {/* Ép sát hai mép, chừa hẳn khoảng giữa cho tiêu đề. Mỗi nhóm đứng trên
          một bệ nổi để chỗ ảnh PNG bị cắt ngang không lộ ra. */}
      <NhomNhanVat
        src="/assets/home/people/group-left.png"
        ben="trai"
        rong="w-[clamp(360px,34vw,610px)]"
        mo={1}
        dich={0}
        w={1005}
        h={822}
      />

      <NhomNhanVat
        src="/assets/home/people/group-right.png"
        ben="phai"
        rong="w-[clamp(340px,32vw,565px)]"
        mo={1}
        dich={0}
        w={909}
        h={822}
      />

      {/* ---------- KHỐI GIỮA ---------- */}
      <div
        className="relative z-20 flex min-h-[calc(100svh-var(--nb-header))] flex-col items-center lg:min-h-[calc(100vh-40px)]"
        style={{ paddingTop: "calc(var(--nb-header) + 4vh)" }}
      >
        <div className="flex flex-1 flex-col items-center justify-start px-6 pt-[2vh] text-center lg:pt-[4vh]">
          <AnimatePresence mode="wait" custom={{ doiTiep: hero.doiTiep, huong: hero.huong }}>
            {hero.dangHienJob && hero.job ? (
              <motion.div
                key={`job-${hero.job.id}`}
                className="flex flex-col items-center"
                style={{ perspective: 1200 }}
              >
                <FeaturedJob job={hero.job} oTep={hero.oTep} doiTiep={hero.doiTiep} huong={hero.huong} />
                <button
                  type="button"
                  onClick={hero.boChon}
                  className="nb-btn-ghost mt-4 h-10 px-5 text-[13.5px]"
                >
                  <X size={15} />
                  Quay lại trang chủ
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                className="nb-bong-chu relative max-w-[min(760px,82vw)] lg:max-w-[min(820px,74vw)]"
              >

                {/* CỤM TIÊU ĐỀ là một tấm PNG nền trong suốt Sếp gửi, không
                    dựng lại bằng chữ nữa. Vẫn giữ một thẻ h1 cho máy tìm kiếm
                    và trình đọc màn hình, chỉ ẩn khỏi mắt thường. */}
                <h1 className="sr-only">
                  Arbeiten in Deutschland mit Nibelc Germany GmbH — ĐỐI TÁC UY TÍN, lựa chọn tốt nhất của bạn cho
                  việc làm và học nghề tại Đức, châu Âu
                </h1>
                <span className="relative mx-auto block w-[min(860px,92vw)]">
                  <Image
                    src="/assets/home/title-cum.png"
                    alt=""
                    width={1400}
                    height={596}
                    priority
                    quality={95}
                    sizes="(min-width:1024px) 860px, 92vw"
                    className="h-auto w-full"
                    style={{
                      // Bóng ôm sát nét chữ. Đây là ảnh thường nên drop-shadow
                      // chạy đúng, khác hẳn chữ dùng background-clip trước đây.
                      // Bóng ÔM SÁT nét chữ. Bán kính lớn làm bóng loang ra
                      // cả vùng trống quanh cụm, nhìn như một mảng mờ bẩn.
                      filter:
                        "drop-shadow(0 0 1px rgba(4,10,20,.95)) drop-shadow(0 1px 2px rgba(4,10,20,.9)) drop-shadow(0 2px 4px rgba(4,10,20,.7))",
                    }}
                  />
                </span>


                <div className="mx-auto mt-4 w-[min(500px,84vw)]">
                  <SearchBar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- DẢI PHONG BÌ ---------- */}
        {/* Chỉ có trên màn rộng. Trên điện thoại Sếp bỏ hẳn: màn hẹp thì dải
            tệp che mất nhân vật và phải cuộn ngang mới xem hết, không đáng. */}
        <div
          className="pointer-events-auto relative hidden w-full lg:block"
          style={{ transform: "translateY(10px)" }}
        >
          <IndustryRail
            dangChon={hero.industryId}
            onChon={hero.chonNganh}
            onHover={hero.tamDung}
          />
        </div>
      </div>
    </section>
  );
}
