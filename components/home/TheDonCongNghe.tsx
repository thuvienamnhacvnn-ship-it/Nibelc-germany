import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { VienChay } from "@/components/tech/VienChay";
import { industryById } from "@/data/industries";
import { tenNganh } from "@/data/i18n/industries";
import { chuoiLuong, noiLamViec, nhanNgonNgu } from "@/types/job";
import { NHAN_DON_HANG } from "@/data/i18n/jobs";
import type { JobFull } from "@/data/jobs";
import type { Lang } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/dict/home";
import { donHang } from "@/lib/i18n/dict/don-hang";

export function TheDonCongNghe({ don, lang, chiTiet = false }: { don: JobFull; lang: Lang; chiTiet?: boolean }) {
  const nganh = industryById(don.industryId);
  const tx = home[lang];
  return <VienChay className="h-full">
    <NavLink data-reveal data-tilt href={`/don-hang/${don.slug}`} className="nb-don-tech group">
      <div className="nb-don-anh"><Image src={don.image} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw" className="object-cover" /></div>
      <div className="nb-don-than">
        <p className="nb-don-nhan"><span className="nb-ma">{nganh?.code ?? "—"} / {don.industryId}</span><span className="nb-ma">{don.state.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "D")}</span></p>
        {don.isSample && <p className="mt-2 text-xs text-[var(--nb-text-dim)]">{donHang[lang].mau}</p>}
        {nganh && <p className="mt-1 text-xs text-[var(--nb-text-dim)]">{tenNganh(nganh, lang)}</p>}
        <h3 className="mt-4 text-lg font-semibold leading-snug">{don.title}</h3>
        <p className="mt-2 text-sm text-[var(--nb-text-dim)]">{noiLamViec(don)}</p>
        {chiTiet && <div className="mt-3 space-y-1 text-xs text-[var(--nb-text-dim)]">
          {don.company && <p>{don.company}</p>}
          {nhanNgonNgu(don, lang) && <p>{nhanNgonNgu(don, lang)}</p>}
          <p>{NHAN_DON_HANG[lang].chuongTrinh[don.programType]} · {NHAN_DON_HANG[lang].hinhThuc[don.employmentType]}</p>
        </div>}
        <div className="nb-don-so"><b>{chuoiLuong(don, lang)}</b><span>{tx.the.soSuat(don.vacancies)}</span></div>
        <span className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">{tx.the.xemDon}<ArrowUpRight size={19} /></span>
      </div>
    </NavLink>
  </VienChay>;
}
