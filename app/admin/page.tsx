import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, ChevronRight, CircleCheck, ClipboardList, ImageOff, Images, Languages, Newspaper, Plus, Upload, Users, type LucideIcon } from "lucide-react";
import { daDatMatKhau, daVao } from "@/lib/quan-tri/dang-nhap";
import { layTongQuan } from "@/lib/quan-tri/tong-quan";
import { lietKeDonHang } from "@/lib/quan-tri/don-hang";
import { anhHopLe } from "@/lib/anh";
import { CongVao } from "./CongVao";
import { DauTrang } from "./_chung/DauTrang";
import { DUONG } from "./_chung/duong";
import { banGhiConLai } from "./_chung/con-lai";
import { dungLuong, soVN } from "./_chung/dinh-dang";
import { NhatKyGon } from "./nhat-ky/DongThoiGian";

/* Trang quản trị đọc thẳng CSDL mỗi lần mở — không được giữ bản dựng sẵn,
   nếu không nhân viên vừa sửa xong, quay lại vẫn thấy số cũ. */
export const dynamic = "force-dynamic";

type TheSo = { nhan: string; so: number; phu: string; chan: string; duong: Route; icon: LucideIcon };
type Viec = { n: number; chu: string; phu: string; duong: Route; icon: LucideIcon };

/**
 * TỔNG QUAN — nhìn một lượt: web đang có gì, còn việc gì tồn, vừa đổi gì.
 * Chưa đăng nhập thì đây là cổng vào (giữ nguyên hành vi cũ của /admin).
 *
 * Chỉ hiện SỐ ĐẾM THẬT từ CSDL. Không phần trăm tăng giảm, không biểu đồ:
 * không có dữ liệu thật cho những thứ đó, mà bịa thì Sếp cấm.
 */
export default async function TrangTongQuan() {
  if (!(await daVao())) return <CongVao daDat={await daDatMatKhau()} />;

  const [tq, don, conLai] = await Promise.all([layTongQuan(), lietKeDonHang(), banGhiConLai()]);
  const baiHien = tq.bai["cam-nang"].hien + tq.bai["cong-dong"].hien;
  const baiAn = tq.bai["cam-nang"].an + tq.bai["cong-dong"].an;

  const the: TheSo[] = [
    {
      nhan: "Đơn hàng đang hiện",
      so: tq.don.hien,
      phu: tq.don.an > 0 ? `${soVN(tq.don.an)} đơn đang ẩn` : "Không có đơn nào đang ẩn",
      chan: "Xem đơn hàng",
      duong: DUONG.donHang,
      icon: ClipboardList,
    },
    {
      nhan: "Số suất đang tuyển",
      so: tq.suat,
      phu: `Tính trên ${soVN(tq.don.hien)} đơn đang hiện`,
      chan: "Xem đơn hàng",
      duong: DUONG.loc(DUONG.donHang, { tt: "hien" }),
      icon: Users,
    },
    {
      nhan: "Bài viết đang hiện",
      so: baiHien,
      phu: `${soVN(tq.bai["cam-nang"].tong)} cẩm nang · ${soVN(tq.bai["cong-dong"].tong)} cộng đồng · ${soVN(baiAn)} đang ẩn`,
      chan: "Xem bài viết",
      duong: DUONG.baiViet,
      icon: Newspaper,
    },
    {
      nhan: "Ảnh trong thư viện",
      so: tq.anh.so,
      phu: `Tổng dung lượng ${dungLuong(tq.anh.dungLuong)}`,
      chan: "Mở thư viện ảnh",
      duong: DUONG.anh,
      icon: Images,
    },
  ];

  // Việc cần làm: chỉ đếm đơn / bài ĐANG HIỆN — đơn đang ẩn mà chưa dịch thì chưa ai thấy, chưa tính là tồn.
  const thieu = (ds: { thieu: string[] }[], l: string) => ds.filter((x) => x.thieu.includes(l)).length;
  const viec: Viec[] = [
    {
      n: don.filter((d) => d.hien && !anhHopLe(d.duLieu.image) && !anhHopLe(d.duLieu.thumbnail)).length,
      chu: "đơn hàng chưa có ảnh bìa",
      phu: "Web đang dùng tạm ảnh chung của ngành.",
      duong: DUONG.loc(DUONG.donHang, { loc: "chua-anh" }),
      icon: ImageOff,
    },
    { n: thieu(tq.chuaDich.don, "en"), chu: "đơn hàng chưa dịch tiếng Anh", phu: "Các đơn này không hiện ở bản /en.", duong: DUONG.loc(DUONG.donHang, { loc: "chua-en" }), icon: Languages },
    { n: thieu(tq.chuaDich.don, "de"), chu: "đơn hàng chưa dịch tiếng Đức", phu: "Các đơn này không hiện ở bản /de.", duong: DUONG.loc(DUONG.donHang, { loc: "chua-de" }), icon: Languages },
    { n: thieu(tq.chuaDich.bai, "en"), chu: "bài viết chưa dịch tiếng Anh", phu: "Các bài này không hiện ở bản /en.", duong: DUONG.loc(DUONG.baiViet, { loc: "chua-en" }), icon: Languages },
    { n: thieu(tq.chuaDich.bai, "de"), chu: "bài viết chưa dịch tiếng Đức", phu: "Các bài này không hiện ở bản /de.", duong: DUONG.loc(DUONG.baiViet, { loc: "chua-de" }), icon: Languages },
  ].filter((v) => v.n > 0);

  return (
    <>
      <DauTrang tieuDe="Tổng quan" phu="Nhìn một lượt: đang có gì trên web và còn việc gì cần làm." />
      <main className="qt-khung">
        <div className="qt-so-luoi">
          {the.map((t) => (
            <Link key={t.nhan} href={t.duong} className="qt-so">
              <span className="qt-so-nhan">
                {t.nhan}
                <span className="qt-so-icon" aria-hidden>
                  <t.icon />
                </span>
              </span>
              <span className="qt-so-gia-tri">{soVN(t.so)}</span>
              <span className="qt-so-phu">{t.phu}</span>
              <span className="qt-so-chan">
                {t.chan}
                <ArrowRight aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <div className="qt-loi-tat qt-cach">
          <Link href={DUONG.donMoi} className="qt-nut qt-chinh">
            <Plus aria-hidden />
            Thêm đơn hàng
          </Link>
          <Link href={DUONG.baiMoi} className="qt-nut">
            <Plus aria-hidden />
            Thêm bài viết
          </Link>
          <Link href={DUONG.anh} className="qt-nut">
            <Upload aria-hidden />
            Tải ảnh lên
          </Link>
        </div>

        <div className="qt-hai-cot qt-cach">
          <section className="qt-tam">
            <h2>Việc cần làm</h2>
            {viec.length === 0 ? (
              <div className="qt-viec-xong">
                <span className="qt-viec-icon qt-luc" aria-hidden>
                  <CircleCheck />
                </span>
                <span>Không còn việc nào tồn. Mọi đơn và bài đang hiện đều đã có ảnh và bản dịch.</span>
              </div>
            ) : (
              <ul className="qt-viec">
                {viec.map((v) => (
                  <li key={v.chu}>
                    <Link href={v.duong}>
                      <span className="qt-viec-icon" aria-hidden>
                        <v.icon />
                      </span>
                      <span>
                        <b>
                          {soVN(v.n)} {v.chu}
                        </b>
                        <small>{v.phu}</small>
                      </span>
                      <ChevronRight aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="qt-tam">
            <div className="qt-tam-dau">
              <h2>Hoạt động gần đây</h2>
              <Link href={DUONG.nhatKy} className="qt-lien-ket">
                Xem tất cả
              </Link>
            </div>
            <NhatKyGon ds={tq.nhatKy.slice(0, 8)} conLai={conLai} nay={new Date().toISOString()} />
          </section>
        </div>
      </main>
    </>
  );
}
