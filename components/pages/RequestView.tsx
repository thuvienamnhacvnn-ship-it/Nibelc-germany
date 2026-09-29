import Image from "next/image";
import { SubShell } from "@/components/sub/SubShell";
import { Eyebrow, H2, IconBox, Panel } from "@/components/sub/bits";
import { RequestForm, type Option } from "@/components/forms/RequestForm";
import { Icon } from "@/components/ui/Icon";
import { activeIndustries, industryName, industryRoles } from "@/content/industries";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { LEGAL } from "@/content/legal";
import { REQUEST } from "@/content/page-request";
import { ROUTES, type Locale } from "@/content/locales";

/**
 * TRANG 09 — GỬI NHU CẦU NHÂN SỰ, dựng lại theo bộ KIT navy–vàng.
 *
 * Bố cục cũ đã bỏ; nay là màn hình chia đôi kiểu báo chí: bên trái là ảnh
 * doanh nghiệp cùng cam kết và đầu mối liên hệ, bên phải là biểu mẫu.
 *
 * BIỂU MẪU GIỮ NGUYÊN: `RequestForm` không bị sửa một dòng nào — vẫn đủ bốn
 * bước, các trường bắt buộc, phần kiểm tra dữ liệu, điểm gửi `/api/anfrage`
 * và cách báo thành công / báo lỗi. Chỉ lớp áo đổi màu qua `.nb-sub-form`.
 */
export function RequestView({ locale }: { locale: Locale }) {
  const t = REQUEST[locale];
  const tel = LEGAL.phone.replace(/\s/g, "");
  // Danh sách ngành và nghề cho hai ô chọn — dựng đúng như bản cũ, không đổi.
  const branchen: Option[] = activeIndustries().map((i) => ({ value: i.slug, label: industryName(i, locale) }));
  const berufe: Option[] = activeIndustries().flatMap((i) =>
    [...new Set([i.berufDe, ...industryRoles(i, locale)])].map((r) => ({ value: `${i.slug}:${r}`, label: r, group: i.slug })),
  );

  return (
    <SubShell
      locale={locale}
      page="request"
      hero={INDUSTRY_ASSETS["produktion-maschinen-anlagen"]!.hero}
      heroFocus="60% 40%"
      eyebrow={t.eyebrow}
      title={t.h1[0]!}
      titleGold={t.h1[1]}
      lead={t.lead}
      breadcrumb={[
        { label: locale === "vi" ? "Trang chủ" : locale === "en" ? "Home" : "Startseite", href: ROUTES.home[locale] },
        { label: t.h1.join(" ") },
      ]}
    >
      <section className="mx-auto grid max-w-[1560px] gap-10 px-6 py-14 lg:grid-cols-[420px_1fr] lg:gap-14 lg:px-12 lg:py-20">
        {/* ---------------- CỘT TRÁI: ẢNH + CAM KẾT ---------------- */}
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <span className="relative block h-[230px] overflow-hidden rounded-2xl ring-1 ring-white/10 lg:h-[300px]">
            <Image
              src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.portraitTeam}
              alt=""
              fill
              sizes="(min-width:1024px) 420px, 100vw"
              className="object-cover object-[50%_30%]"
            />
            <span
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(6,23,43,.1), rgba(6,23,43,.8))" }}
              aria-hidden="true"
            />
          </span>

          <ul className="mt-7 space-y-5">
            {t.trust.map(([a2, b2], i) => (
              <li key={a2} className="flex items-center gap-4">
                <IconBox name={["shield", "clock", "handshake"][i] ?? "check"} size={44} />
                <span>
                  <b className="block text-[15.5px] font-bold text-white">{a2}</b>
                  <span className="block text-[13.5px] text-white/55">{b2}</span>
                </span>
              </li>
            ))}
          </ul>

          <Panel className="mt-7 p-6">
            <Eyebrow>{t.advice.title}</Eyebrow>
            <p className="mt-3.5 text-[14.5px] leading-[1.7] text-white/70">{t.advice.text}</p>
            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              <a href={`tel:${tel}`} className="flex items-center gap-3 text-[15px] font-semibold text-white/85 transition hover:text-[var(--nb-gold)]">
                <Icon name="phone" className="h-[18px] w-[18px] text-[var(--nb-gold)]" strokeWidth={1.9} />
                {LEGAL.phone}
              </a>
              <a href={`mailto:${LEGAL.email}`} className="flex items-center gap-3 text-[15px] text-white/70 transition hover:text-[var(--nb-gold)]">
                <Icon name="mail" className="h-[18px] w-[18px] text-[var(--nb-gold)]" strokeWidth={1.9} />
                {LEGAL.email}
              </a>
            </div>
          </Panel>
        </aside>

        {/* ---------------- CỘT PHẢI: BIỂU MẪU (giữ nguyên) ---------------- */}
        <div className="min-w-0">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <H2 className="!text-[26px] lg:!text-[32px]">{t.h1.join(" ")}</H2>
          <p className="mt-4 max-w-[64ch] text-[15.5px] leading-[1.75] text-white/65">{t.intro}</p>

          <div className="nb-sub-form nb-sub-panel mt-8 p-6 lg:p-9">
            <RequestForm locale={locale} branchen={branchen} berufe={berufe} />
          </div>
        </div>
      </section>
    </SubShell>
  );
}
