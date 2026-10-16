import type { JobFull } from "@/data/jobs";
import type { Lang } from "@/lib/i18n/config";
import { industryById } from "@/data/industries";
import { chuoiLuong } from "@/types/job";
import { home } from "@/lib/i18n/dict/home";
import { donHang } from "@/lib/i18n/dict/don-hang";
import { doHoa } from "@/lib/i18n/dict/do-hoa";
import { DaiDuLieu } from "./DaiDuLieu";

// Máy chủ chuẩn bị dữ liệu và bản dịch; client chỉ mang những dòng đang hiển thị.
export function BangTinDon({ ds, lang }: { ds: JobFull[]; lang: Lang }) {
  return <DaiDuLieu nhan={doHoa[lang].bangTin} ds={ds.map(d => ({
    ma: `${industryById(d.industryId)?.code ?? d.industryId} / ${d.id}`,
    thanhPho: d.city, luong: chuoiLuong(d, lang), suat: home[lang].the.soSuat(d.vacancies),
    mau: d.isSample ? donHang[lang].mau : undefined,
  }))} />;
}
