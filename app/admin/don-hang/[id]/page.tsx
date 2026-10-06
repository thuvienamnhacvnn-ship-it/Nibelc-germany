import { notFound, redirect } from "next/navigation";
import { hoiMot } from "@/lib/db";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { INDUSTRIES } from "@/data/industries";
import { Dinh } from "../../Dinh";
import { FormDonHang, type DonSua } from "../FormDonHang";

export const dynamic = "force-dynamic";

/**
 * SỬA MỘT ĐƠN HÀNG — và cũng là trang THÊM MỚI khi id = "moi".
 *
 * Dùng chung một trang cho cả hai vì form y hệt nhau; tách ra thành hai trang
 * là hai bản form phải sửa song song, kiểu gì cũng có ngày lệch.
 */
export default async function SuaDonHang({ params }: { params: Promise<{ id: string }> }) {
  if (!(await daVao())) redirect("/admin");
  const { id } = await params;

  const moi = id === "moi";
  const don = moi
    ? null
    : await hoiMot<{ id: string; slug: string; du_lieu: Record<string, unknown>; dich: Record<string, unknown> }>(
        "select id, slug, du_lieu, dich from don_hang where id = $1",
        [id],
      );
  if (!moi && !don) notFound();

  const d: DonSua = moi
    ? {
        id: "",
        duLieu: {
          id: "",
          slug: "",
          title: "",
          city: "",
          state: "",
          industryId: INDUSTRIES[0]?.id ?? "",
          salary: { min: 0, max: 0 },
          salaryType: "tháng",
          vacancies: 1,
          employmentType: "Toàn thời gian",
          programType: "Lao động",
          languageLevel: "",
          language: null,
          experience: "",
          image: "",
          thumbnail: "",
          gallery: [],
          positions: [],
          description: "",
          requirements: [],
          benefits: [],
          hours: null,
          featured: false,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        dich: {},
      }
    : { id: don!.id, duLieu: don!.du_lieu, dich: don!.dich };

  return (
    <>
      <Dinh o="don-hang" />
      <div className="qt-khung">
        <h1>{moi ? "Thêm đơn hàng" : "Sửa đơn hàng"}</h1>
        <p className="qt-phu">
          {moi
            ? "Nhập tiếng Việt là đủ. Phần tiếng Đức và tiếng Anh để trống thì bản /de /en tự ẩn mục đó đi, không hiện tiếng Việt lẫn vào."
            : `Mã đơn: ${d.id}`}
        </p>
        <FormDonHang ban={d} moi={moi} nganhNghe={INDUSTRIES.map((n) => ({ id: n.id, ten: n.titleVi }))} />
      </div>
    </>
  );
}
