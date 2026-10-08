"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroJobRotation } from "@/hooks/useHeroJobRotation";
import { IndustryRail } from "@/components/home/IndustryRail";
import { FeaturedJob } from "@/components/home/FeaturedJob";
import { SearchBar } from "@/components/home/SearchBar";
import { HeroVideo } from "@/components/home/HeroVideo";
import { NhomNhanVat } from "@/components/home/NhomNhanVat";
import { CumTieuDe, type ChuTieuDe } from "@/components/home/CumTieuDe";
import { LogoDong } from "@/components/home/LogoDong";
import { NavLink } from "@/components/layout/NavLink";
import type { JobFull } from "@/data/jobs";
import type { DonGoiY } from "@/components/home/du-lieu";
import { useT } from "@/lib/i18n/client";
import { home } from "@/lib/i18n/dict/home";

/** Ngành cho ô tìm kiếm: tên theo ngôn ngữ trang + tên vi/de để tìm được cả hai */
export interface NganhTim {
  id: string;
  ten: string;
  tenVi: string;
  tenDe: string;
}

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
export function Hero({
  donTheoNganh,
  goiYDon,
  nganh,
  banner,
}: {
  /** đơn hiện trên thẻ hero theo từng ngành — đã dịch sẵn phía server */
  donTheoNganh: Record<string, JobFull>;
  goiYDon: DonGoiY[];
  nganh: NganhTim[];
  /** ảnh nền + chữ cụm tiêu đề đọc từ CSDL (mục "trang-chu.banner"); thiếu thì dùng từ điển + ảnh tĩnh như cũ */
  banner?: { anh: string; anhDoc: string; chu: ChuTieuDe };
}) {
  const hero = useHeroJobRotation(donTheoNganh);
  const tx = useT(home);
  const chu = banner?.chu ?? tx.hero;

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
      <HeroVideo anh={banner?.anh} anhDoc={banner?.anhDoc} />

      {/* KHÔNG phủ lớp màu nào lên video. Chữ hero đọc được nhờ bóng chữ
          riêng (.nb-bong-chu), không nhờ làm tối cả khung hình. */}

      {/* Dải chuyển tiếp rất mỏng ở sát đáy, chỉ để video nối liền vào nền
          navy của phần dưới — không phải lớp phủ lên khung hình. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[14%]"
        style={{
          // bắt đầu từ CHÍNH màu nền ở độ trong suốt 0 — chép tay rgba(5,11,22,0)
          // thì sau khi nền đổi sang xanh, giữa dải hiện một vệt xám bẩn
          background: "linear-gradient(180deg, rgb(var(--nb-navy-900-rgb) / 0) 0%, var(--nb-navy-900) 92%)",
        }}
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
          {/* Sếp: logo 3D ĐỘNG nằm trên cụm tiêu đề ở CẢ điện thoại lẫn máy
              tính. Khung video có lề trong suốt (hình logo chỉ chiếm ~80%
              chiều cao), nên hộp cao 1,25 lần hình và lề bù lại bằng margin
              âm — để KHÔNG thứ gì bên dưới bị xê dịch:
                - điện thoại: hộp 70px = hình 56px, đúng bằng logo SVG h-14
                  trước đây; -7 + 70 + 13 = 76px = 56 + 20 (mb-5) của bản cũ,
                  thanh tìm kiếm đứng nguyên chỗ.
                - máy tính: hộp 72px kéo ngược lên đúng 72px vào khoảng đệm
                  phía trên (ngay dưới header), chiếm 0px trong dòng chảy.
              Logo đứng NGOÀI khối đổi tiêu đề/thẻ đơn nên bấm tệp ngành nó
              không nhảy. */}
          <NavLink
            href="/"
            aria-label={tx.logoAria}
            className="mt-[26px] mb-[16px] block lg:-mt-[72px] lg:mb-0"
          >
            {/* Sếp chốt: chữ trắng, cánh cung đen-đỏ-vàng giữ nguyên, và
                TUYỆT ĐỐI không thêm nền. Không bộ lọc, không bóng, không tấm
                lót. */}
            {/* Đặt bề NGANG, chiều cao tự ra theo tỉ lệ 1200/380 của hộp.
                Sếp 08/10: "cho logo to ra, title đẩy thấp xuống dưới".
                  - điện thoại: 300px → cao 95px (trước 70px). Lề trên 26px để
                    logo nằm HẲN dưới hai nút góc (ngôn ngữ, ba chấm — đáy ở
                    56px): to ra mà giữ chỗ cũ thì đè lên hai nút đó. Chiếm
                    26 + 95 + 16 = 137px, hơn bản cũ 61px → tiêu đề tụt 61px.
                  - máy tính: 360px → cao 114px (trước 72px). Vẫn kéo ngược
                    72px vào khoảng đệm dưới header, nên chiếm 42px trong dòng
                    chảy → tiêu đề tụt 42px.
                Thanh tìm kiếm bên dưới bớt đúng ngần ấy lề (xem mt ở đó) nên
                nó và dải phong bì đứng nguyên chỗ. */}
            <LogoDong className="mx-auto w-[300px] lg:w-[360px]" />
          </NavLink>
          {/* Cụm tiêu đề là SVG. SVG có <text> thật nên máy tìm kiếm đọc được,
              nhưng vẫn giữ một <h1> ẩn cho chắc — và để trình đọc màn hình
              gặp đúng một tiêu đề cấp 1 trên trang. Chữ lấy theo ngôn ngữ
              đang xem, không chép tay. */}
          <h1 className="sr-only">
            {chu.dong1a} {chu.dong1b} {chu.dong2} — {chu.dong3},{" "}
            {chu.dong4} {chu.dong5}
          </h1>

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
                  {/* Máy tính: trước đây cụm này có lg:-mt-8 (nhấc lên 32px).
                      Bỏ đi để nhường đúng khoảng đó cho logo 3D phía trên —
                      khối ngoài khoá 408px nên thanh tìm kiếm không đổi chỗ. */}
                  <CumTieuDe
                    chu={chu}
                    deDong1={tx.dong1De}
                    className="lg:w-max lg:max-w-[min(860px,60vw)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Thanh tìm kiếm đứng NGOÀI khối đổi: mở đơn hay không nó vẫn ở
              nguyên đây. */}
          {/* 120px trừ phần logo to ra đã đẩy xuống: 61px ở điện thoại, 42px ở
              máy tính — thanh tìm kiếm không đổi chỗ so với trước. */}
          <div className="mt-[59px] w-[min(500px,84vw)] lg:mt-[78px]">
            <SearchBar don={goiYDon} nganh={nganh} />
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
