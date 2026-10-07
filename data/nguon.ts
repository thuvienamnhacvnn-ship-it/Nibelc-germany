import { hoi } from "@/lib/db";
import { anhHopLe } from "@/lib/anh";
import { ANH_NGANH, type JobFull } from "@/data/jobs";
import type { Lang } from "@/lib/i18n/config";

/**
 * NGUỒN DỮ LIỆU THẬT — đọc từ CSDL, thay cho mấy file .ts tĩnh.
 *
 * CHỈ GỌI ĐƯỢC Ở PHÍA MÁY CHỦ. Trang server đọc rồi truyền xuống client
 * component bằng props; client không bao giờ nói chuyện thẳng với CSDL.
 * Bài viết ở data/nguon-bai-viet.ts, nội dung banner ở data/nguon-noi-dung.ts.
 *
 * ── Quy tắc bản dịch (Sếp chốt 05/10/2026) ───────────────────────────────
 * Nhân viên chỉ bắt buộc nhập tiếng Việt. Ở bản /en và /de:
 *   - Đơn chưa dịch TÊN thì KHÔNG hiện trong danh sách. Thà thiếu một đơn
 *     còn hơn để khách Đức mở ra gặp nguyên một khối tiếng Việt.
 *   - Đơn đã dịch tên nhưng thiếu vài trường lẻ: trường nào thiếu thì bỏ
 *     hẳn trường đó, KHÔNG rơi về tiếng Việt.
 * Riêng thành phố và nước được phép giữ bản gốc khi chưa dịch — "Graz",
 * "Athens" là tên riêng, viết thế nào cũng đọc ra.
 *
 * ── Khi CSDL không trả lời ───────────────────────────────────────────────
 * Hôm 05–06/10/2026 CSDL lỗi và CẢ WEB trả 500, vì khung trang (layout) gọi
 * demKho() không có dự phòng. Nay các hàm trả DANH SÁCH và CON SỐ đều nuốt
 * lỗi: ghi console.error rồi trả rỗng / 0, trang vẫn dựng được (thiếu dữ liệu
 * nhưng còn menu, còn số điện thoại, còn form liên hệ).
 * Riêng hàm tra MỘT bản ghi theo đường dẫn thì vẫn ném: trả "không có" khi
 * thật ra là "không hỏi được" sẽ thành trang 404 giả, và 404 thì máy tìm kiếm
 * gỡ trang khỏi chỉ mục — 500 tạm thời vô hại hơn nhiều.
 */

function baoLoi(viec: string, e: unknown) {
  console.error(`[nguon] ${viec} — CSDL không trả lời, dùng giá trị dự phòng:`, e instanceof Error ? e.message : e);
}

/** Những trường dịch được. Trường khác (giá, số suất, ngày) là số, dịch gì. */
export type BanDichDon = Partial<{
  title: string;
  city: string;
  state: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  /** TÊN vị trí, theo đúng thứ tự `positions` của bản gốc */
  positions: string[];
  languageLevel: string;
}>;

type Dong = {
  du_lieu: JobFull;
  dich: Partial<Record<"en" | "de", BanDichDon>> | null;
  noi_bat: boolean;
};

const ANH_CUOI_CUNG = "/assets/jobs/logistik/01-hero-16x9.jpg";

/**
 * Bảo đảm ba trường ảnh của một đơn LUÔN dùng được.
 *
 * Giá trị giờ do nhân viên nhập (chọn trong kho `/kho/…`, hoặc đường dẫn
 * `/assets/…` cũ). Một chuỗi rỗng hay sai dạng lọt xuống `next/image` là nó
 * ném lỗi lúc dựng và cả trang 500. Nên: ảnh hỏng thì lùi về ảnh đầu thư
 * viện, rồi ảnh chung của nhóm ngành; phần tử hỏng trong thư viện thì bỏ.
 * Đơn đang có ảnh hợp lệ thì hàm này không đổi gì cả.
 */
export function chuanAnhDon(j: JobFull): JobFull {
  const gallery = Array.isArray(j.gallery) ? j.gallery.filter(anhHopLe) : [];
  const image = anhHopLe(j.image) ? j.image : (gallery[0] ?? ANH_NGANH[j.industryId] ?? ANH_CUOI_CUNG);
  const thumbnail = anhHopLe(j.thumbnail) ? j.thumbnail : image;
  return { ...j, image, thumbnail, gallery };
}

/** Dọn một dòng CSDL thành đơn tiếng Việt dùng được ngay. */
function goc(d: Dong): JobFull {
  // Cột `noi_bat` là nguồn chính (trang quản trị bật/tắt ở đó); `featured`
  // trong du_lieu chỉ là bản chép, lệch thì tin cột.
  return {
    ...chuanAnhDon(d.du_lieu),
    featured: !!d.noi_bat,
    positions: Array.isArray(d.du_lieu.positions) ? d.du_lieu.positions : [],
    requirements: Array.isArray(d.du_lieu.requirements) ? d.du_lieu.requirements : [],
    benefits: Array.isArray(d.du_lieu.benefits) ? d.du_lieu.benefits : [],
  };
}

function ghep(j: JobFull, b: BanDichDon): JobFull {
  return {
    ...j,
    title: b.title ?? j.title,
    // tên riêng: giữ bản gốc khi chưa dịch
    city: b.city ?? j.city,
    state: b.state ?? j.state,
    // văn bản: thiếu thì BỎ HẲN, không rơi về tiếng Việt
    experience: b.experience ?? "",
    description: b.description ?? "",
    requirements: b.requirements ?? [],
    benefits: b.benefits ?? [],
    languageLevel: b.languageLevel ?? j.languageLevel,
    positions: j.positions.map((p, i) => ({ ...p, name: b.positions?.[i] ?? p.name })),
  };
}

function docDong(ds: Dong[], lang: Lang): JobFull[] {
  if (lang === "vi") return ds.map(goc);
  const ra: JobFull[] = [];
  for (const d of ds) {
    const b = d.dich?.[lang];
    if (b?.title) ra.push(ghep(goc(d), b));
  }
  return ra;
}

/** Đơn hàng đang HIỆN, đã xếp thứ tự, theo ngôn ngữ. CSDL lỗi → danh sách rỗng. */
export async function layDonHang(lang: Lang): Promise<JobFull[]> {
  try {
    const ds = await hoi<Dong>(
      "select du_lieu, dich, noi_bat from don_hang where hien order by thu_tu desc, sua_luc desc",
    );
    return docDong(ds, lang);
  } catch (e) {
    baoLoi("đọc danh sách đơn hàng", e);
    return [];
  }
}

/**
 * Một đơn theo đường dẫn. Trả undefined khi đơn đã ẩn hoặc chưa dịch.
 * CSDL lỗi thì NÉM (xem ghi chú đầu file: không trả 404 giả).
 */
export async function layDonTheoSlug(slug: string, lang: Lang): Promise<JobFull | undefined> {
  const ds = await hoi<Dong>("select du_lieu, dich, noi_bat from don_hang where slug = $1 and hien", [slug]);
  return docDong(ds, lang)[0];
}

/**
 * Mọi đường dẫn đơn đang hiện — dùng cho generateStaticParams.
 *
 * KHÔNG để lỗi thoát ra ngoài: lúc build mà chưa có CSDL (máy trạm, hoặc
 * máy chủ dựng lần đầu trước khi nạp dữ liệu) thì cả lệnh build đổ. Trả về
 * danh sách rỗng là trang vẫn dựng được, chỉ không prerender sẵn — mà
 * `dynamicParams = true` nên lúc chạy vẫn mở đúng từng đơn.
 */
export async function moiSlugDonHang(): Promise<string[]> {
  try {
    const ds = await hoi<{ slug: string }>("select slug from don_hang where hien");
    return ds.map((d) => d.slug);
  } catch {
    console.warn("[nguon] chưa đọc được CSDL lúc build — bỏ qua phần dựng sẵn trang đơn hàng");
    return [];
  }
}

/**
 * Mấy con số trên menu và trang Về chúng tôi. Đếm trong CSDL chứ không cộng
 * tay — thêm hay bớt đơn là số tự đúng, không bao giờ lệch.
 *
 * Hàm này được KHUNG TRANG gọi (app/(web)/layout.tsx), tức là mọi trang công
 * khai đều đi qua nó. Tuyệt đối không được ném: CSDL lỗi thì trả 0 hết.
 */
export async function demKho(): Promise<{ don: number; suat: number; bai: number }> {
  try {
    const [r] = await hoi<{ don: string; suat: string; bai: string }>(
      `select
         (select count(*) from don_hang where hien)::text as don,
         (select coalesce(sum(case when du_lieu->>'vacancies' ~ '^[0-9]+$' then (du_lieu->>'vacancies')::int else 0 end), 0)
            from don_hang where hien)::text as suat,
         (select count(*) from bai_viet where hien and loai = 'cam-nang')::text as bai`,
    );
    return { don: Number(r?.don ?? 0), suat: Number(r?.suat ?? 0), bai: Number(r?.bai ?? 0) };
  } catch (e) {
    baoLoi("đếm đơn hàng và bài viết", e);
    return { don: 0, suat: 0, bai: 0 };
  }
}
