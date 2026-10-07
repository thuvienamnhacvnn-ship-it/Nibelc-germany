"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, ExternalLink, Eye, EyeOff, Folder, LoaderCircle, Newspaper, Pencil, Plus, Search, SearchX, Trash2, X } from "lucide-react";
import type { BaiViet, LoaiBai } from "@/lib/quan-tri/bai-viet";
import { NHOM_BAI } from "@/data/articles";
import { viecAnHienBaiViet, viecXoaBaiViet } from "../viec-bai-viet";
import { viecHoanTacXoa } from "../_tam";
import { AnhKho } from "../_chung/AnhKho";
import { Rong } from "../_chung/Rong";
import { useHoi } from "../_chung/HopXacNhan";
import { useThongBao } from "../_chung/ThongBao";
import { DUONG } from "../_chung/duong";
import { boDau, chuLoi } from "../_chung/dinh-dang";

/**
 * DANH SÁCH BÀI VIẾT (cẩm nang + cộng đồng) — chỉ có dạng thẻ: lời giao chỉ
 * đòi chuyển bảng ở Đơn hàng.
 */

type LocDacBiet = "chua-en" | "chua-de";
const CHU_LOC: Record<LocDacBiet, string> = { "chua-en": "Chưa dịch tiếng Anh", "chua-de": "Chưa dịch tiếng Đức" };
const TEN_LOAI: Record<LoaiBai, string> = { "cam-nang": "Cẩm nang", "cong-dong": "Cộng đồng" };

const tenBai = (b: BaiViet) => b.duLieu.tieuDe || b.slug;

export function DanhSachBai({ bai, locDau, anhMacDinh }: { bai: BaiViet[]; locDau?: LocDacBiet; /** id bài → ảnh minh hoạ web đang hiện cho bài chưa có ảnh bìa */ anhMacDinh: Record<string, string> }) {
  const router = useRouter();
  const hoi = useHoi();
  const tb = useThongBao();

  const [tim, setTim] = useState("");
  const [loai, setLoai] = useState<"" | LoaiBai>("");
  const [nhom, setNhom] = useState("");
  /** hai chip bật/tắt độc lập; không bật cái nào = cả hai */
  const [tt, setTt] = useState<{ hien: boolean; an: boolean }>({ hien: false, an: false });
  const [loc, setLoc] = useState<LocDacBiet | "">(locDau ?? "");
  const [ban, setBan] = useState<string | null>(null);

  const dem = (l: LoaiBai) => bai.filter((b) => b.loai === l).length;

  const ds = useMemo(() => {
    const t = boDau(tim.trim());
    return bai.filter((b) => {
      if (loai && b.loai !== loai) return false;
      if (nhom && loai !== "cong-dong" && b.nhom !== nhom) return false;
      if (tt.hien !== tt.an && b.hien !== tt.hien) return false;
      if (loc === "chua-en" && b.coEn) return false;
      if (loc === "chua-de" && b.coDe) return false;
      return !t || boDau(b.duLieu.tieuDe).includes(t) || boDau(b.duLieu.tomTat).includes(t) || boDau(b.slug).includes(t);
    });
  }, [bai, tim, loai, nhom, tt, loc]);

  const coLoc = !!(tim.trim() || loai || nhom || tt.hien || tt.an || loc);
  function xoaLoc() {
    setTim("");
    setLoai("");
    setNhom("");
    setTt({ hien: false, an: false });
    setLoc("");
    if (locDau) router.replace(DUONG.baiViet);
  }

  async function anHien(b: BaiViet) {
    if (ban) return;
    setBan(b.id);
    try {
      const r = await viecAnHienBaiViet(b.id, !b.hien);
      if (r.loi) throw new Error(r.loi);
      tb.xong(b.hien ? `Đã ẩn bài "${tenBai(b)}".` : `Đã cho hiện bài "${tenBai(b)}".`);
      router.refresh();
    } catch (e) {
      tb.loi(`Không làm được: ${chuLoi(e).replace(/\.$/, "")}. Thử lại.`);
    }
    setBan(null);
  }

  function xoa(b: BaiViet) {
    const ten = tenBai(b);
    hoi({
      tieuDe: `Xoá bài "${ten}"?`,
      anh: b.duLieu.anhBia || anhMacDinh[b.id] || "",
      moTa: <p>Bài sẽ biến mất khỏi web ngay. Vẫn khôi phục được ở mục Nhật ký.</p>,
      nutXacNhan: "Xoá bài viết",
      dangChay: "Đang xoá…",
      onXacNhan: async () => {
        const r = await viecXoaBaiViet(b.id);
        if (r.loi) return r.loi;
        router.refresh();
        tb.xong(`Đã xoá bài "${ten}".`, {
          hoanTac: () => {
            void viecHoanTacXoa("bai_viet", b.id)
              .then((k) => {
                if (k.loi) return tb.loi(`Không khôi phục được: ${k.loi}`);
                tb.xong(`Đã khôi phục bài "${ten}".`);
                router.refresh();
              })
              .catch((e) => tb.loi(`Không khôi phục được: ${chuLoi(e)}`));
          },
        });
      },
    });
  }

  if (bai.length === 0) {
    return (
      <Rong icon={Newspaper} tieuDe="Chưa có bài viết nào" moTa="Viết bài đầu tiên cho mục Cẩm nang hoặc Cộng đồng.">
        <Link href={DUONG.baiMoi} className="qt-nut qt-chinh">
          <Plus aria-hidden />
          Thêm bài viết
        </Link>
      </Rong>
    );
  }

  return (
    <>
      <div className="qt-cong-cu">
        <div className="qt-tim">
          <Search aria-hidden />
          <input type="search" value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tiêu đề, tóm tắt…" aria-label="Tìm bài viết" />
          {tim && (
            <button type="button" aria-label="Xoá chữ đang tìm" onClick={() => setTim("")}>
              <X aria-hidden />
            </button>
          )}
        </div>
        <div className="qt-chip-nhom" role="group" aria-label="Lọc theo loại bài">
          {(
            [
              ["", `Tất cả (${bai.length})`],
              ["cam-nang", `Cẩm nang (${dem("cam-nang")})`],
              ["cong-dong", `Cộng đồng (${dem("cong-dong")})`],
            ] as const
          ).map(([k, chu]) => (
            <button key={k} type="button" className="qt-chip" aria-pressed={loai === k} onClick={() => setLoai(k)}>
              {chu}
            </button>
          ))}
        </div>
        {/* bài cộng đồng không có nhóm → khoá ô này khi đang lọc riêng cộng đồng */}
        <select className="qt-vua" value={loai === "cong-dong" ? "" : nhom} disabled={loai === "cong-dong"} onChange={(e) => setNhom(e.target.value)} aria-label="Lọc theo nhóm">
          <option value="">Mọi nhóm</option>
          {NHOM_BAI.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <div className="qt-chip-nhom" role="group" aria-label="Lọc theo trạng thái">
          <button type="button" className="qt-chip" aria-pressed={tt.hien} onClick={() => setTt((x) => ({ ...x, hien: !x.hien }))}>
            Đang hiện
          </button>
          <button type="button" className="qt-chip" aria-pressed={tt.an} onClick={() => setTt((x) => ({ ...x, an: !x.an }))}>
            Đang ẩn
          </button>
          {loc && (
            <button type="button" className="qt-chip qt-cam" aria-label={`Gỡ bộ lọc: ${CHU_LOC[loc]}`} onClick={() => setLoc("")}>
              {CHU_LOC[loc]}
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className="qt-ket-qua" aria-live="polite">
        <span>
          Đang hiện {ds.length} trên {bai.length} bài
        </span>
        {coLoc && (
          <button type="button" className="qt-lien-ket" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        )}
      </div>

      {ds.length === 0 ? (
        <Rong
          icon={SearchX}
          tieuDe="Không có bài nào khớp"
          moTa={tim.trim() ? `Không tìm thấy bài nào cho "${tim.trim()}".` : "Không có bài nào khớp bộ lọc đang chọn."}
        >
          <button type="button" onClick={xoaLoc}>
            Xoá bộ lọc
          </button>
        </Rong>
      ) : (
        <div className="qt-luoi-the">
          {ds.map((b) => {
            const dangBan = ban === b.id;
            const nhanHien = b.hien ? "Ẩn khỏi web" : "Cho hiện lên web";
            // Web chưa có trang cho bài cộng đồng, và bài đang ẩn thì chưa mở được
            const xemDuoc = b.hien && b.loai === "cam-nang";
            const nhanXem = xemDuoc ? "Xem trên web" : b.loai === "cong-dong" ? "Web chưa có trang cho bài cộng đồng" : "Bài đang ẩn nên chưa xem được trên web";
            return (
              <article key={b.id} className={`qt-the${b.hien ? "" : " qt-dang-an"}`} aria-busy={dangBan}>
                <Link href={DUONG.bai(b.id)} aria-label={`Sửa bài ${tenBai(b)}`} tabIndex={-1}>
                  <AnhKho src={b.duLieu.anhBia || anhMacDinh[b.id]} className="qt-the-anh" chuTrong="Chưa có ảnh bìa" />
                </Link>
                <div className="qt-the-than">
                  <div className="qt-the-nhan">
                    <span className={`qt-nhan ${b.loai === "cam-nang" ? "xanh" : "xam"}`}>{TEN_LOAI[b.loai]}</span>
                    <span className={`qt-nhan ${b.hien ? "hien" : "an"}`}>{b.hien ? "Đang hiện" : "Đang ẩn"}</span>
                    {!b.duLieu.anhBia && anhMacDinh[b.id] && (
                      <span className="qt-nhan cam" title="Bài chưa có ảnh bìa riêng — web đang dùng ảnh minh hoạ mặc định">
                        Ảnh mặc định
                      </span>
                    )}
                    <span className={`qt-nhan ${b.coEn ? "hien" : "an"}`} title={b.coEn ? "Đã dịch tiếng Anh" : "Chưa dịch tiếng Anh"} aria-label={b.coEn ? "Đã dịch tiếng Anh" : "Chưa dịch tiếng Anh"}>
                      EN
                    </span>
                    <span className={`qt-nhan ${b.coDe ? "hien" : "an"}`} title={b.coDe ? "Đã dịch tiếng Đức" : "Chưa dịch tiếng Đức"} aria-label={b.coDe ? "Đã dịch tiếng Đức" : "Chưa dịch tiếng Đức"}>
                      DE
                    </span>
                  </div>
                  <Link href={DUONG.bai(b.id)} className="qt-the-ten">
                    {tenBai(b)}
                  </Link>
                  <p className="qt-the-tom">{b.duLieu.tomTat}</p>
                  <div className="qt-the-so qt-nhe">
                    {b.loai === "cam-nang" && b.nhom ? (
                      <span>
                        <Folder aria-hidden />
                        {b.nhom}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span>
                      <Clock aria-hidden />
                      {b.duLieu.phut} phút đọc
                    </span>
                  </div>
                </div>
                <div className="qt-the-chan">
                  <Link href={DUONG.bai(b.id)} className="qt-nut qt-chinh qt-nut-nho">
                    <Pencil aria-hidden />
                    Sửa
                  </Link>
                  <button type="button" className="qt-nut-icon" aria-label={nhanHien} title={nhanHien} disabled={dangBan} onClick={() => void anHien(b)}>
                    {dangBan ? <LoaderCircle className="qt-quay" aria-hidden /> : b.hien ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                  </button>
                  {xemDuoc ? (
                    <a className="qt-nut qt-nut-icon" href={`/cam-nang/${b.slug}`} target="_blank" rel="noreferrer" aria-label={nhanXem} title={nhanXem}>
                      <ExternalLink aria-hidden />
                    </a>
                  ) : (
                    <button type="button" className="qt-nut-icon" disabled aria-label={nhanXem} title={nhanXem}>
                      <ExternalLink aria-hidden />
                    </button>
                  )}
                  <button type="button" className="qt-nut-icon qt-do" aria-label="Xoá bài viết" title="Xoá bài viết" disabled={dangBan} onClick={() => xoa(b)}>
                    <Trash2 aria-hidden />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
