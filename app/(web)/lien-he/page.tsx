import { ThuocToaDo } from "@/components/tech/ThuocToaDo";
import { KhungHud } from "@/components/tech/KhungHud";
import { congNghe } from "@/lib/i18n/dict/cong-nghe";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ConsultationWizard } from "@/components/contact/ConsultationWizard";
import { LEGAL } from "@/data/company";
import { layNoiDung } from "@/data/nguon-noi-dung";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { lienHe } from "@/lib/i18n/dict/lien-he";
import { DIA_CHI_NGAN, diaChiMotDong } from "@/data/i18n/company";
import "../trang-sang.css";

// MẪU ĐA NGÔN NGỮ: metadata theo ngôn ngữ → generateMetadata (không dùng
// `export const metadata` tĩnh nữa). Không khai `alternates` — layout lo.
export async function generateMetadata(): Promise<Metadata> {
  const tx = t(lienHe, await getLang());
  return {
    title: tx.meta.tieuDe,
    description: tx.meta.moTa(DIA_CHI_NGAN),
  };
}

export default async function Page() {
  const lang = await getLang();
  const tx = t(lienHe, lang);
  const tel = LEGAL.phone.replace(/\s/g, "");
  // ảnh + chữ banner: nhân viên sửa ở mục "lien-he.banner"; chưa sửa thì ra đúng bản cũ
  const b = await layNoiDung("lien-he.banner", lang);
  return (
    <div className="nb-duoi-header">
      {/* Banner cùng khuôn PageHero như mọi trang con. Ảnh văn phòng trước đây
          nằm ở cột phải, nay chuyển lên banner (nửa trái ảnh tối sẵn, không phủ lớp). */}
      <PageHero video="lien-he" maTrang={congNghe[lang].trang.lien}
        anh={b.anh}
        anhDoc={b.anhDoc}
        anhBenPhai
        nhan={b.nhan}
        tieuDe={b.tieuDe}
        mo={b.mo || undefined}
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* Máy tính: dải đầu sau banner nền TRẮNG như mọi trang con (thẻ có viền + bóng) */}
        <section className="py-10 sm:py-14 lg:bg-[var(--s-page)] lg:py-20"><ThuocToaDo />
          <div className="nb-wrap">
            {/* lg:items-start: cột form không bị kéo cao bằng cột phải nữa — trước
                đây khung form trống ~400px ở đáy. */}
            <div className="grid gap-7 sm:gap-8 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:items-start lg:gap-6">
              <ConsultationWizard />

              <aside data-reveal className="space-y-5 lg:space-y-6">
                <KhungHud nhanTrai={congNghe[lang].lienHe} className="nb-thong-tin p-5 sm:p-6">
                  {/* Khuôn Sếp chốt 02/10 (ảnh mẫu): ghim + tên công ty đậm,
                      dưới là địa chỉ MỘT dòng có tên nước. */}
                  <p data-reveal className="flex gap-2.5 text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">
                    <MapPin size={16} className="mt-1 shrink-0 text-[var(--nb-accent-text)]" />
                    <span>
                      <b className="block text-[16px] font-semibold text-[var(--nb-heading)]">{LEGAL.name}</b>
                      {diaChiMotDong(lang)}
                    </span>
                  </p>

                  <ul className="mt-5 space-y-1 border-t border-[var(--nb-line-soft)] pt-4 text-[14px] sm:space-y-2.5 sm:pt-5">
                    <li>
                      <a href={`tel:${tel}`} className="flex min-h-[44px] items-center gap-3 text-[var(--nb-text-dim)] transition hover:text-[var(--nb-accent-text)] lg:min-h-0">
                        <Phone size={15} className="shrink-0 text-[var(--nb-accent-text)]" />
                        {LEGAL.phone}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${LEGAL.email}`} className="flex min-h-[44px] items-center gap-3 break-all text-[var(--nb-text-dim)] transition hover:text-[var(--nb-accent-text)] lg:min-h-0">
                        <Mail size={15} className="shrink-0 text-[var(--nb-accent-text)]" />
                        {LEGAL.email}
                      </a>
                    </li>
                    <li className="flex items-start gap-3 py-2 leading-[1.6] text-[var(--nb-text-mute)]">
                      <MessageCircle size={15} className="mt-1 shrink-0 text-[var(--nb-accent-text)]" />
                      {tx.whatsapp}
                    </li>
                  </ul>
                </KhungHud>

                <KhungHud nhanTrai={congNghe[lang].banDo} className="nb-thong-tin overflow-hidden">
                  <div className="relative h-[220px]">
                    <iframe
                      title={tx.banDo(`${LEGAL.street}, ${LEGAL.city}`)}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=13.368%2C52.505%2C13.383%2C52.514&layer=mapnik&marker=52.5096%2C13.3755`}
                      className="h-full w-full border-0 grayscale-[35%]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <p data-reveal className="px-5 py-3 text-[12.5px] text-[var(--nb-text-mute)]">{diaChiMotDong(lang)}</p>
                </KhungHud>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
