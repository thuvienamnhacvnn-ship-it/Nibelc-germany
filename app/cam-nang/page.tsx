import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GuideHub } from "@/components/guide/GuideHub";
import { CAM_NANG } from "@/data/articles";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import "../trang-sang.css";

export const metadata: Metadata = {
  title: "Cẩm nang Đức — Kiến thức cần thiết trước và sau khi sang Đức",
  description:
    "Visa, hồ sơ, học tiếng, bảng lương, nhà ở, bảo hiểm và văn hoá làm việc — những gì cần biết trước và sau khi sang Đức.",
};

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/cam-nang.jpg"
        anhDoc="/assets/banners/mobile/cam-nang.jpg"
        nhan="Cẩm nang kiến thức"
        tieuDe="Cẩm nang Đức"
        mo="Kiến thức cần thiết trước và sau khi sang Đức: thủ tục, tiếng, bảng lương, nhà ở và văn hoá làm việc."
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        <GuideHub />
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
