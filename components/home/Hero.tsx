"use client";

import { useEffect } from "react";
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
        style={{ paddingTop: "calc(var(--nb-header) + 3vh)" }}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
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
                className="nb-bong-chu max-w-[min(760px,74vw)]"
              >
                <h1 className="nb-display text-[clamp(34px,3.6vw,58px)] leading-[1.06] text-white">
                  Arbeiten in <span className="nb-gold-text">Deutschland</span>
                </h1>
                <p className="mt-2 text-[clamp(16px,1.35vw,23px)] font-medium text-[#cfdcec]">
                  mit Nibelc Germany GmbH
                </p>

                <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[var(--nb-gold)] to-transparent" />

                <p className="nb-display mt-6 text-[clamp(26px,2.9vw,46px)] tracking-[0.02em] text-white">
                  ĐỐI TÁC UY TÍN
                </p>
                <p className="mt-2.5 text-[clamp(14px,1.15vw,19px)] font-semibold tracking-[0.08em] text-[var(--nb-gold-soft)]">
                  LỰA CHỌN TỐT NHẤT CỦA BẠN
                </p>
                <p className="mt-1.5 text-[clamp(12px,0.95vw,15.5px)] tracking-[0.1em] text-[#cfdcec]">
                  CHO VIỆC LÀM VÀ HỌC NGHỀ TẠI ĐỨC, CHÂU ÂU
                </p>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thanh tìm kiếm đứng riêng, luôn ở dưới cùng phần chữ và ngay trên
            dải tệp — không bị thẻ đơn hàng đẩy đi đâu cả. */}
        <div className="w-[min(620px,86vw)] px-6 pb-8 lg:pb-6">
          <SearchBar />
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
