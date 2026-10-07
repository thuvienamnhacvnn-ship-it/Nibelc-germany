import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GuideHub } from "@/components/guide/GuideHub";
import { CtaCuoiTrang } from "@/components/ui/CtaCuoiTrang";
import { getLang } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/dict";
import { camNang } from "@/lib/i18n/dict/cam-nang";
import { layBaiViet } from "@/data/nguon-bai-viet";
import { layNoiDung } from "@/data/nguon-noi-dung";
import "../trang-sang.css";

export async function generateMetadata(): Promise<Metadata> {
  const tx = t(camNang, await getLang());
  return { title: tx.meta.tieuDe, description: tx.meta.moTa };
}

export default async function Page() {
  const lang = await getLang();
  /* Bài và banner đọc từ CSDL: nhân viên sửa trong trang quản trị là trang này
     đổi theo. Bài truyền xuống đã dịch và đã kèm mã chuyên mục (suy từ bản gốc
     tiếng Việt nên giống nhau ở mọi ngôn ngữ) — GuideHub không tự nạp dữ liệu.
     Cả hai hàm đều có dự phòng: CSDL lỗi thì banner về mặc định, danh sách rỗng. */
  const [bai, b] = await Promise.all([layBaiViet(lang), layNoiDung("cam-nang.banner", lang)]);
  return (
    <div className="nb-duoi-header">
      <PageHero anh={b.anh} anhDoc={b.anhDoc} nhan={b.nhan} tieuDe={b.tieuDe} mo={b.mo || undefined} />

      {/* Thân trang SÁNG ở máy tính (app/trang-sang.css); điện thoại giữ nền cũ. */}
      <div className="nb-sang">
        <GuideHub bai={bai} />
        <CtaCuoiTrang />
      </div>
    </div>
  );
}
