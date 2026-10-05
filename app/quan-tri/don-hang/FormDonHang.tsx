"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { viecLuuDonHang } from "../viec";

export type DonSua = {
  id: string;
  duLieu: Record<string, unknown>;
  dich: Record<string, unknown>;
};

type Ngon = "vi" | "en" | "de";

/* Những trường có thể dịch. Trường nào không nằm đây (giá, số suất, ngày…)
   thì chỉ có một bản dùng chung cho cả ba thứ tiếng — con số thì dịch gì. */
const TRUONG_DICH = ["title", "city", "state", "experience", "description"] as const;

/** chuyển mảng ↔ văn bản mỗi dòng một mục: nhân viên gõ danh sách dễ hơn JSON */
const mangThanhChu = (v: unknown) => (Array.isArray(v) ? v.join("\n") : "");
const chuThanhMang = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export function FormDonHang({
  ban,
  moi,
  nganhNghe,
}: {
  ban: DonSua;
  moi: boolean;
  nganhNghe: { id: string; ten: string }[];
}) {
  const [kq, gui, dangChay] = useActionState(viecLuuDonHang, null as { loi?: string; xong?: string } | null);
  const [d, setD] = useState<Record<string, any>>(ban.duLieu);
  const [dich, setDich] = useState<Record<string, any>>(ban.dich);
  const [ngon, setNgon] = useState<Ngon>("vi");

  const dat = (k: string, v: unknown) => setD((x) => ({ ...x, [k]: v }));
  const datDich = (l: "en" | "de", k: string, v: string) =>
    setDich((x) => {
      const o = { ...(x[l] ?? {}) };
      // Xoá hẳn khoá khi để trống, KHÔNG lưu chuỗi rỗng: trang công khai dựa
      // vào "có khoá hay không" để quyết định ẩn mục, chuỗi rỗng sẽ thành một
      // dòng trắng trên web.
      if (v.trim()) o[k] = v;
      else delete o[k];
      const r = { ...x, [l]: o };
      if (Object.keys(o).length === 0) delete r[l];
      return r;
    });

  /** giá trị đang hiện trong ô, theo thẻ ngôn ngữ đang mở */
  const gt = (k: string) => (ngon === "vi" ? (d[k] ?? "") : (dich[ngon]?.[k] ?? ""));
  const datGt = (k: string, v: string) => (ngon === "vi" ? dat(k, v) : datDich(ngon, k, v));
  const dichDuoc = (k: string) => (TRUONG_DICH as readonly string[]).includes(k);

  return (
    <form action={gui}>
      <input type="hidden" name="id" value={moi ? String(d.id ?? "") : ban.id} />
      <input type="hidden" name="du_lieu" value={JSON.stringify({ ...d, id: moi ? d.id : ban.id })} />
      <input type="hidden" name="dich" value={JSON.stringify(dich)} />

      {kq?.loi && <p className="qt-loi">{kq.loi}</p>}
      {kq?.xong && <p className="qt-xong">{kq.xong}</p>}

      {/* ---------- thẻ chọn ngôn ngữ ---------- */}
      <div className="qt-tam" style={{ marginBottom: 16 }}>
        <div className="qt-hang-nut">
          {(["vi", "en", "de"] as Ngon[]).map((l) => (
            <button
              key={l}
              type="button"
              className={ngon === l ? "qt-chinh" : ""}
              onClick={() => setNgon(l)}
              style={{ minHeight: 36, padding: "0 14px" }}
            >
              {l === "vi" ? "Tiếng Việt" : l === "en" ? "English" : "Deutsch"}
              {l !== "vi" && dich[l] && Object.keys(dich[l]).length > 0 ? " ✓" : ""}
            </button>
          ))}
          <span style={{ fontSize: 13, color: "var(--qt-mo)", marginLeft: 6 }}>
            {ngon === "vi"
              ? "Bản gốc — bắt buộc."
              : "Để trống trường nào thì bản này ẩn trường đó, không hiện tiếng Việt lẫn vào."}
          </span>
        </div>
      </div>

      {/* ---------- nội dung chính ---------- */}
      <div className="qt-tam">
        <h2>Nội dung</h2>

        <div className="qt-o">
          <label htmlFor="title">Tên đơn hàng</label>
          <input id="title" value={gt("title")} onChange={(e) => datGt("title", e.target.value)} required={ngon === "vi"} />
        </div>

        <div className="qt-o">
          <label htmlFor="description">Mô tả công việc</label>
          <textarea
            id="description"
            value={gt("description")}
            onChange={(e) => datGt("description", e.target.value)}
            rows={4}
          />
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          <div className="qt-o">
            <label htmlFor="city">Thành phố</label>
            <input id="city" value={gt("city")} onChange={(e) => datGt("city", e.target.value)} />
          </div>
          <div className="qt-o">
            <label htmlFor="state">Nước</label>
            <input id="state" value={gt("state")} onChange={(e) => datGt("state", e.target.value)} />
          </div>
          <div className="qt-o">
            <label htmlFor="experience">Kinh nghiệm</label>
            <input id="experience" value={gt("experience")} onChange={(e) => datGt("experience", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ---------- những trường KHÔNG dịch ---------- */}
      {ngon === "vi" && (
        <>
          <div className="qt-tam">
            <h2>Thu nhập và số suất</h2>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}>
              <div className="qt-o">
                <label htmlFor="smin">Lương từ (€)</label>
                <input
                  id="smin"
                  type="number"
                  value={d.salary?.min ?? 0}
                  onChange={(e) => dat("salary", { ...d.salary, min: Number(e.target.value) })}
                />
              </div>
              <div className="qt-o">
                <label htmlFor="smax">Lương đến (€)</label>
                <input
                  id="smax"
                  type="number"
                  value={d.salary?.max ?? 0}
                  onChange={(e) => dat("salary", { ...d.salary, max: Number(e.target.value) })}
                />
                <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>Để 0 thì web ghi “Theo thoả thuận”.</span>
              </div>
              <div className="qt-o">
                <label htmlFor="styp">Tính theo</label>
                <select id="styp" value={d.salaryType ?? "tháng"} onChange={(e) => dat("salaryType", e.target.value)}>
                  <option value="tháng">tháng</option>
                  <option value="giờ">giờ</option>
                </select>
              </div>
              <div className="qt-o">
                <label htmlFor="vac">Số suất</label>
                <input
                  id="vac"
                  type="number"
                  min={1}
                  value={d.vacancies ?? 1}
                  onChange={(e) => dat("vacancies", Number(e.target.value))}
                />
              </div>
              <div className="qt-o">
                <label htmlFor="hrs">Giờ / tuần</label>
                <input
                  id="hrs"
                  type="number"
                  value={d.hours ?? ""}
                  onChange={(e) => dat("hours", e.target.value === "" ? null : Number(e.target.value))}
                />
                <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>Để trống thì ghi “Theo hợp đồng”.</span>
              </div>
            </div>
          </div>

          <div className="qt-tam">
            <h2>Phân loại</h2>
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))" }}>
              <div className="qt-o">
                <label htmlFor="ind">Ngành nghề</label>
                <select id="ind" value={d.industryId ?? ""} onChange={(e) => dat("industryId", e.target.value)}>
                  {nganhNghe.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.ten}
                    </option>
                  ))}
                </select>
              </div>
              <div className="qt-o">
                <label htmlFor="emp">Hình thức</label>
                <select id="emp" value={d.employmentType ?? ""} onChange={(e) => dat("employmentType", e.target.value)}>
                  <option>Toàn thời gian</option>
                  <option>Thời vụ</option>
                  <option>Ca kíp</option>
                </select>
              </div>
              <div className="qt-o">
                <label htmlFor="prg">Chương trình</label>
                <select id="prg" value={d.programType ?? ""} onChange={(e) => dat("programType", e.target.value)}>
                  <option>Lao động</option>
                  <option>Du học nghề</option>
                </select>
              </div>
              <div className="qt-o">
                <label htmlFor="lang">Ngoại ngữ yêu cầu</label>
                <select
                  id="lang"
                  value={d.language ?? ""}
                  onChange={(e) => dat("language", e.target.value === "" ? null : e.target.value)}
                >
                  <option value="">Không yêu cầu / chưa rõ</option>
                  <option value="de">Tiếng Đức</option>
                  <option value="en">Tiếng Anh</option>
                </select>
              </div>
              <div className="qt-o">
                <label htmlFor="lvl">Trình độ</label>
                <input
                  id="lvl"
                  value={d.languageLevel ?? ""}
                  onChange={(e) => dat("languageLevel", e.target.value)}
                  placeholder="A2 – B1"
                  disabled={!d.language}
                />
                <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>
                  Chỉ điền khi đơn thật sự yêu cầu — thông báo tuyển không nói thì để trống.
                </span>
              </div>
            </div>
          </div>

          <div className="qt-tam">
            <h2>Yêu cầu và quyền lợi</h2>
            <p className="qt-phu" style={{ marginBottom: 12 }}>Mỗi dòng là một ý.</p>
            <div className="qt-o">
              <label htmlFor="req">Yêu cầu</label>
              <textarea
                id="req"
                rows={5}
                value={mangThanhChu(d.requirements)}
                onChange={(e) => dat("requirements", chuThanhMang(e.target.value))}
              />
            </div>
            <div className="qt-o">
              <label htmlFor="ben">Quyền lợi</label>
              <textarea
                id="ben"
                rows={5}
                value={mangThanhChu(d.benefits)}
                onChange={(e) => dat("benefits", chuThanhMang(e.target.value))}
              />
            </div>
          </div>

          <div className="qt-tam">
            <h2>Đường dẫn và ảnh</h2>
            <div className="qt-o">
              <label htmlFor="slug">Đường dẫn trên web</label>
              <input
                id="slug"
                value={d.slug ?? ""}
                onChange={(e) => dat("slug", e.target.value.trim())}
                required
                placeholder="thu-hoach-dau-tay-tai-graz"
              />
              <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>
                nibelcgermany.de/don-hang/<b>{d.slug || "…"}</b> — đổi cái này là link cũ chết, cân nhắc.
              </span>
            </div>
            {moi && (
              <div className="qt-o">
                <label htmlFor="mid">Mã đơn</label>
                <input id="mid" value={d.id ?? ""} onChange={(e) => dat("id", e.target.value.trim())} required placeholder="gr-260401-abc" />
                <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>Đặt xong không đổi được.</span>
              </div>
            )}
            <div className="qt-o">
              <label htmlFor="img">Ảnh chính</label>
              <input id="img" value={d.image ?? ""} onChange={(e) => dat("image", e.target.value)} placeholder="/assets/jobs/..." />
              <span style={{ fontSize: 12, color: "var(--qt-mo)" }}>
                Kho ảnh bấm chọn sẽ có ở chặng sau; tạm thời dán đường dẫn ảnh.
              </span>
            </div>
          </div>
        </>
      )}

      <div className="qt-hang-nut" style={{ marginTop: 18, position: "sticky", bottom: 0, background: "var(--qt-nen)", padding: "12px 0" }}>
        <button type="submit" className="qt-chinh" disabled={dangChay}>
          {dangChay ? "Đang lưu…" : "Lưu"}
        </button>
        <Link href="/quan-tri" className="qt-nut">
          Quay lại danh sách
        </Link>
        {!moi && d.slug && (
          <a href={`/don-hang/${d.slug}`} target="_blank" rel="noreferrer" className="qt-nut">
            Xem trên web ↗
          </a>
        )}
      </div>
    </form>
  );
}
