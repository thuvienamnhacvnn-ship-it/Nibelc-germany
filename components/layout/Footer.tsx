import Image from "next/image";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { INDUSTRIES } from "@/data/industries";
import { LEGAL } from "@/data/company";

/**
 * CHÂN TRANG
 *
 * Bốn cột thông tin trên một lưới duy nhất, rồi tới dải bản đồ, rồi hàng pháp
 * lý — đọc từ trên xuống là ra đủ: công ty làm gì, đi đâu trong web, có những
 * nhóm ngành nào, liên hệ ở đâu và văn phòng nằm chỗ nào.
 *
 * Bản đồ nhúng từ OpenStreetMap chứ không phải Google Maps: không cần khoá
 * API, và không đẩy dữ liệu người xem sang bên thứ ba khi họ chưa đồng ý —
 * đúng thứ Datenschutz ở Đức soi.
 *
 * LUẬT: chỉ ghi những gì có trong `data/company.ts`. Giờ làm việc, số giấy
 * phép, số nhân sự... chưa có dữ liệu thì KHÔNG bịa ra cho đẹp.
 */

/** Toạ độ Potsdamer Platz, Berlin — khung bản đồ ôm quanh địa chỉ công ty */
const KHUNG_BAN_DO = "13.3696,52.5075,13.3816,52.5135";

export function Footer() {
  const tel = LEGAL.phone.replace(/\s/g, "");
  const diaChi = `${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}`;
  const nganhChinh = INDUSTRIES.slice(0, 6);

  return (
    <footer className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-800)]">
      <div className="nb-wrap grid gap-x-10 gap-y-9 py-9 md:grid-cols-2 lg:py-14 xl:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        {/* ---------- 1. Thương hiệu ---------- */}
        <div>
          <Image
            src="/assets/brand/nibelc-logo.svg"
            alt="NIBELC GROUP"
            width={200}
            height={44}
            className="h-9 w-auto"
          />
          <p className="mt-4 max-w-[42ch] text-[13.5px] leading-[1.7] text-[var(--nb-text-dim)]">
            Kết nối lao động và học viên Việt Nam với doanh nghiệp tại Đức và châu Âu — từ tuyển chọn, đào tạo tới khi
            ổn định công việc.
          </p>

          <div className="mt-6 flex gap-2.5">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                title={`${label} — chưa có đường dẫn chính thức`}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--nb-line-soft)] text-[var(--nb-text-mute)]"
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
        </div>

        {/* ---------- 2. Điều hướng ---------- */}
        <nav aria-label="Menu chân trang" className="hidden md:block">
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

        {/* ---------- 3. Nhóm ngành ---------- */}
        <nav aria-label="Nhóm ngành nghề" className="hidden md:block">
          <p className="nb-eyebrow">Nhóm ngành</p>
          <ul className="mt-4 space-y-2.5">
            {nganhChinh.map((n) => (
              <li key={n.id}>
                <NavLink
                  href={`/don-hang?nganh=${n.id}`}
                  className="text-[14px] text-[var(--nb-text-dim)] transition hover:text-[var(--nb-gold-soft)]"
                >
                  {n.titleVi}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                href="/don-hang"
                className="text-[14px] font-semibold text-[var(--nb-gold-soft)] transition hover:text-[var(--nb-gold-strong)]"
              >
                Xem tất cả ngành →
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ---------- 4. Liên hệ ---------- */}
        <div>
          <p className="nb-eyebrow">Liên hệ</p>
          <ul className="mt-4 space-y-3.5 text-[14px] text-[var(--nb-text-dim)]">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
              <span>
                <b className="block font-semibold text-white">{LEGAL.name}</b>
                {diaChi}
                <br />
                {LEGAL.country}
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

          <NavLink href="/lien-he" className="nb-btn mt-6 h-11 w-full px-5 text-[14px]">
            Đăng ký tư vấn
          </NavLink>
        </div>
      </div>

      {/* ---------- BẢN ĐỒ VĂN PHÒNG ---------- */}
      <div className="nb-wrap pb-9 lg:pb-14">
        <div className="nb-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="flex items-center gap-2.5 text-[14px] text-[var(--nb-text-dim)]">
              <MapPin size={16} className="shrink-0 text-[var(--nb-gold)]" />
              <span>
                <b className="font-semibold text-white">Văn phòng Berlin</b> — {diaChi}
              </span>
            </p>
            <a
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${diaChi}, ${LEGAL.country}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nb-btn-ghost h-10 px-4 text-[13.5px]"
            >
              Chỉ đường
            </a>
          </div>
          <iframe
            title={`Bản đồ văn phòng ${LEGAL.city}`}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${KHUNG_BAN_DO}&layer=mapnik`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="block h-[190px] w-full border-0 grayscale-[.25] lg:h-[280px]"
          />
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
