import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { layDonHangDeSua } from "@/lib/quan-tri/don-hang";
import { INDUSTRIES } from "@/data/industries";
import { ANH_NGANH } from "@/data/jobs";
import { tenNganh } from "@/data/i18n/industries";
import { DauTrang } from "../../_chung/DauTrang";
import { DUONG } from "../../_chung/duong";
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
  const { id: idTho } = await params;
  const id = decodeURIComponent(idTho);

  const moi = id === "moi";
  const don = moi ? null : await layDonHangDeSua(id);
  if (!moi && !don) notFound();

  const d: DonSua = don
    ? { id: don.id, duLieu: don.duLieu as unknown as Record<string, unknown>, dich: don.dich, hien: don.hien, noiBat: don.noiBat }
    : {
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
        hien: true,
        noiBat: false,
      };

  const chuAn = "Đơn đang ẩn nên chưa xem được trên web";

  return (
    <>
      <DauTrang
        tieuDe={moi ? "Thêm đơn hàng" : "Sửa đơn hàng"}
        loiVe={{ nhan: "Đơn hàng", duong: DUONG.donHang }}
        phu={
          moi
            ? "Nhập tiếng Việt là đủ. Phần tiếng Anh và tiếng Đức để trống thì bản /en /de tự ẩn mục đó, không hiện tiếng Việt lẫn vào."
            : `Mã đơn: ${d.id}`
        }
      >
        {don &&
          (don.hien ? (
            <a href={`/don-hang/${don.slug}`} target="_blank" rel="noreferrer" className="qt-nut">
              <ExternalLink aria-hidden />
              Xem trên web
            </a>
          ) : (
            <button type="button" disabled title={chuAn} aria-label={`Xem trên web — ${chuAn}`}>
              <ExternalLink aria-hidden />
              Xem trên web
            </button>
          ))}
      </DauTrang>
      <main className="qt-khung">
        <FormDonHang
          // thêm mới xong chuyển sang /admin/don-hang/<id>: dựng lại form từ bản vừa lưu trong CSDL
          key={d.id || "moi"}
          ban={d}
          moi={moi}
          nganhNghe={INDUSTRIES.map((n) => ({ id: n.id, ten: n.titleVi, tenEn: tenNganh(n, "en"), tenDe: tenNganh(n, "de"), anh: ANH_NGANH[n.id] ?? "" }))}
        />
      </main>
    </>
  );
}
