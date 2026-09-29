import Image from "next/image";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, H2, IconBox, Panel } from "@/components/sub/bits";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { LEGAL } from "@/content/legal";
import { SIMPLE } from "@/content/page-simple";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG 10 — LIÊN HỆ, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ bỏ hẳn. Nay: banner điện ảnh, bốn ô đầu mối (địa chỉ, email,
 * điện thoại, giờ làm việc) và biểu mẫu nằm trong tấm tối bên phải.
 *
 * `ContactForm` KHÔNG bị sửa: giữ nguyên trường, kiểm tra dữ liệu, điểm gửi
 * và cách báo thành công / báo lỗi. Chỉ lớp áo đổi màu qua `.nb-sub-form`.
 */
export function ContactView({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].contact;
  const tel = LEGAL.phone.replace(/\s/g, "");

  const oLienHe = [
    { icon: "pin", nhan: LEGAL.city, gt: `${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}`, href: undefined },
    { icon: "mail", nhan: "Email", gt: LEGAL.email, href: `mailto:${LEGAL.email}` },
    { icon: "phone", nhan: "Telefon", gt: LEGAL.phone, href: `tel:${tel}` },
    { icon: "clock", nhan: t.dataTitle, gt: LEGAL.country, href: undefined },
  ];

  return (
    <SubShell
      locale={locale}
      page="contact"
      hero={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam}
      heroFocus="60% 30%"
      eyebrow={t.eyebrow}
      title={t.title}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.title },
      ]}
    >
      <section className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-12 lg:py-20">
        {/* ---------------- ĐẦU MỐI LIÊN HỆ ---------------- */}
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[34px]">{t.title}</H2>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.8] text-white/65">{t.lead}</p>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {oLienHe.map((o) => (
              <li key={o.nhan}>
                <Panel className="flex h-full items-start gap-4 p-5">
                  <IconBox name={o.icon} size={44} />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-white/50">{o.nhan}</span>
                    {o.href ? (
                      <a href={o.href} className="mt-1 block text-[15px] font-semibold break-words text-white transition hover:text-[var(--nb-gold)]">
                        {o.gt}
                      </a>
                    ) : (
                      <b className="mt-1 block text-[15px] font-semibold text-white">{o.gt}</b>
                    )}
                  </span>
                </Panel>
              </li>
            ))}
          </ul>

          <Panel className="mt-6 overflow-hidden">
            <span className="relative block h-[220px]">
              <Image
                src={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.hero}
                alt=""
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover object-[50%_40%]"
              />
              <span
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(6,23,43,.15), rgba(6,23,43,.9))" }}
                aria-hidden="true"
              />
              <span className="absolute right-5 bottom-5 left-5">
                <b className="block text-[17px] font-bold text-white">{LEGAL.name}</b>
                <span className="mt-1 block text-[13.5px] text-white/65">
                  {LEGAL.street} · {LEGAL.postalCode} {LEGAL.city}
                </span>
              </span>
            </span>
          </Panel>
        </div>

        {/* ---------------- BIỂU MẪU (giữ nguyên) ---------------- */}
        <div className="min-w-0">
          <div className="nb-sub-form nb-sub-panel p-6 lg:p-9">
            <b className="flex items-center gap-3 text-[20px] font-bold text-white">
              <Icon name="send" className="h-5 w-5 text-[var(--nb-gold)]" strokeWidth={1.9} />
              {t.formTitle}
            </b>
            <div className="mt-6">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </SubShell>
  );
}
