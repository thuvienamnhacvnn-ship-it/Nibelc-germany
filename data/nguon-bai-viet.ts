import { hoi } from "@/lib/db";
import { anhHopLe } from "@/lib/anh";
import { NHOM_BAI, type Bai, type Khoi, type NhomBai } from "@/data/articles";
import type { Lang } from "@/lib/i18n/config";
import { chuyenMucTheoChu, type ChuyenMuc } from "@/lib/i18n/dict/cam-nang";
import type { BanDichBai, LoaiBai, NoiDungBai } from "@/lib/quan-tri/bai-viet";

/**
 * BÀI VIẾT CHO WEB CÔNG KHAI — đọc bảng `bai_viet`. Chỉ gọi ở máy chủ.
 *
 * Thay cho data/i18n/articles.ts (mảng tĩnh): nhân viên thêm/sửa/ẩn bài trong
 * trang quản trị là /cam-nang đổi theo, không cần build lại.
 *
 * CÙNG QUY TẮC BẢN DỊCH VỚI ĐƠN HÀNG (data/nguon.ts): ở /en và /de, bài chưa
 * dịch TIÊU ĐỀ thì không hiện; đã dịch tiêu đề mà thiếu tóm tắt hay thân bài
 * thì phần thiếu bị bỏ, KHÔNG rơi về tiếng Việt.
 *
 * Khi CSDL lỗi: danh sách trả rỗng (trang vẫn dựng), còn tra một bài theo
 * đường dẫn thì ném — lý do ghi ở đầu data/nguon.ts.
 */

/** Bài đã theo ngôn ngữ trang + đường dẫn + ảnh bìa (nếu có) + mã chuyên mục. */
export type BaiCongKhai = Bai & {
  /** phần đuôi của URL: /cam-nang/<slug> */
  slug: string;
  /** không có thì giao diện dùng ảnh minh hoạ xoay vòng như trước */
  anhBia?: string;
  /** suy từ chữ bản GỐC tiếng Việt nên giống nhau ở mọi ngôn ngữ */
  muc: ChuyenMuc[];
};

type Dong = {
  id: string;
  slug: string;
  du_lieu: Partial<NoiDungBai> | null;
  dich: Partial<Record<"en" | "de", BanDichBai>> | null;
};

const chu = (x: unknown) => (typeof x === "string" ? x : "");

/** Chỉ giữ những khối dựng được: trang bài lấy `tieuDe` làm key và làm mục lục. */
function khoiSach(x: unknown): Khoi[] {
  if (!Array.isArray(x)) return [];
  return x.filter((k): k is Khoi => !!k && typeof k === "object" && typeof (k as Khoi).tieuDe === "string" && (k as Khoi).tieuDe !== "");
}

function docDong(ds: Dong[], lang: Lang): BaiCongKhai[] {
  const ra: BaiCongKhai[] = [];
  for (const d of ds) {
    const g = d.du_lieu ?? {};
    const tieuDeGoc = chu(g.tieuDe);
    if (!tieuDeGoc) continue; // dòng hỏng — bỏ qua còn hơn hiện một thẻ trống
    const nhom = (NHOM_BAI as readonly string[]).includes(chu(g.nhom)) ? (g.nhom as NhomBai) : NHOM_BAI[0];
    const bai: BaiCongKhai = {
      id: d.id,
      slug: d.slug,
      nhom,
      icon: chu(g.icon) || "chat",
      tieuDe: tieuDeGoc,
      tomTat: chu(g.tomTat),
      phut: Number(g.phut) > 0 ? Math.round(Number(g.phut)) : 1,
      khoi: khoiSach(g.khoi),
      muc: chuyenMucTheoChu(`${tieuDeGoc} ${chu(g.tomTat)}`),
    };
    if (anhHopLe(g.anhBia)) bai.anhBia = g.anhBia;

    if (lang !== "vi") {
      const b = d.dich?.[lang];
      if (!b?.tieuDe) continue; // chưa dịch tiêu đề → không hiện ở ngôn ngữ này
      bai.tieuDe = b.tieuDe;
      bai.tomTat = chu(b.tomTat);
      bai.khoi = khoiSach(b.khoi);
    }
    ra.push(bai);
  }
  return ra;
}

/** Bài đang HIỆN của một loại, đã xếp thứ tự, theo ngôn ngữ. CSDL lỗi → rỗng. */
export async function layBaiViet(lang: Lang, loai: LoaiBai = "cam-nang"): Promise<BaiCongKhai[]> {
  try {
    const ds = await hoi<Dong>(
      "select id, slug, du_lieu, dich from bai_viet where hien and loai = $1 order by thu_tu desc, tao_luc desc",
      [loai],
    );
    return docDong(ds, lang);
  } catch (e) {
    console.error("[nguon] đọc danh sách bài viết — CSDL không trả lời, dùng danh sách rỗng:", e instanceof Error ? e.message : e);
    return [];
  }
}

/** Một bài theo đường dẫn. undefined khi bài đã ẩn hoặc chưa dịch. CSDL lỗi thì NÉM. */
export async function layBaiTheoSlug(slug: string, lang: Lang, loai: LoaiBai = "cam-nang"): Promise<BaiCongKhai | undefined> {
  const ds = await hoi<Dong>("select id, slug, du_lieu, dich from bai_viet where slug = $1 and loai = $2 and hien", [slug, loai]);
  return docDong(ds, lang)[0];
}

/**
 * Mọi đường dẫn bài đang hiện — cho generateStaticParams. Nuốt lỗi CSDL như
 * moiSlugDonHang: build trên máy không có CSDL vẫn phải chạy.
 */
export async function moiSlugBaiViet(loai: LoaiBai = "cam-nang"): Promise<string[]> {
  try {
    const ds = await hoi<{ slug: string }>("select slug from bai_viet where hien and loai = $1", [loai]);
    return ds.map((d) => d.slug);
  } catch {
    console.warn("[nguon] chưa đọc được CSDL lúc build — bỏ qua phần dựng sẵn trang bài viết");
    return [];
  }
}
