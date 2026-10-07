import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { daVao } from "@/lib/quan-tri/dang-nhap";
import { lietKeBaiViet } from "@/lib/quan-tri/bai-viet";
import { banDoAnhMacDinhBai } from "@/data/anh-bai-mac-dinh";
import { DauTrang } from "../_chung/DauTrang";
import { DUONG } from "../_chung/duong";
import { DanhSachBai } from "./DanhSachBai";

export const dynamic = "force-dynamic";

export default async function TrangBaiViet({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await daVao())) redirect("/admin");
  const [bai, tham] = await Promise.all([lietKeBaiViet(), searchParams]);
  const loc = Array.isArray(tham.loc) ? tham.loc[0] : tham.loc;
  const dem = (l: string) => bai.filter((b) => b.loai === l).length;

  return (
    <>
      <DauTrang tieuDe="Bài viết" phu={`${bai.length} bài · ${dem("cam-nang")} cẩm nang · ${dem("cong-dong")} cộng đồng · ${bai.filter((b) => b.hien).length} đang hiện`}>
        <Link href={DUONG.baiMoi} className="qt-nut qt-chinh">
          <Plus aria-hidden />
          Thêm bài viết
        </Link>
      </DauTrang>
      <main className="qt-khung">
        <DanhSachBai key={loc ?? ""} bai={bai} anhMacDinh={banDoAnhMacDinhBai(bai)} locDau={loc === "chua-en" || loc === "chua-de" ? loc : undefined} />
      </main>
    </>
  );
}
