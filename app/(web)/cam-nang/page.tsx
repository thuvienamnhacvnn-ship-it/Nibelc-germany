import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GuideHub } from "@/components/guide/GuideHub";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { camNang } from "@/lib/i18n/dict/cam-nang";
import { chuyenMucCuaBai, getArticles } from "@/data/i18n/articles";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(camNang, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

export default async function Page() {
  const lang = await getLang();
  const tx = t(camNang, lang);
  // Chuyên mục suy từ bản gốc tiếng Việt (cùng chuyên mục ở mọi ngôn ngữ),
  // bài truyền xuống đã dịch — GuideHub không tự nạp dữ liệu.
  const bai = getArticles(lang).map((b) => ({ ...b, muc: chuyenMucCuaBai(b.id) }));
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/cam-nang.jpg"
        anhDoc="/assets/banners/mobile/cam-nang.jpg"
        nhan={tx.hero.nhan}
        tieuDe={tx.hero.tieuDe}
        mo={tx.hero.mo}
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        <GuideHub bai={bai} />
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
