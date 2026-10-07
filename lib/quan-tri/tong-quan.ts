import { hoi, hoiMot } from "@/lib/db";
import { LOAI_BAI, type LoaiBai } from "@/lib/quan-tri/bai-viet";
import { lietKeNhatKy, type MucNhatKy } from "@/lib/quan-tri/nhat-ky";

/**
 * TỔNG QUAN cho trang đầu /admin — nhìn một lượt thấy kho đang có gì và vừa
 * đổi gì. Chỉ chạy ở máy chủ; KHÔNG tự kiểm đăng nhập.
 *
 * Khác các hàm đọc của web công khai, hàm này ĐỂ LỖI CSDL THOÁT RA: nhân viên
 * mở trang quản trị mà thấy toàn số 0 sẽ tưởng kho bị xoá sạch. Thà hiện lỗi.
 */

export type MucChuaDich = {
  id: string;
  slug: string;
  ten: string;
  /** những ngôn ngữ chưa có tên/tiêu đề bản dịch — tức là mục này đang KHÔNG hiện ở đó */
  thieu: ("en" | "de")[];
  /** chỉ có với bài viết */
  loai?: LoaiBai;
};

export type TongQuan = {
  don: { tong: number; hien: number; an: number; noiBat: number };
  /** tổng số suất của các đơn đang hiện */
  suat: number;
  bai: Record<LoaiBai, { tong: number; hien: number; an: number }>;
  /** dungLuong tính bằng byte */
  anh: { so: number; dungLuong: number };
  /** 10 thay đổi gần nhất */
  nhatKy: MucNhatKy[];
  /** đơn / bài đang HIỆN nhưng chưa có bản dịch — khách ở /en, /de không thấy chúng */
  chuaDich: { don: MucChuaDich[]; bai: MucChuaDich[] };
};

type DongThieu = { id: string; slug: string; ten: string; co_en: boolean; co_de: boolean; loai?: LoaiBai };

const raThieu = (d: DongThieu): MucChuaDich => ({
  id: d.id,
  slug: d.slug,
  ten: d.ten,
  thieu: [...(d.co_en ? [] : (["en"] as const)), ...(d.co_de ? [] : (["de"] as const))],
  ...(d.loai ? { loai: d.loai } : {}),
});

export async function layTongQuan(): Promise<TongQuan> {
  const [don, bai, anh, nhatKy, donThieu, baiThieu] = await Promise.all([
    hoiMot<{ tong: string; hien: string; noi_bat: string; suat: string }>(
      `select count(*)::text as tong,
              count(*) filter (where hien)::text as hien,
              count(*) filter (where noi_bat)::text as noi_bat,
              coalesce(sum(case when hien and du_lieu->>'vacancies' ~ '^[0-9]+$' then (du_lieu->>'vacancies')::int else 0 end), 0)::text as suat
         from don_hang`,
    ),
    hoi<{ loai: LoaiBai; tong: string; hien: string }>(
      "select loai, count(*)::text as tong, count(*) filter (where hien)::text as hien from bai_viet group by loai",
    ),
    hoiMot<{ so: string; nang: string }>("select count(*)::text as so, coalesce(sum(dung_luong), 0)::text as nang from anh"),
    lietKeNhatKy(10),
    hoi<DongThieu>(
      `select * from (
         select id, slug, coalesce(du_lieu->>'title', slug) as ten, thu_tu, sua_luc,
                coalesce(dich->'en'->>'title', '') <> '' as co_en,
                coalesce(dich->'de'->>'title', '') <> '' as co_de
           from don_hang where hien) x
        where not (co_en and co_de) order by thu_tu desc, sua_luc desc`,
    ),
    hoi<DongThieu>(
      `select * from (
         select id, slug, loai, coalesce(du_lieu->>'tieuDe', slug) as ten, thu_tu, tao_luc,
                coalesce(dich->'en'->>'tieuDe', '') <> '' as co_en,
                coalesce(dich->'de'->>'tieuDe', '') <> '' as co_de
           from bai_viet where hien) x
        where not (co_en and co_de) order by loai, thu_tu desc, tao_luc desc`,
    ),
  ]);

  const tong = Number(don?.tong ?? 0);
  const hien = Number(don?.hien ?? 0);
  const soBai = {} as TongQuan["bai"];
  for (const l of LOAI_BAI) {
    const d = bai.find((b) => b.loai === l);
    const t = Number(d?.tong ?? 0);
    const h = Number(d?.hien ?? 0);
    soBai[l] = { tong: t, hien: h, an: t - h };
  }
  return {
    don: { tong, hien, an: tong - hien, noiBat: Number(don?.noi_bat ?? 0) },
    suat: Number(don?.suat ?? 0),
    bai: soBai,
    anh: { so: Number(anh?.so ?? 0), dungLuong: Number(anh?.nang ?? 0) },
    nhatKy,
    chuaDich: { don: donThieu.map(raThieu), bai: baiThieu.map(raThieu) },
  };
}
