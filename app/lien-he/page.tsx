import Image from "next/image";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ConsultationWizard } from "@/components/contact/ConsultationWizard";
import { KHUNG_BAN_DO, LEGAL, TOA_DO } from "@/data/company";

export const metadata: Metadata = {
  title: "Liên hệ — Bắt đầu hành trình của bạn tại Đức",
  description: `Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp. ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}.`,
};

export default function Page() {
  const tel = LEGAL.phone.replace(/\s/g, "");
  return (
    <div className="nb-duoi-header">
      <section className="nb-wrap py-10 sm:py-14">
        <p className="nb-eyebrow">Trung tâm tư vấn NIBELC</p>
        <h1 className="nb-display mt-3 text-[26px] leading-[1.18] text-white sm:text-[clamp(30px,3.2vw,44px)] sm:leading-[1.15]">
          Bắt đầu hành trình của bạn tại Đức
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-[var(--nb-text-dim)] sm:text-[16px]">
          Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp.
        </p>

        <div className="mt-8 grid gap-7 sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)]">
          <ConsultationWizard />

          <aside className="space-y-5">
            <span className="relative block aspect-[16/9] overflow-hidden rounded-[16px] border border-[var(--nb-line-soft)]">
              <Image
                src="/assets/banners/lien-he.jpg"
                alt="Văn phòng NIBELC Germany GmbH"
                fill
                sizes="(min-width:1024px) 520px, 100vw"
                className="object-cover"
              />
            </span>

            <div className="nb-panel p-5 sm:p-6">
              <b className="block text-[16px] font-semibold text-white">{LEGAL.name}</b>
              <p className="mt-2 flex gap-2.5 text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
                <span>
                  {LEGAL.street}, {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
                </span>
              </p>

              <ul className="mt-5 space-y-1 border-t border-[var(--nb-line-soft)] pt-4 text-[14px] sm:space-y-2.5 sm:pt-5">
                <li>
                  <a href={`tel:${tel}`} className="flex min-h-[44px] items-center gap-3 text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0">
                    <Phone size={15} className="shrink-0 text-[var(--nb-gold)]" />
                    {LEGAL.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${LEGAL.email}`} className="flex min-h-[44px] items-center gap-3 break-all text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)] lg:min-h-0">
                    <Mail size={15} className="shrink-0 text-[var(--nb-gold)]" />
                    {LEGAL.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 py-2 leading-[1.6] text-[var(--nb-text-mute)]">
                  <MessageCircle size={15} className="mt-1 shrink-0 text-[var(--nb-gold)]" />
                  WhatsApp / tư vấn trực tuyến — liên hệ qua số trên
                </li>
              </ul>
            </div>

            <div className="nb-panel overflow-hidden">
              <div className="relative h-[220px]">
                <iframe
                  title={`Bản đồ ${LEGAL.street}, ${LEGAL.city}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(KHUNG_BAN_DO)}&layer=mapnik&marker=${TOA_DO.lat}%2C${TOA_DO.lon}`}
                  className="h-full w-full border-0 grayscale-[35%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="px-5 py-3 text-[12.5px] text-[var(--nb-text-mute)]">
                {LEGAL.street}, {LEGAL.postalCode} {LEGAL.city}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
