import Image from "next/image";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { LEGAL } from "@/data/company";

/** Chân trang tối giản — không làm footer khổng lồ (prompt mục 34). */
export function Footer() {
  const tel = LEGAL.phone.replace(/\s/g, "");
  return (
    <footer className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]">
      <div className="nb-wrap grid gap-10 py-14 lg:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <Image src="/assets/brand/nibelc-logo.svg" alt="NIBELC GROUP" width={200} height={44} className="h-9 w-auto" />
          <p className="mt-5 max-w-[42ch] text-[14px] leading-[1.75] text-[var(--nb-text-dim)]">
            Kết nối lao động và học viên Việt Nam với doanh nghiệp tại Đức và châu Âu — từ tuyển chọn, đào tạo tới khi
            ổn định công việc.
          </p>
        </div>

        <nav aria-label="Menu chân trang">
          <p className="nb-eyebrow">Điều hướng</p>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((m) => (
              <li key={m.href}>
                <NavLink
                  href={m.href}
                  className="text-[14px] text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)]"
                >
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="nb-eyebrow">Liên hệ</p>
          <ul className="mt-4 space-y-3 text-[14px] text-[var(--nb-text-dim)]">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
              <span>
                {LEGAL.name}
                <br />
                {LEGAL.street}, {LEGAL.postalCode} {LEGAL.city}
              </span>
            </li>
            <li>
              <a href={`tel:${tel}`} className="flex items-center gap-3 transition hover:text-[var(--nb-gold-soft)]">
                <Phone size={16} className="shrink-0 text-[var(--nb-gold)]" />
                {LEGAL.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${LEGAL.email}`}
                className="flex items-center gap-3 break-all transition hover:text-[var(--nb-gold-soft)]"
              >
                <Mail size={16} className="shrink-0 text-[var(--nb-gold)]" />
                {LEGAL.email}
              </a>
            </li>
          </ul>

          <div className="mt-5 flex gap-2.5">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                title={`${label} — chưa có đường dẫn chính thức`}
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-mute)]"
              >
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="nb-gold-rule opacity-40" aria-hidden="true" />

      <div className="nb-wrap flex flex-wrap items-center gap-x-6 gap-y-2 py-5 text-[12.5px] text-[var(--nb-text-mute)]">
        <span>
          © {new Date().getFullYear()} {LEGAL.name}
        </span>
        <NavLink href="/impressum" className="transition hover:text-[var(--nb-gold-soft)]">
          Impressum
        </NavLink>
        <NavLink href="/datenschutz" className="transition hover:text-[var(--nb-gold-soft)]">
          Datenschutz
        </NavLink>
      </div>
    </footer>
  );
}
