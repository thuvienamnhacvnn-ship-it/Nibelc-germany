import Image from "next/image";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { NavLink } from "@/components/layout/NavLink";
import { NAV } from "@/data/nav";
import { INDUSTRIES } from "@/data/industries";
import { KHUNG_BAN_DO, LEGAL } from "@/data/company";

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

/* Khung bản đồ lấy từ data/company.ts — xem ghi chú TOA_DO ở đó. */

export function Footer() {
  const tel = LEGAL.phone.replace(/\s/g, "");
  const diaChi = `${LEGAL.street}, ${LEGAL.postalCode} ${LEGAL.city}`;
  const nganhChinh = INDUSTRIES.slice(0, 6);

  return (
    /* Nền chân trang ở điện thoại lấy ĐÚNG nền trang: dải chừa chỗ cho menu
       đáy phía dưới mang màu nền trang, để chân trang sáng hơn một bậc thì
       mép dưới thành một bậc thang thừa. Desktop giữ bậc #123d78 như cũ. */
    <footer className="border-t border-[var(--nb-line-soft)] bg-[var(--nb-navy-900)] lg:bg-[var(--nb-navy-800)]">
      <div className="nb-wrap grid gap-x-10 gap-y-5 py-6 md:grid-cols-2 lg:gap-y-9 lg:py-14 xl:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
        {/* ---------- 1. Thương hiệu ---------- */}
        <div>
          {/* Chữ "NIBELC" trong logo là xanh dương #004ca0. Trên nền xanh mới
              của bản điện thoại nó chỉ tương phản 1,29:1 — nhìn chìm hẳn.
              Đặt logo trên một tấm nền sáng ở khổ điện thoại; desktop nền
              khác nên giữ nguyên, không lồng tấm nền. */}
          <span className="inline-block rounded-xl bg-[#eef3fa] px-3 py-2 lg:bg-transparent lg:p-0">
            <Image
              src="/assets/brand/nibelc-logo.svg"
              alt="NIBELC GROUP"
              width={200}
              height={44}
              className="h-10 w-auto lg:h-9"
            />
          </span>

          {/* Đoạn giới thiệu và hai biểu tượng mạng xã hội CHỈ có từ md trở
              lên: ở điện thoại chân trang đã dài hơn một màn hình, mà hai khối
              này không dẫn đi đâu (mạng xã hội chưa có đường dẫn chính thức). */}
          <p className="mt-4 hidden max-w-[42ch] text-[13.5px] leading-[1.7] text-[var(--nb-text-dim)] md:block">
            Kết nối lao động và học viên Việt Nam với doanh nghiệp tại Đức và châu Âu — từ tuyển chọn, đào tạo tới khi
            ổn định công việc.
          </p>

          <div className="mt-6 hidden gap-2.5 md:flex">
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
          {/* Ở điện thoại ba biểu tượng ghim/điện thoại/thư đã nói rõ đây là
              phần liên hệ; bỏ nhãn đi lấy lại 31px trên MỌI trang. */}
          <p className="nb-eyebrow hidden lg:block">Liên hệ</p>
          {/* space-y nhỏ ở điện thoại vì mỗi dòng đã tự cao 44px rồi, cộng
              thêm 14px giãn nữa là chân trang dài vô ích. */}
          <ul className="mt-3 space-y-1 text-[14px] text-[var(--nb-text-dim)] lg:mt-4 lg:space-y-3.5">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--nb-gold)]" />
              <span>
                <b className="block font-semibold text-white">{LEGAL.name}</b>
                {/* Sếp chốt 02/10: địa chỉ MỘT dòng, có tên nước sau thành phố */}
                {diaChi}, {LEGAL.country}
              </span>
            </li>
            {/* Hai dòng này là số điện thoại và email thật — bấm nhầm là gọi
                nhầm. Dòng chữ chỉ cao 22px nên nới sàn 44px ở điện thoại. */}
            <li>
              <a
                href={`tel:${tel}`}
                className="flex min-h-[44px] items-center gap-3 transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
              >
                <Phone size={16} className="shrink-0 text-[var(--nb-gold)]" />
                {LEGAL.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${LEGAL.email}`}
                className="flex min-h-[44px] items-center gap-3 break-all transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
              >
                <Mail size={16} className="shrink-0 text-[var(--nb-gold)]" />
                {LEGAL.email}
              </a>
            </li>
          </ul>

          <NavLink href="/lien-he" className="nb-btn mt-4 h-11 w-full px-5 text-[14px] lg:mt-6">
            Đăng ký tư vấn
          </NavLink>
        </div>
      </div>

      {/* ---------- BẢN ĐỒ VĂN PHÒNG ---------- */}
      {/* Chỉ từ lg. Ở điện thoại khối này chiếm gần 300px (thẻ "Trụ sở"
          lặp lại đúng địa chỉ vừa ghi ngay phía trên + bản đồ nhúng
          190px), mà trang /lien-he đã có sẵn một bản đồ y hệt — chân trang
          lặp trên MỌI trang nên tốn gấp bảy lần chỗ cho cùng một thông tin. */}
      <div className="nb-wrap hidden pb-9 lg:block lg:pb-14">
        <div className="nb-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="flex items-center gap-2.5 text-[14px] text-[var(--nb-text-dim)]">
              <MapPin size={16} className="shrink-0 text-[var(--nb-gold)]" />
              <span>
                <b className="font-semibold text-white">Trụ sở</b> — {diaChi}
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

      {/* Impressum và Datenschutz là trang pháp lý bắt buộc ở Đức, lại nằm
          cạnh nhau — chỉ cao 20px thì ngón tay bấm sang cái bên cạnh. Nới sàn
          44px ở điện thoại, desktop giữ hàng mảnh. */}
      <div className="nb-wrap flex flex-wrap items-center gap-x-6 py-1 text-[12.5px] text-[var(--nb-text-mute)] lg:gap-y-2 lg:py-5">
        {/* Dòng bản quyền KHÔNG phải link nên không cần sàn 44px; để nó cao
            44px thì nó tự chiếm trọn một hàng và đẩy chân trang dài thêm. */}
        <span className="order-last w-full lg:order-none lg:w-auto">
          © {new Date().getFullYear()} {LEGAL.name}
        </span>
        <NavLink
          href="/impressum"
          className="flex min-h-[44px] items-center transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
        >
          Impressum
        </NavLink>
        <NavLink
          href="/datenschutz"
          className="flex min-h-[44px] items-center transition hover:text-[var(--nb-gold-soft)] lg:min-h-0"
        >
          Datenschutz
        </NavLink>
      </div>
    </footer>
  );
}
