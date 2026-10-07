import { redirect } from "next/navigation";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { demAnh, lietKeAnh } from "@/lib/quan-tri/kho-anh";
import { lietKeDonHang } from "@/lib/quan-tri/don-hang";
import { lietKeBaiViet } from "@/lib/quan-tri/bai-viet";
import { lietKeNoiDung } from "@/lib/quan-tri/noi-dung-csdl";
import { DUONG } from "../_chung/duong";
import { ThuVienAnh, type BanDoDung, type NoiDung } from "./ThuVienAnh";

export const dynamic = "force-dynamic";

/**
 * Ảnh nào đang dùng ở đâu — dựng MỘT LẦN ở máy chủ từ đơn hàng, bài viết và
 * banner, thay vì hỏi máy chủ riêng cho từng ô ảnh: lưới 60 ô mà mỗi ô một
 * câu hỏi thì trang mở chậm thấy rõ. Khoá của bản đồ là đường dẫn ảnh.
 */
async function banDoDung(): Promise<BanDoDung> {
  const [don, bai, noiDung] = await Promise.all([lietKeDonHang(), lietKeBaiViet(), lietKeNoiDung()]);
  const m: BanDoDung = {};
  const them = (url: unknown, n: NoiDung) => {
    if (typeof url !== "string" || !url) return;
    const ds = (m[url] ??= []);
    if (!ds.some((x) => x.chu === n.chu)) ds.push(n);
  };
  for (const d of don) {
    const ten = d.duLieu.title || d.slug;
    const duong = DUONG.don(d.id);
    them(d.duLieu.image, { loai: "don", chu: `Đơn hàng: ${ten} — ảnh bìa`, duong });
    them(d.duLieu.thumbnail, { loai: "don", chu: `Đơn hàng: ${ten} — ảnh bìa`, duong });
    for (const u of Array.isArray(d.duLieu.gallery) ? d.duLieu.gallery : []) them(u, { loai: "don", chu: `Đơn hàng: ${ten} — thư viện ảnh`, duong });
  }
  for (const b of bai) them(b.duLieu.anhBia, { loai: "bai", chu: `Bài viết: ${b.duLieu.tieuDe || b.slug} — ảnh bìa`, duong: DUONG.bai(b.id) });
  for (const n of noiDung) {
    them(n.hienTai.vi.anh, { loai: "banner", chu: `Banner: ${n.muc.tenTrang} — bản máy tính`, duong: DUONG.noiDung });
    them(n.hienTai.vi.anhDoc, { loai: "banner", chu: `Banner: ${n.muc.tenTrang} — bản điện thoại`, duong: DUONG.noiDung });
  }
  return m;
}

export default async function TrangThuVienAnh() {
  if (!(await daVao())) redirect("/admin");
  // 200 = trần mỗi trang của máy chủ: nạp một lần để tìm và lọc tại chỗ, ảnh thì vẫn tải lười từng tấm
  const [trang, dem, dungO] = await Promise.all([lietKeAnh({ moiTrang: 200 }), demAnh(), banDoDung()]);
  return <ThuVienAnh dsDau={trang.ds} tongDau={trang.tong} nangDau={dem.dungLuong} dungO={dungO} />;
}
