import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ConsultationWizard } from "@/components/contact/ConsultationWizard";
import { LEGAL } from "@/data/company";
import "../trang-sang.css";

export const metadata: Metadata = {
  title: "Liên hệ — Bắt đầu hành trình của bạn tại Đức",
  description: `Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp. ${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}.`,
};

export default function Page() {
  const tel = LEGAL.phone.replace(/\s/g, "");
  return (
    <div className="nb-duoi-header">
      {/* Banner cùng khuôn PageHero như mọi trang con. Ảnh văn phòng trước đây
          nằm ở cột phải, nay chuyển lên banner (nửa trái ảnh tối sẵn, không phủ lớp). */}
      <PageHero
        anh="/assets/banners/lien-he.jpg"
        anhDoc="/assets/banners/mobile/lien-he.jpg"
        nhan="Trung tâm tư vấn NIBELC"
        tieuDe={
          <>
            {/* Ngắt dòng ở máy tính để h1 dừng trước bóng người lễ tân trong ảnh */}
            Bắt đầu hành trình <br className="hidden lg:inline" />
            của bạn tại Đức
          </>
        }
        mo="Để lại thông tin, đội ngũ NIBELC sẽ tư vấn chương trình phù hợp."
      />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        {/* Máy tính: nền ngà để thẻ form + thẻ liên hệ trắng nổi lên */}
        <section className="py-10 sm:py-14 lg:bg-[#F6F1E7] lg:py-20">
          <div className="nb-wrap">
            {/* lg:items-start: cột form không bị kéo cao bằng cột phải nữa — trước
                đây khung form trống ~400px ở đáy. */}
            <div className="grid gap-7 sm:gap-8 lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)] lg:items-start lg:gap-6">
              <ConsultationWizard />

              <aside className="space-y-5 lg:space-y-6">
                <div className="nb-panel p-5 sm:p-6">
                  <b className="block text-[16px] font-semibold text-white">{LEGAL.name}</b>
                  <p className="mt-2 flex gap-2.5 text-[14px] leading-[1.7] text-[var(--nb-text-dim)]">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
                    <span>
                      {LEGAL.street}
                      <br />
                      {LEGAL.postalCode} {LEGAL.city}, {LEGAL.country}
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
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=13.368%2C52.505%2C13.383%2C52.514&layer=mapnik&marker=52.5096%2C13.3755`}
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
          </div>
        </section>
      </div>
    </div>
  );
}
