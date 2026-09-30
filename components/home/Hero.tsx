"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroJobRotation } from "@/hooks/useHeroJobRotation";
import { IndustryRail } from "@/components/home/IndustryRail";
import { FeaturedJob } from "@/components/home/FeaturedJob";
import { SearchBar } from "@/components/home/SearchBar";
import { HeroVideo } from "@/components/home/HeroVideo";
import { industryById } from "@/data/industries";

/**
 * HERO TRANG CHỦ
 *
 * Bố cục khoá theo mẫu Sếp duyệt:
 *   - nền panorama nước Đức, object-fit cover, không kéo méo
 *   - hai nhóm nhân vật ép sát hai mép, KHOẢNG GIỮA để trống cho tiêu đề
 *   - tiêu đề nằm chính giữa, không đè lên người
 *   - KHÔNG có job card bay lơ lửng khi chưa chọn ngành (prompt mục 09)
 *   - dải phong bì ngành nghề sát chân hero, tràn xuống phần dưới
 */
export function Hero() {
  const hero = useHeroJobRotation();
  const nganh = hero.industryId ? industryById(hero.industryId) : null;
  const anhNganh = nganh?.cover ?? null;

  return (
    <section className="relative isolate min-h-[calc(100vh-40px)] overflow-hidden">
      {/* ---------- NỀN: video, bản ngang cho desktop và bản dọc cho điện thoại ---------- */}
      <HeroVideo />

      {/* nền đổi sang môi trường nghề khi hero chuyển chế độ giới thiệu đơn */}
      <AnimatePresence>
        {hero.dangHienJob && anhNganh && (
          <motion.div
            key={anhNganh}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            className="absolute inset-0 -z-10"
          >
            <Image src={anhNganh} alt="" fill sizes="100vw" className="object-cover object-center" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vệt tối mềm chỉ ở vùng giữa, đủ để chữ trắng đọc được trên nền trời
          sáng. Không phải lớp phủ toàn ảnh — hai bên và bốn góc vẫn nguyên. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 42% at 50% 38%, rgba(5,11,22,.72) 0%, rgba(5,11,22,.42) 55%, transparent 78%)",
        }}
        aria-hidden="true"
      />

      {/* chân hero chuyển dần sang navy để nối liền với dải phong bì */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,11,22,0) 0%, rgba(5,11,22,.55) 46%, rgba(5,11,22,.92) 78%, var(--nb-navy-900) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ---------- HAI NHÓM NHÂN VẬT ---------- */}
      {/* Ép sát hai mép, chừa hẳn khoảng giữa cho tiêu đề. Mờ bớt khi hero
          chuyển sang giới thiệu đơn hàng để thẻ job nổi lên. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: hero.dangHienJob ? 0.3 : 1, x: hero.dangHienJob ? -24 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="pointer-events-none absolute bottom-[86px] left-0 z-10 w-[clamp(320px,29vw,520px)] origin-bottom-left"
      >
        <Image
          src="/assets/home/people/group-left.png"
          alt=""
          width={1005}
          height={822}
          priority
          quality={92}
          sizes="470px"
          className="h-auto w-full drop-shadow-[0_28px_44px_rgba(0,0,0,.55)]"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{ opacity: hero.dangHienJob ? 0.3 : 1, x: hero.dangHienJob ? 24 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="pointer-events-none absolute right-0 bottom-[86px] z-10 w-[clamp(300px,27vw,480px)] origin-bottom-right"
      >
        <Image
          src="/assets/home/people/group-right.png"
          alt=""
          width={909}
          height={822}
          priority
          quality={92}
          sizes="430px"
          className="h-auto w-full drop-shadow-[0_28px_44px_rgba(0,0,0,.55)]"
        />
      </motion.div>

      {/* ---------- KHỐI GIỮA ---------- */}
      <div
        className="relative z-20 flex min-h-[calc(100vh-40px)] flex-col items-center"
        style={{ paddingTop: "calc(var(--nb-header) + 3vh)" }}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            {hero.dangHienJob && hero.job ? (
              <motion.div key="job" className="flex flex-col items-center">
                <FeaturedJob job={hero.job} />
                <button
                  type="button"
                  onClick={hero.boChon}
                  className="mt-4 text-[13px] font-medium text-[var(--nb-text-dim)] underline-offset-4 transition hover:text-[var(--nb-gold-soft)] hover:underline"
                >
                  Quay lại giới thiệu
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                className="max-w-[min(760px,74vw)]"
              >
                <h1 className="nb-display text-[clamp(34px,3.6vw,58px)] leading-[1.06] text-white">
                  Arbeiten in <span className="nb-gold-text">Deutschland</span>
                </h1>
                <p className="mt-2 text-[clamp(16px,1.35vw,23px)] font-medium text-[var(--nb-text-dim)]">
                  mit Nibelc Germany GmbH
                </p>

                <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[var(--nb-gold)] to-transparent" />

                <p className="nb-display mt-6 text-[clamp(26px,2.9vw,46px)] tracking-[0.02em] text-white">
                  ĐỐI TÁC UY TÍN
                </p>
                <p className="mt-2.5 text-[clamp(14px,1.15vw,19px)] font-semibold tracking-[0.08em] text-[var(--nb-gold-soft)]">
                  LỰA CHỌN TỐT NHẤT CỦA BẠN
                </p>
                <p className="mt-1.5 text-[clamp(12px,0.95vw,15.5px)] tracking-[0.1em] text-[var(--nb-text-dim)]">
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
          <IndustryRail dangChon={hero.industryId} onChon={hero.chonNganh} onHover={hero.tamDung} />
        </div>
      </div>
    </section>
  );
}
