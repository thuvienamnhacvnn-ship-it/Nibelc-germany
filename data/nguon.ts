import { hoi } from "@/lib/db";
import type { JobFull } from "@/data/jobs";
import type { Lang } from "@/lib/i18n/config";

/**
 * NGUỒN DỮ LIỆU THẬT — đọc từ CSDL, thay cho mấy file .ts tĩnh.
 *
 * CHỈ GỌI ĐƯỢC Ở PHÍA MÁY CHỦ. Trang server đọc rồi truyền xuống client
 * component bằng props; client không bao giờ nói chuyện thẳng với CSDL.
 *
 * ── Quy tắc bản dịch (Sếp chốt 05/10/2026) ───────────────────────────────
 * Nhân viên chỉ bắt buộc nhập tiếng Việt. Ở bản /en và /de:
 *   - Đơn chưa dịch TÊN thì KHÔNG hiện trong danh sách. Thà thiếu một đơn
 *     còn hơn để khách Đức mở ra gặp nguyên một khối tiếng Việt.
 *   - Đơn đã dịch tên nhưng thiếu vài trường lẻ: trường nào thiếu thì bỏ
 *     hẳn trường đó, KHÔNG rơi về tiếng Việt.
 * Riêng thành phố và nước được phép giữ bản gốc khi chưa dịch — "Graz",
 * "Athens" là tên riêng, viết thế nào cũng đọc ra.
 */

/** Những trường dịch được. Trường khác (giá, số suất, ngày) là số, dịch gì. */
type BanDich = Partial<{
  title: string;
  city: string;
  state: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  positions: string[];
  languageLevel: string;
}>;

type Dong = {
  du_lieu: JobFull;
  dich: Partial<Record<"en" | "de", BanDich>>;
};

function ghep(j: JobFull, b: BanDich): JobFull {
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
  if (lang === "vi") return ds.map((d) => d.du_lieu);
  const ra: JobFull[] = [];
  for (const d of ds) {
    const b = d.dich?.[lang];
    if (b?.title) ra.push(ghep(d.du_lieu, b));
  }
  return ra;
}

/** Đơn hàng đang HIỆN, đã xếp thứ tự, theo ngôn ngữ. */
export async function layDonHang(lang: Lang): Promise<JobFull[]> {
  const ds = await hoi<Dong>(
    "select du_lieu, dich from don_hang where hien order by thu_tu desc, sua_luc desc",
  );
  return docDong(ds, lang);
}

/** Một đơn theo đường dẫn. Trả undefined khi đơn đã ẩn hoặc chưa dịch. */
export async function layDonTheoSlug(slug: string, lang: Lang): Promise<JobFull | undefined> {
  const ds = await hoi<Dong>("select du_lieu, dich from don_hang where slug = $1 and hien", [slug]);
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
 */
export async function demKho(): Promise<{ don: number; suat: number; bai: number }> {
  const [r] = await hoi<{ don: string; suat: string; bai: string }>(
    `select
       (select count(*) from don_hang where hien)::text as don,
       (select coalesce(sum((du_lieu->>'vacancies')::int), 0) from don_hang where hien)::text as suat,
       (select count(*) from bai_viet where hien)::text as bai`,
  );
  return { don: Number(r?.don ?? 0), suat: Number(r?.suat ?? 0), bai: Number(r?.bai ?? 0) };
}
