import { TextMask } from "@/components/ui/TextMask";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { DanhMucNganh } from "@/components/home/DanhMucNganh";
import { TheDonCongNghe } from "@/components/home/TheDonCongNghe";
import { NavLink } from "@/components/layout/NavLink";
import { KhungHud } from "@/components/tech/KhungHud";
import { LuoiKyThuat } from "@/components/tech/LuoiKyThuat";
import { TheDuLieu } from "@/components/tech/TheDuLieu";
import { DuongBay } from "@/components/tech/DuongBay";
import { INDUSTRIES } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { getChang } from "@/data/i18n/journey";
import { demKho } from "@/data/nguon";
import { layBaiMoiNhat } from "@/data/nguon-bai-viet";
import { donGoiY, donHangTheoNgonNgu, donHeroTheoNganh } from "@/components/home/du-lieu";
import { layNoiDung } from "@/data/nguon-noi-dung";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { home } from "@/lib/i18n/dict/home";
import "@/components/tech/cong-nghe.css";

const HREF_CHUONG_TRINH = ["/don-hang", "/du-hoc-nghe"] as const;
const ANH_CHUONG_TRINH = ["/assets/jobs/mechanik/01-hero-16x9.jpg", "/assets/banners/du-hoc-nghe.jpg"] as const;

export default async function Page() {
  const lang = await getLang();
  const tx = t(home, lang);
  const cn = tx.congNghe;
  const [ds, b, kho, bai] = await Promise.all([
    donHangTheoNgonNgu(lang), layNoiDung("trang-chu.banner", lang), demKho(), layBaiMoiNhat(lang),
  ]);
  const noiBat = [...ds].sort((a, b) => b.gallery.length - a.gallery.length).slice(0, 6);
  const soLieu = [kho.don, kho.suat, INDUSTRIES.length, kho.bai];
  const chang = getChang(lang);

  return <>
    <Hero
      donTheoNganh={donHeroTheoNganh(ds)}
      goiYDon={donGoiY(ds)}
      nganh={INDUSTRIES.map((n) => ({ id: n.id, ten: tenNganh(n, lang), tenVi: n.titleVi, tenDe: n.titleDe }))}
      banner={{
        anh: b.anh,
        anhDoc: b.anhDoc,
        chu: { dong1a: b.dong1a, dong1b: b.dong1b, dong2: b.dong2, dong3: b.dong3, dong4: b.dong4, dong5: b.dong5 },
      }}
    />
    <div className="nb-home-tech">
      <section aria-label={cn.bang} className="nb-bang-dieu-khien">
        <div className="nb-wrap">
          <div className="nb-bang-nhan"><p>{cn.bang}</p><span className="nb-ma">VN → DE / NIBELC</span></div>
          <div className="nb-thong-ke">{cn.thongKe.map((s, i) => <TheDuLieu key={s.ma} nhan={`${String(i + 1).padStart(2, "0")} / ${s.ma}`} so={soLieu[i] ?? 0} chuThich={s.nhan} />)}</div>
        </div>
      </section>
      <section className="nb-wrap nb-chuong">
        <div className="nb-chuong-dau" data-reveal>
          <div><p className="nb-eyebrow">01 / {tx.noiBat.nhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{tx.noiBat.tieuDe}</TextMask></h2><p className="nb-mo">{tx.noiBat.mo}</p></div>
          <NavLink data-magnetic href="/don-hang" className="nb-btn-ghost min-h-11 px-5">{tx.noiBat.tatCa}<ArrowRight size={16} /></NavLink>
        </div>
        <ul className="nb-don-noi-bat mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{noiBat.map((j) => <li key={j.id} className="min-w-0"><TheDonCongNghe don={j} lang={lang} /></li>)}</ul>
      </section>
      <section className="nb-wrap nb-chuong nb-nganh-chuong">
        <div data-reveal><p className="nb-eyebrow">{cn.nganhNhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{cn.nganhTieuDe}</TextMask></h2><p className="nb-mo">{cn.nganhMo}</p></div>
        <DanhMucNganh ds={INDUSTRIES.map((n) => ({ id: n.id, ma: n.code, ten: tenNganh(n, lang), anh: n.cover ?? "/assets/nghe/it.jpg", so: ds.filter((j) => j.industryId === n.id).length }))} />
      </section>
      <section className="nb-hanh-trinh">
        <LuoiKyThuat><div className="nb-wrap nb-chuong">
          <div className="nb-chuong-dau" data-reveal><div><p className="nb-eyebrow">{cn.loTrinhNhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{cn.loTrinhTieuDe}</TextMask></h2><p className="nb-mo">{cn.loTrinhMo}</p></div><NavLink data-magnetic href="/lo-trinh" className="nb-btn-ghost min-h-11 px-5">{cn.xemLoTrinh}<ArrowRight size={16} /></NavLink></div>
          <div className="nb-tuyen-bay"><span className="nb-ma">VN</span><DuongBay /><span className="nb-ma">DE</span></div>
          <div className="nb-cac-chang"><DuongBay luoi /><DuongBay doc /><ol className="nb-chang-ds">{chang.map((c) => <li data-reveal key={c.so} className="nb-chang"><span className="nb-chang-so nb-ma">{c.so}</span><div><p className="text-xs text-[var(--nb-accent-text)]">{c.thoiGian}</p><h3 className="mt-3 text-lg font-semibold">{c.ten}</h3><p className="mt-3 text-sm leading-relaxed text-[var(--nb-text-dim)]">{c.mo}</p></div></li>)}</ol></div>
        </div></LuoiKyThuat>
      </section>
      <section className="nb-wrap nb-chuong">
        <div data-reveal><p className="nb-eyebrow">{cn.loiNhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{cn.loiTieuDe}</TextMask></h2></div>
        <div className="nb-hai-loi">{tx.chuongTrinh.map((c, i) => <div data-reveal key={c.nhan}>
          <KhungHud nhanTrai={`0${i + 1} / VN → DE`} nhanPhai="NIBELC" className="nb-loi">
            <div className="nb-loi-anh"><Image src={ANH_CHUONG_TRINH[i === 0 ? 0 : 1]} alt="" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /></div>
            <div className="nb-loi-kinh"><p className="nb-eyebrow">{c.nhan}</p><h3 className="nb-display mt-3 text-2xl">{c.tieuDe}</h3><p className="mt-4 text-sm leading-relaxed text-[var(--nb-text-dim)]">{c.mo}</p><NavLink data-magnetic href={HREF_CHUONG_TRINH[i === 0 ? 0 : 1]} className="nb-btn-ghost mt-6 min-h-11 px-5">{c.nut}<ArrowRight size={16} /></NavLink></div>
          </KhungHud>
        </div>)}</div>
      </section>
      <section className="nb-wrap nb-chuong nb-bai-chuong">
        <div className="nb-chuong-dau" data-reveal><div><p className="nb-eyebrow">{cn.baiNhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{cn.baiTieuDe}</TextMask></h2></div><NavLink data-magnetic href="/cam-nang" className="nb-btn-ghost min-h-11 px-5">{cn.xemBai}<ArrowRight size={16} /></NavLink></div>
        <ol className="nb-bai-ds">{bai.map((a, i) => <li data-reveal key={a.id}><NavLink href={`/cam-nang/${a.slug}`} className="nb-bai"><span className="nb-bai-so">0{i + 1}</span><div className="nb-bai-anh"><Image src={a.anhBia ?? "/assets/jobs/it/03-portrait-team-3x4.jpg"} alt="" fill sizes="(max-width: 639px) 90px, 180px" className="object-cover" /></div><div><h3 className="nb-display text-xl sm:text-2xl">{a.tieuDe}</h3><p className="mt-3 text-sm text-[var(--nb-text-dim)]">{a.tomTat}</p></div><ArrowRight size={20} className="nb-bai-mui" /></NavLink></li>)}</ol>
        {bai.length === 0 && <p className="mt-8 text-[var(--nb-text-dim)]">{cn.chuaCoBai}</p>}
      </section>
      <section className="nb-cta-tech"><LuoiKyThuat><div className="nb-wrap nb-chuong"><KhungHud nhanTrai="06 / VN → DE" nhanPhai="NIBELC" className="nb-cta-khung"><div data-reveal><p className="nb-eyebrow">{tx.cta.nhan}</p><h2 className="nb-display nb-tieu-de"><TextMask>{tx.cta.tieuDe}</TextMask></h2><p className="nb-mo">{tx.cta.mo}</p><NavLink data-magnetic href="/lien-he" className="nb-btn mt-7 min-h-12 px-6">{tx.cta.dangKy}<ArrowRight size={17} /></NavLink></div><div className="nb-cta-bay"><div className="flex justify-between nb-ma"><span>VN</span><span>DE</span></div><DuongBay /></div></KhungHud></div></LuoiKyThuat></section>
    </div>
  </>;
}
