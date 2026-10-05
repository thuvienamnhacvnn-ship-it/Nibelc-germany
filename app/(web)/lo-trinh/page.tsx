import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";
import { getChang } from "@/data/i18n/journey";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { loTrinh } from "@/lib/i18n/dict/lo-trinh";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(loTrinh, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

export default async function Page() {
  const lang = await getLang();
  const tx = t(loTrinh, lang);
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/lo-trinh.jpg"
        anhDoc="/assets/banners/mobile/lo-trinh.jpg"
        nhan={tx.hero.nhan}
        tieuDe={tx.hero.tieuDe}
        mo={tx.hero.mo}
        loiTat={[
          { nhan: tx.hero.loiTat.donHang, href: "/don-hang" },
          { nhan: tx.hero.loiTat.duHocNghe, href: "/du-hoc-nghe" },
          { nhan: tx.hero.loiTat.tuVan, href: "/lien-he" },
        ]}
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        <section className="nb-wrap py-10 sm:py-14 lg:py-20">
          {/* 9 chặng đã dịch theo ngôn ngữ (data/i18n/journey.ts) — dựng ở server,
              truyền xuống để client không phải mang cả 3 bản dữ liệu */}
          <JourneyTimeline chang={getChang(lang)} />
        </section>
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
