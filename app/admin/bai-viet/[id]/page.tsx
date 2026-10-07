import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { layBaiVietDeSua, lietKeBaiViet } from "@/lib/quan-tri/bai-viet";
import { banDoAnhMacDinhBai } from "@/data/anh-bai-mac-dinh";
import { NHOM_BAI } from "@/data/articles";
import { DauTrang } from "../../_chung/DauTrang";
import { DUONG } from "../../_chung/duong";
import { FormBaiViet, type BaiSua } from "../FormBaiViet";

export const dynamic = "force-dynamic";

/** SỬA MỘT BÀI VIẾT — và là trang THÊM MỚI khi id = "moi" (cùng lý do với form đơn hàng: một form, một nơi sửa). */
export default async function SuaBaiViet({ params }: { params: Promise<{ id: string }> }) {
  if (!(await daVao())) redirect("/admin");
  const { id: idTho } = await params;
  const id = decodeURIComponent(idTho);

  const moi = id === "moi";
  const bai = moi ? null : await layBaiVietDeSua(id);
  if (!moi && !bai) notFound();
  // ảnh minh hoạ web đang hiện cho bài này khi chưa có ảnh bìa riêng (tính theo vị trí bài trong danh sách)
  const anhMacDinh = bai && !bai.duLieu.anhBia ? banDoAnhMacDinhBai(await lietKeBaiViet())[bai.id] : undefined;

  const b: BaiSua = bai
    ? { id: bai.id, slug: bai.slug, loai: bai.loai, hien: bai.hien, duLieu: bai.duLieu, dich: bai.dich }
    : {
        id: "",
        slug: "",
        loai: "cam-nang",
        hien: true,
        // phut = 0: để trống cho máy chủ tự ước lượng theo độ dài bài
        duLieu: { id: "", nhom: NHOM_BAI[0], icon: "chat", tieuDe: "", tomTat: "", phut: 0, khoi: [] },
        dich: {},
      };

  // Web chưa có trang cho bài cộng đồng; bài đang ẩn thì chưa mở được
  const lyDoTat = bai && bai.loai === "cong-dong" ? "Web chưa có trang cho bài cộng đồng" : "Bài đang ẩn nên chưa xem được trên web";

  return (
    <>
      <DauTrang
        tieuDe={moi ? "Thêm bài viết" : "Sửa bài viết"}
        loiVe={{ nhan: "Bài viết", duong: DUONG.baiViet }}
        phu={moi ? "Nhập tiếng Việt là đủ. Bản /en /de chỉ hiện bài khi đã có tiêu đề dịch." : `Mã bài: ${b.id}`}
      >
        {bai &&
          (bai.hien && bai.loai === "cam-nang" ? (
            <a href={`/cam-nang/${bai.slug}`} target="_blank" rel="noreferrer" className="qt-nut">
              <ExternalLink aria-hidden />
              Xem trên web
            </a>
          ) : (
            <button type="button" disabled title={lyDoTat} aria-label={`Xem trên web — ${lyDoTat}`}>
              <ExternalLink aria-hidden />
              Xem trên web
            </button>
          ))}
      </DauTrang>
      <main className="qt-khung">
        <FormBaiViet key={b.id || "moi"} ban={b} moi={moi} anhMacDinh={anhMacDinh} />
      </main>
    </>
  );
}
