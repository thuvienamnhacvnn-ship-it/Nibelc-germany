"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert, CircleCheck, ImagePlus, LoaderCircle, Trash2, TriangleAlert, Upload, X } from "lucide-react";
import type { Anh } from "@/lib/quan-tri/kho-anh";
import { AnhKho } from "./AnhKho";
import { HopChonAnh } from "./HopChonAnh";
import { useThongBao } from "./ThongBao";
import { CHAP_NHAN, guiTep, kiemTep } from "./tai-len";
import { dungLuong } from "./dinh-dang";

/** CÁC MẢNH FORM DÙNG CHUNG cho form đơn hàng, bài viết và banner. */

export type Ngon = "vi" | "en" | "de";
const TEN_NGON: Record<Ngon, string> = { vi: "Tiếng Việt", en: "English", de: "Deutsch" };

/**
 * Bộ tab ba ngôn ngữ. Chấm trước English / Deutsch cho biết bản đó đã có
 * tên/tiêu đề chưa — đúng điều kiện để mục hiện ở /en, /de — và có chữ đi kèm
 * trong aria-label, không chỉ dựa vào màu.
 */
export function TabNgon({ ngon, doi, co, chuVi, chuDich }: { ngon: Ngon; doi: (l: Ngon) => void; co: { en: boolean; de: boolean }; chuVi: string; chuDich: string }) {
  return (
    <>
      <div className="qt-tab" role="tablist" aria-label="Ngôn ngữ đang sửa">
        {(["vi", "en", "de"] as Ngon[]).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={ngon === l}
            aria-label={l === "vi" ? undefined : `${TEN_NGON[l]} — ${co[l] ? "đã dịch" : "chưa dịch"}`}
            onClick={() => doi(l)}
          >
            {l !== "vi" && <span className={`qt-tab-cham${co[l] ? " qt-co" : ""}`} aria-hidden />}
            {TEN_NGON[l]}
          </button>
        ))}
      </div>
      <p className="qt-tab-chu">{ngon === "vi" ? chuVi : chuDich}</p>
    </>
  );
}

/**
 * Một ô nhập có nhãn, ghi chú, lời báo lỗi và dòng đối chiếu tiếng Việt.
 * `children` nhận sẵn id + các thuộc tính aria để gắn vào input.
 */
export function O({
  nhan,
  batBuoc,
  ghiChu,
  loi,
  canhBao,
  goc,
  nhanGoc = "Tiếng Việt",
  children,
}: {
  nhan: string;
  batBuoc?: boolean;
  ghiChu?: React.ReactNode;
  loi?: string;
  canhBao?: string;
  /** bản tiếng Việt (hoặc chữ mặc định) để đối chiếu khi đang ở tab en/de */
  goc?: string;
  nhanGoc?: string;
  children: (p: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; "aria-required"?: true }) => React.ReactNode;
}) {
  const id = useId();
  const idMoTa = `${id}-mt`;
  return (
    <div className="qt-o">
      <label htmlFor={id}>
        {nhan}
        {batBuoc && <span className="qt-sao"> *</span>}
      </label>
      {children({
        id,
        "aria-invalid": loi ? true : undefined,
        "aria-describedby": loi || ghiChu || canhBao ? idMoTa : undefined,
        "aria-required": batBuoc ? true : undefined,
      })}
      <div id={idMoTa}>
        {loi && (
          <span className="qt-loi-o">
            <CircleAlert aria-hidden />
            {loi}
          </span>
        )}
        {canhBao && (
          <span className="qt-canh-bao-o">
            <TriangleAlert aria-hidden />
            {canhBao}
          </span>
        )}
        {ghiChu && <span className="qt-ghi-chu">{ghiChu}</span>}
      </div>
      {goc?.trim() && (
        <div className="qt-goc">
          <b>{nhanGoc}: </b>
          {goc}
        </div>
      )}
    </div>
  );
}

/** Công tắc bật/tắt — vùng bấm là CẢ dòng. Giá trị đi cùng nút Lưu, không ghi ngay. */
export function CongTac({ nhan, phu, bat, doi }: { nhan: string; phu: string; bat: boolean; doi: (b: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={bat} className="qt-cong-tac" onClick={() => doi(!bat)}>
      <span>
        <b>{nhan}</b>
        <small>{phu}</small>
      </span>
      <i aria-hidden />
    </button>
  );
}

/**
 * Tấm ẢNH BÌA: xem ảnh đúng khung web sẽ cắt, đổi / gỡ / tải lên tại chỗ.
 * "Gỡ ảnh" chỉ gỡ khỏi bản ghi đang sửa (ảnh vẫn nằm trong thư viện) và chưa
 * ghi gì cho tới khi bấm Lưu — nên không cần hộp xác nhận.
 */
export function TamAnhBia({
  anh,
  doi,
  chuTrong,
  macDinh,
  chuMacDinh,
  tieuDeHop = "Chọn ảnh bìa",
  className = "",
}: {
  anh: string;
  doi: (url: string) => void;
  /** dòng nhỏ dưới "Chưa có ảnh bìa" */
  chuTrong: string;
  /** ảnh web ĐANG hiện khi bản ghi chưa có ảnh bìa riêng (ảnh ngành, ảnh minh hoạ xoay vòng) */
  macDinh?: string;
  /** dòng ghi chú dưới ảnh mặc định */
  chuMacDinh?: string;
  tieuDeHop?: string;
  className?: string;
}) {
  const tb = useThongBao();
  const [moHop, setMoHop] = useState(false);
  const [tin, setTin] = useState<Anh | null>(null);
  const [pt, setPt] = useState<number | null>(null);
  const [keo, setKeo] = useState(false);
  const oTep = useRef<HTMLInputElement>(null);
  const huy = useRef<(() => void) | null>(null);
  useEffect(() => () => huy.current?.(), []);

  function taiLen(f: File | undefined | null) {
    if (!f || pt !== null) return;
    const loi = kiemTep(f);
    if (loi) return tb.loi(loi);
    setPt(0);
    const g = guiTep(f, setPt);
    huy.current = g.huy;
    g.hua
      .then((a) => {
        setTin(a);
        doi(a.url);
        tb.xong("Đã tải ảnh lên và đặt làm ảnh bìa. Bấm Lưu để áp dụng.");
      })
      .catch((e: Error) => {
        if (e.message !== "huy") tb.loi(e.message);
      })
      .finally(() => {
        huy.current = null;
        setPt(null);
      });
  }

  const tha = {
    onDragOver: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      setKeo(true);
    },
    onDragLeave: () => setKeo(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setKeo(false);
      taiLen(e.dataTransfer.files[0]);
    },
  };

  return (
    <div className={`qt-tam ${className}`}>
      <h2>Ảnh bìa</h2>
      {anh ? (
        <>
          <div {...tha}>
            <AnhKho src={anh} alt="Ảnh bìa" className={`qt-anh-bia${keo ? " qt-dang-keo" : ""}`} />
          </div>
          <p className="qt-anh-tin">
            {tin && tin.url === anh ? `${tin.tenGoc}${tin.rong && tin.cao ? ` · ${tin.rong}×${tin.cao}` : ""} · ${dungLuong(tin.dungLuong)}` : anh}
          </p>
        </>
      ) : macDinh ? (
        // Chưa có ảnh riêng nhưng web vẫn đang hiện một tấm: cho nhân viên thấy ĐÚNG tấm đó,
        // kèm lời nói rõ đây là ảnh mặc định — ô trống ở đây dễ bị hiểu là web cũng đang trống.
        <>
          <div {...tha}>
            <AnhKho src={macDinh} alt="Ảnh mặc định web đang dùng" className={`qt-anh-bia${keo ? " qt-dang-keo" : ""}`} />
          </div>
          <p className="qt-anh-tin">
            <span className="qt-nhan an">Ảnh mặc định</span> {chuMacDinh ?? chuTrong}
          </p>
        </>
      ) : (
        <div className={`qt-anh-bia qt-trong${keo ? " qt-dang-keo" : ""}`} {...tha}>
          <ImagePlus aria-hidden />
          <b>{keo ? "Thả ra để tải lên" : "Chưa có ảnh bìa"}</b>
          <span>{chuTrong}</span>
        </div>
      )}
      {pt !== null && (
        <>
          <div className="qt-tien-do" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pt} aria-label="Tiến độ tải ảnh bìa">
            <i style={{ width: `${pt}%` }} />
          </div>
          <p className="qt-anh-tin" aria-live="polite">
            Đang tải lên… {pt}%
          </p>
        </>
      )}
      <div className="qt-hang-nut">
        {anh ? (
          <>
            <button type="button" onClick={() => setMoHop(true)}>
              <ImagePlus aria-hidden />
              Đổi ảnh
            </button>
            <button
              type="button"
              className="qt-nguy"
              onClick={() => {
                doi("");
                tb.tin("Đã gỡ ảnh bìa. Bấm Lưu để áp dụng.");
              }}
            >
              <X aria-hidden />
              Gỡ ảnh
            </button>
          </>
        ) : (
          <>
            <button type="button" className="qt-chinh" onClick={() => setMoHop(true)}>
              Chọn từ thư viện
            </button>
            <button type="button" disabled={pt !== null} onClick={() => oTep.current?.click()}>
              <Upload aria-hidden />
              Tải ảnh lên
            </button>
          </>
        )}
      </div>
      <input
        ref={oTep}
        type="file"
        accept={CHAP_NHAN}
        className="qt-an-nhin"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          taiLen(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <HopChonAnh
        mo={moHop}
        tieuDe={tieuDeHop}
        onDong={() => setMoHop(false)}
        onChon={([a]) => {
          if (!a) return;
          setTin(a);
          doi(a.url);
        }}
      />
    </div>
  );
}

/**
 * THANH LƯU dính đáy: lúc nào cũng thấy còn thay đổi chưa lưu hay không, và
 * nút Lưu luôn trong tầm tay dù form dài mấy màn hình.
 */
export function ThanhLuu({
  doi,
  dangLuu,
  daLuuLuc,
  onLuu,
  onHuy,
  nutXoa,
  onXoa,
  nutLuu = "Lưu",
}: {
  /** đang có thay đổi chưa lưu */
  doi: boolean;
  dangLuu: boolean;
  /** "HH:mm" của lần lưu gần nhất trong phiên này */
  daLuuLuc?: string;
  onLuu: () => void;
  onHuy: () => void;
  /** chữ nút xoá ("Xoá đơn này") — chỉ truyền khi đang sửa bản ghi đã có */
  nutXoa?: string;
  onXoa?: () => void;
  nutLuu?: string;
}) {
  // Ctrl/⌘ + S = Lưu
  const luuRef = useRef(onLuu);
  luuRef.current = onLuu;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        luuRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="qt-thanh-luu">
      <p className={`qt-thanh-luu-tt${doi ? " qt-doi" : daLuuLuc ? " qt-da-luu" : ""}`} aria-live="polite">
        {doi ? (
          "Có thay đổi chưa lưu."
        ) : daLuuLuc ? (
          <>
            <CircleCheck aria-hidden />
            Đã lưu lúc {daLuuLuc}.
          </>
        ) : (
          "Chưa có thay đổi."
        )}
      </p>
      <div className="qt-thanh-luu-nut">
        {nutXoa && onXoa && (
          <button type="button" className="qt-nguy qt-nut-xoa" aria-label={nutXoa} title={nutXoa} disabled={dangLuu} onClick={onXoa}>
            <Trash2 aria-hidden />
            <span className="qt-an-dt">{nutXoa}</span>
          </button>
        )}
        <button type="button" disabled={!doi || dangLuu} onClick={onHuy}>
          Huỷ thay đổi
        </button>
        <button type="button" className="qt-chinh qt-nut-luu" disabled={!doi || dangLuu} aria-busy={dangLuu} onClick={onLuu}>
          {dangLuu && <LoaderCircle className="qt-quay" aria-hidden />}
          {dangLuu ? "Đang lưu…" : nutLuu}
        </button>
      </div>
    </div>
  );
}
