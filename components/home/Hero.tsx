"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroJobRotation } from "@/hooks/useHeroJobRotation";
import { IndustryRail } from "@/components/home/IndustryRail";
import { FeaturedJob } from "@/components/home/FeaturedJob";
import { SearchBar } from "@/components/home/SearchBar";
import { HeroVideo } from "@/components/home/HeroVideo";
import { NhomNhanVat } from "@/components/home/NhomNhanVat";
import { CumTieuDe } from "@/components/home/CumTieuDe";
import { NavLink } from "@/components/layout/NavLink";

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
        style={{ paddingTop: "var(--nb-dem-hero, calc(var(--nb-header) + 76px))" }}
      >
        <div className="flex flex-1 flex-col items-center justify-start px-6 pt-0 text-center">
          {/* LOGO nằm trong BANNER, không phải trong header.
              Trên điện thoại header đã bỏ hẳn, nên logo là một phần của banner
              và trôi theo khi cuộn — không có thanh nào bám đỉnh màn hình. */}
          <NavLink
            href="/"
            aria-label="NIBELC GERMANY — trang chủ"
            className="mb-5 block lg:hidden"
          >
            <Image
              src="/assets/brand/nibelc-logo.svg"
              alt="NIBELC GERMANY"
              width={200}
              height={44}
              priority
              className="mx-auto h-14 w-auto drop-shadow-[0_2px_6px_rgba(4,10,20,.9)]"
            />
          </NavLink>
          {/* h1 nằm trong CumTieuDe (chữ HTML thật), không cần bản sr-only nữa. */}

          {/* Bấm một tệp thì CẢ CỤM tiêu đề nhường chỗ cho thẻ đơn — đúng
              quy luật Sếp đặt từ đầu.
              Khối này KHOÁ CHIỀU CAO: cụm tiêu đề cao hơn thẻ đơn, nếu để nó
              tự co thì lúc đổi qua lại dải tệp bên dưới bị nhấc lên hạ xuống
              theo. Hai nhánh cùng neo tuyệt đối ở mép trên. */}
          <div className="relative h-[408px] w-full">
            <AnimatePresence mode="wait" custom={{ doiTiep: hero.doiTiep, huong: hero.huong }}>
              {hero.dangHienJob && hero.job ? (
                <motion.div
                  key={`job-${hero.job.id}`}
                  className="absolute top-0 left-1/2 flex -translate-x-1/2 flex-col items-center"
                  style={{ perspective: 1200 }}
                >
                  <FeaturedJob job={hero.job} oTep={hero.oTep} doiTiep={hero.doiTiep} huong={hero.huong} />
                </motion.div>
              ) : (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
                  className="absolute inset-x-0 top-0 flex flex-col items-center"
                >
                  <CumTieuDe className="lg:-mt-8 lg:w-max lg:max-w-[min(860px,60vw)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thanh tìm kiếm đứng NGOÀI khối đổi: mở đơn hay không nó vẫn ở
              nguyên đây. */}
          <div className="mt-[120px] w-[min(500px,84vw)]">
            <SearchBar />
          </div>
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
