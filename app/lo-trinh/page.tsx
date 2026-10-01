import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";
import { CHANG } from "@/data/journey";

export const metadata: Metadata = {
  title: "Lộ trình từ Việt Nam đến Đức",
  description:
    "Chín chặng từ lúc tư vấn tới khi ổn định tại Đức: hồ sơ, tiếng Đức, phỏng vấn, hợp đồng, visa, xuất cảnh và onboarding.",
};

export default function Page() {
  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/lo-trinh.jpg"
        anhDoc="/assets/banners/mobile/lo-trinh.jpg"
        nhan="Hành trình kiến tạo tương lai"
        tieuDe="Lộ trình từ Việt Nam đến Đức"
        mo="Đồng hành cùng bạn trên từng bước, an toàn, minh bạch và hiệu quả."
        loiTat={[
          { nhan: "Xem đơn hàng", href: "/don-hang" },
          { nhan: "Du học nghề", href: "/du-hoc-nghe" },
          { nhan: "Đăng ký tư vấn", href: "/lien-he" },
        ]}
      />
      <section className="nb-wrap py-10 sm:py-14">
        <JourneyTimeline />
      </section>
    </div>
  );
}
