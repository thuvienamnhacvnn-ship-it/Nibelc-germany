import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GuideHub } from "@/components/guide/GuideHub";
import { CAM_NANG } from "@/data/articles";

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
        soLieu={[{ so: String(CAM_NANG.length), nhan: "bài viết" }]}
      />
      <GuideHub />
    </div>
  );
}
