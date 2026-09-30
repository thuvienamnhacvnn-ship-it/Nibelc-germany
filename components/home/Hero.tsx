"use client";

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

  return (
    <section className="relative isolate min-h-[calc(100vh-40px)] overflow-hidden">
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
        rong="w-[clamp(320px,29vw,520px)]"
        mo={hero.dangHienJob ? 0 : 1}
        dich={hero.dangHienJob ? -60 : 0}
        w={1005}
        h={822}
      />

      <NhomNhanVat
        src="/assets/home/people/group-right.png"
        ben="phai"
        rong="w-[clamp(300px,27vw,480px)]"
        mo={hero.dangHienJob ? 0 : 1}
        dich={hero.dangHienJob ? 60 : 0}
        w={909}
        h={822}
      />

      {/* ---------- BANNER ĐƠN HÀNG ----------
          Chiếm toàn bộ hero, thay chỗ video và hai nhóm nhân vật. Dải tệp
          ngành nằm ở lớp trên nên vẫn thấy nguyên dưới chân banner. */}
      <AnimatePresence>
        {hero.dangHienJob && hero.job && (
          <motion.div
            key={hero.job.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-[15]"
          >
            <FeaturedJob job={hero.job} />
            <button
              type="button"
              onClick={hero.boChon}
              className="nb-btn-ghost absolute top-[calc(var(--nb-header)+20px)] right-8 z-10 h-10 px-5 text-[13.5px]"
            >
              <X size={15} />
              Quay lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- KHỐI GIỮA ---------- */}
      <div
        className="relative z-20 flex min-h-[calc(100vh-40px)] flex-col items-center"
        style={{ paddingTop: "calc(var(--nb-header) + 3vh)" }}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            {hero.dangHienJob && hero.job ? null : (
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

                <div className="mt-8 w-[min(620px,80vw)]">
                  <SearchBar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------- DẢI PHONG BÌ ---------- */}
        {/* translateY âm để phong bì tràn qua biên hero xuống phần dưới */}
        <div className="relative w-full" style={{ transform: "translateY(10px)" }}>
          <IndustryRail
            dangChon={hero.industryId}
            onChon={hero.chonNganh}
            onHover={hero.tamDung}
            dangHienJob={hero.dangHienJob}
          />
        </div>
      </div>
    </section>
  );
}
