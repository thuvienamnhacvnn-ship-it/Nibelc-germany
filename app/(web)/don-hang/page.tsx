import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JobMarketplace } from "@/components/jobs/JobMarketplace";
import { layDonHang } from "@/data/nguon";
import { layNoiDung } from "@/data/nguon-noi-dung";
import { INDUSTRIES } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { getLang } from "@/lib/i18n/server";
import type { Lang } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/dict";
import { donHang } from "@/lib/i18n/dict/don-hang";
import "./don-hang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(donHang, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

/* Bốn nhóm ngành đang có nhiều đơn nhất — bấm là ra ngay kết quả đã lọc,
   thay cho hai con số trước đây chỉ để ngắm. */
function loiTat(lang: Lang, ds: { industryId: string }[]) {
  return [
    { nhan: t(donHang, lang).hero.tatCa, href: "/don-hang" },
    ...INDUSTRIES.map((n) => ({
      nhan: tenNganh(n, lang),
      href: `/don-hang?nganh=${n.id}`,
      so: ds.filter((j) => j.industryId === n.id).length,
    }))
      .filter((x) => x.so > 0)
      .sort((a, b) => b.so - a.so)
      .slice(0, 4),
  ];
}

export default async function Page() {
  const lang = await getLang();
  const tx = t(donHang, lang);
  /* Đơn đã dịch theo ngôn ngữ + vài trường GỐC (thành phố, nước, kinh nghiệm)
     để bộ lọc so theo GIÁ TRỊ dữ liệu chứ không theo chữ hiển thị — bản /de
     lọc "Griechenland" vẫn phải ra đúng mấy đơn mà dữ liệu ghi "Hy Lạp".
     Đọc thẳng CSDL: nhân viên sửa trong trang quản trị là trang này đổi theo,
     không cần ai build lại. */
  const [ban, banGoc, b] = await Promise.all([layDonHang(lang), layDonHang("vi"), layNoiDung("don-hang.banner", lang)]);
  const goc = new Map(banGoc.map((j) => [j.id, j]));
  const jobs = ban.map((j) => {
    const g = goc.get(j.id) ?? j;
    return { ...j, goc: { city: g.city, state: g.state, experience: g.experience } };
  });
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh={b.anh}
        anhDoc={b.anhDoc}
        nhan={b.nhan}
        tieuDe={b.tieuDe}
        mo={b.mo || undefined}
        loiTat={loiTat(lang, banGoc)}
        chuaThanhTim
      />
      <Suspense fallback={<div className="nb-wrap py-20 text-[var(--nb-text-dim)]">{tx.dangTaiLoc}</div>}>
        <JobMarketplace jobs={jobs} />
      </Suspense>
    </div>
  );
}
