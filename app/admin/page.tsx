import Link from "next/link";
import { hoi } from "@/lib/db";
import { daDatMatKhau, daVao } from "@/lib/quan-tri/dang-nhap";
import { CongVao } from "./CongVao";
import { Dinh } from "./Dinh";
import { BangDonHang } from "./BangDonHang";

/* Trang quản trị đọc thẳng CSDL mỗi lần mở — không được giữ bản dựng sẵn,
   nếu không nhân viên vừa sửa xong, quay lại danh sách vẫn thấy số cũ. */
export const dynamic = "force-dynamic";

type Dong = {
  id: string;
  slug: string;
  nganh: string | null;
  nuoc: string | null;
  hien: boolean;
  thu_tu: number;
  sua_luc: string;
  du_lieu: { title?: string; city?: string; vacancies?: number };
  co_en: boolean;
  co_de: boolean;
};

export default async function TrangQuanTri() {
  if (!(await daVao())) return <CongVao daDat={await daDatMatKhau()} />;

  const don = await hoi<Dong>(
    `select id, slug, nganh, nuoc, hien, thu_tu, sua_luc, du_lieu,
            (dich ? 'en') as co_en, (dich ? 'de') as co_de
       from don_hang
      order by thu_tu desc, sua_luc desc`,
  );
  const [dem] = await hoi<{ bai: string; anh: string }>(
    `select (select count(*) from bai_viet)::text as bai, (select count(*) from anh)::text as anh`,
  );

  return (
    <>
      <Dinh o="don-hang" />
      <div className="qt-khung">
        <h1>Đơn hàng</h1>
        <p className="qt-phu">
          {don.length} đơn · {don.filter((d) => d.hien).length} đang hiện trên web · {dem?.bai ?? 0} bài viết
        </p>

        <div className="qt-tam">
          <div className="qt-hang-nut" style={{ marginBottom: 14 }}>
            <Link href="/admin/don-hang/moi" className="qt-nut qt-chinh">
              + Thêm đơn hàng
            </Link>
          </div>
          <BangDonHang don={don} />
        </div>
      </div>
    </>
  );
}
