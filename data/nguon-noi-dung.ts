import { hoiMot } from "@/lib/db";
import type { Lang } from "@/lib/i18n/config";
import { ghepNoiDung, laKhoaNoiDung, macDinhNoiDung, type GiaTriNoiDung, type KhoaNoiDung } from "@/lib/quan-tri/noi-dung";

/**
 * NỘI DUNG TRANG (banner: ảnh + chữ) CHO WEB CÔNG KHAI — chỉ gọi ở máy chủ.
 *
 *   const b = await layNoiDung("don-hang.banner", lang);
 *   <PageHero anh={b.anh} anhDoc={b.anhDoc} nhan={b.nhan} tieuDe={b.tieuDe} mo={b.mo || undefined} />
 *
 * KHÔNG BAO GIỜ NÉM LỖI, KHÔNG BAO GIỜ TRẢ THIẾU TRƯỜNG:
 *   - chưa ai sửa (không có dòng)     → mặc định (y hệt web trước khi có trang quản trị)
 *   - dòng có nhưng thiếu/hỏng trường → trường đó lấy mặc định
 *   - CSDL không trả lời              → mặc định, ghi console.error
 * Banner là thứ đầu tiên trên mọi trang; để nó phụ thuộc CSDL mà không có
 * dự phòng thì CSDL trục trặc là cả web trắng — đúng sự cố hôm 05–06/10.
 */
export async function layNoiDung<K extends KhoaNoiDung>(khoa: K, lang: Lang): Promise<GiaTriNoiDung<K>> {
  // Chặn ở lúc chạy chứ không chỉ ở kiểu: khoá ngoài danh mục (đặc biệt là
  // he-thong.mat-khau) không bao giờ được đọc qua đường này.
  if (!laKhoaNoiDung(khoa)) throw new Error(`Khoá nội dung không có trong danh mục: ${String(khoa)}`);
  try {
    const r = await hoiMot<{ gia_tri: unknown }>("select gia_tri from noi_dung where khoa = $1", [khoa]);
    return ghepNoiDung(khoa, r?.gia_tri, lang);
  } catch (e) {
    console.error(`[nguon] không đọc được nội dung "${khoa}" — dùng mặc định:`, e instanceof Error ? e.message : e);
    return macDinhNoiDung(khoa, lang);
  }
}
