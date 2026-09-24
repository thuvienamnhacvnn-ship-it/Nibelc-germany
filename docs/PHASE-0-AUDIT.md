# NIBELC — Phase 0: Audit, Architecture & Phase Plan

Ngày: 21/09/2026 · Trạng thái: **chờ duyệt trước khi vào Phase 1**

---

## 1. Tóm tắt repository hiện tại

**Chưa có repo NIBELC.** Đây là dự án mới.

| Mục | Trạng thái |
|---|---|
| Thư mục làm việc | `C:\Users\admin\nibelcgroup` (mới tạo) |
| Git | Chưa init. **Cảnh báo:** `C:\Users\admin` bản thân là một git repo → phải `git init` riêng cho project, nếu không Tailwind v4 sẽ quét toàn bộ home và treo `next dev` |
| Source code | Chưa có dòng nào |
| Đã chép vào project | `kit/docs`, `kit/brand`, `kit/screens`, `kit/reference-ui`, và **32 ảnh ngành** → `public/branchen/` |
| `du-lieu-goc/` | **Rỗng** — chỉ có README |

Bộ kit gốc: `E:\Works\itw\Nibelc DE\NIBELC_Web_Full_Visual_Kit_v3`

---

## 2. Toàn bộ tài liệu và ảnh đã đọc

### Tài liệu (10 file, đã đọc hết)

`NIBELC_Claude_Code_Master_Prompt_Full.md` (bản đầy đủ, 20 mục) ·
`docs/CLAUDE-CODE-MASTER-PROMPT.md` (bản rút gọn) ·
`01-NIBELC-LAM-GI.md` · `02-8-NHOM-NGANH.md` · `03-LUAT-SINH-ANH.md` ·
`04-SITEMAP-VA-BO-CUC.md` · `05-CAN-DIEN.md` · `06-PROMPT-MAU-CHO-CHATGPT.md` ·
`07-MA-TRAN-32-ANH.md` · `08-IMAGE-STATUS.md`

### Ảnh

**`assets/` — 32/32 ảnh đủ.** 8 ngành × 4 slot (`01-hero-16x9`, `02-portrait-work-3x4`, `03-portrait-team-3x4`, `04-detail-closeup`). Không thiếu slot nào.

**`screens/` — 8 mockup giao diện:** homepage, für-unternehmen, für-bewerber-vietnam, branchen, branche-elektrotechnik, prozess, agent-center, personalbedarf-formular.

**`brand/` — 1 file:** `nibelc-logo-original.svg` (logo NIBELC GmbH, có dải cờ Đức).

**`source-bases/` — 10 ảnh nguồn.** **`reference-ui/` — 1 ảnh.**

### Đã phân tích mockup homepage

Header navy đặc, logo trái + tagline `TalentBridge Deutschland`, nav Đức, nút tìm kiếm, Login, CTA cam `NIBELC Agent fragen`. Hero split: chữ trắng + `Sicher integriert.` xanh sáng, 2 nút (cam đặc `Personalbedarf melden` / viền trắng `Beratung vereinbaren`), ảnh phải có overlay 4 bước quy trình. Dưới hero là dải 4 trust badge nền sáng.

---

## 3. Những `[CẦN ĐIỀN]` đang khóa production

| Mã | Nội dung | Khóa cái gì |
|---|---|---|
| **01** | Pháp nhân & Impressum | `/impressum` không publish được. Theo luật Đức (§5 TMG) site thương mại **bắt buộc** có Impressum → **khóa toàn bộ go-live** |
| **02** | Ngành của nhóm chuyên gia đại học | Route `/branchen/akademische-fachkraefte` blocked, noindex, ngoài sitemap |
| **03** | Mức lương | Ẩn block lương ở mọi trang ngành |
| **04** | Yêu cầu tiếng Đức (CEFR) | Ẩn `Anforderungen` |
| **05** | Số liệu thành tích | Ẩn toàn bộ block trust/số liệu |
| **06** | Bộ nhận diện | Chỉ có logo SVG; **chưa có mã màu chính thức, font có license, favicon, social mark** |
| **07** | Phạm vi dịch vụ & chi phí | Ẩn block giá/dịch vụ |
| **08** | Điều kiện ứng viên & thời gian | Ẩn điều kiện + timeline |

### Ba mâu thuẫn tôi phát hiện, cần Sếp quyết

**(a) Mockup homepage vi phạm chính luật của kit.**
`screens/01-homepage.png` in sẵn `20+ Partnerinstitutionen` và `§ 18b AufenthG — Rechtssicher. Praxisbewährt.`
Mục 6 của master prompt cấm dùng số liệu chưa duyệt; nguyên tắc tuyệt đối cấm khẳng định kết quả visa.
→ Tôi sẽ **dựng khối trust nhưng để rỗng**, chờ `[CẦN ĐIỀN 05]`. Không in số từ mockup.

**(b) Màu logo lệch màu design system.**
Logo thật: xanh `#004ca0`, cam-đỏ `#ee3315`, vàng `#fde504`.
Design system trong master prompt: Navy `#071B33`, Blue 600 `#1768AC`, Orange 600 `#F26A21`.
→ Đề xuất: **giữ nguyên logo không sửa** (đúng yêu cầu), UI dùng token của design system. Nếu Sếp muốn UI khớp logo thì đây là `[CẦN ĐIỀN 06]`.

**(c) `du-lieu-goc/` rỗng.**
Mục "Thực thi" #4 yêu cầu kiểm kê `du-lieu-goc/` bằng hash và báo số ảnh từng ngành — **hiện không có gì để kiểm kê**.
Ảnh gốc nằm trên Google Drive, lần tải trước Google nén xong nhưng file không về máy.
→ 32 ảnh trong `assets/` đủ để dựng. Nhưng `08-IMAGE-STATUS.md` ghi rõ ảnh của **Gastronomie, Bäckerei, Fleischerei, Gartenbau** là phục dựng từ mockup, chất lượng prototype, **nên thay bằng ảnh gốc từ Drive**.

---

## 4. Architecture proposal

### Stack

| Lớp | Chọn | Lý do |
|---|---|---|
| Framework | **Next.js App Router + TypeScript strict** | Theo mặc định của master prompt |
| CSS | **Tailwind v4** + design tokens | Phải khai `@source` trỏ đúng thư mục project |
| Validation | **Zod** | Dùng chung cho form, API, content schema |
| DB | **PostgreSQL qua PGlite** (dev) → Postgres thật (prod) | **Bắt buộc:** máy này bật Smart App Control, chặn mọi `.exe` của Postgres |
| ORM | **Drizzle** | Prisma `migrate` từng bị SAC chặn ở dự án khác; Drizzle thuần JS nên an toàn |
| Auth | **Auth.js v5**, credentials + session DB | Cần role claim ở server |
| Content | **Typed content files + DB overlay** | Content tĩnh trong repo; 8 mục `[CẦN ĐIỀN]` nằm ở DB để admin sửa không cần code |
| Test | **Vitest** (unit) + **Playwright** (E2E) | Theo mục 16 |

Cổng dev: **3140** (các cổng 3002–3130 đã bị dự án khác chiếm).

### Cơ chế cốt lõi: `FieldGate`

Đây là thứ phải làm đúng nhất, vì 7/16 test ở mục 16 xoay quanh nó.

```
content/fields.ts   → khai báo 8 mục CAN_DIEN, mỗi mục có status: 'blocked' | 'approved'
lib/field-gate.ts   → gate(code): trả về dữ liệu, hoặc null nếu chưa duyệt
<Gated code="05">   → dev: hiện khung placeholder vàng
                      production: KHÔNG render gì cả
```

Một chuỗi `[CẦN ĐIỀN]` **không bao giờ** được vào HTML production — có test chặn.

### i18n

Không dùng thư viện i18n dịch 1:1 (trái nguyên tắc số 1). Thay vào đó **hai cây nội dung độc lập**: `content/de/**` và `content/vi/**`. Trang Đức và trang Việt là hai bộ nội dung khác nhau, chỉ dùng chung registry ngành và ảnh.

### Industry registry

```ts
{ slug, order, berufDe, berufViShort,
  status: 'active' | 'blocked',
  images: { hero16x9, portraitWork3x4, portraitTeam3x4, detailCloseup },
  ...
}
```
Ngành 07 `status: 'blocked'` → ngoài sitemap, `noindex`, không structured data, card hiện `In Vorbereitung` nếu admin bật.

---

## 5. Data model proposal

Master prompt liệt kê ~40 entity. Tôi nhóm lại và chia theo phase để không dựng thừa:

| Nhóm | Entity | Phase |
|---|---|---|
| **Identity** | `User`, `Organization`, `Membership`, `Role`, `Session` | 1 |
| **Content** | `FieldValue` (8 mục CẦN ĐIỀN), `Industry`, `KnowledgeArticle`, `AssetRef` | 1–2 |
| **Employer** | `Employer`, `EmployerSite`, `JobDemand`, `Job`, `Requirement` | 3 |
| **Candidate** | `Candidate`, `CandidateSkill`, `CandidateExperience`, `Qualification`, `LanguageLevel`, `Consent` | 3 |
| **Matching** | `Match`, `MatchEvidence`, `Shortlist`, `Interview`, `Scorecard`, `Offer`, `Contract` | 4 |
| **Documents** | `Document`, `DocumentVersion`, `Verification` | 3–4 |
| **Process** | `RecognitionCase`, `VisaCase`, `ChecklistItem`, `Appointment`, `TravelPlan`, `IntegrationTask` | 4 |
| **Agent** | `AgentDefinition`, `AgentRun`, `AgentAction`, `Approval` | 5 |
| **Chung** | `MessageThread`, `Message`, `Notification`, `AuditLog` | 4–5 |

Quy ước áp cho mọi entity nghiệp vụ: `createdAt`, `updatedAt`, `createdBy`, `tenantId`. Index theo `tenantId`, `status`, `assigneeId`, `dueAt`.

**Ràng buộc chống phân biệt đối xử (AGG):** `Match` **không** đọc giới tính, tuổi, tôn giáo, nguồn gốc. Các trường này không nằm trong bảng dùng cho matching — tách hẳn schema, không chỉ lọc ở tầng ứng dụng, và có test chứng minh.

---

## 6. Kế hoạch theo phase

| Phase | Nội dung | File chính | Checkpoint kiểm thử |
|---|---|---|---|
| **1 — Foundation** | git init, scaffold, design tokens, app shell, header/footer, PGlite + Drizzle, Auth.js, RBAC, `FieldGate`, industry registry, seed | `app/layout.tsx`, `lib/db/*`, `lib/auth/*`, `lib/field-gate.ts`, `content/industries.ts` | `pnpm typecheck` · test: không rò `[CẦN ĐIỀN]` · test: ngành 07 blocked |
| **2 — Public site** | Homepage 9 khối, `/fuer-unternehmen`, `/fuer-bewerber`, `/branchen`, 8 trang ngành, `/prozess` `/integration` `/wissen` `/ueber-uns` `/kontakt`, legal shells, cổng `/vi/*` | `app/(public)/**`, `components/**`, `content/de/**`, `content/vi/**` | Test 4 slot ảnh/ngành · hreflang · Lighthouse A11y ≥95 · responsive 375/768/1024/1440 |
| **3 — Forms & portals** | Wizard `Personalbedarf` 6 bước có autosave, eligibility questionnaire, candidate onboarding, consent, upload tài liệu | `app/(forms)/**`, `app/portal/kandidat/**` | Playwright: employer gửi Bedarf · candidate tạo hồ sơ |
| **4 — Cockpit** | `/app/dashboard`, bedarfe, kandidaten, matching, interviews, dokumente, prozesse, audit | `app/app/**` | Test RBAC + tenant isolation · test matching không dùng protected fields |
| **5 — Agent Center** | 6 agent, pipeline có policy check, approval queue, citation, audit | `lib/agent/**`, `app/app/agent-center` | Test: external action bị chặn trước approval |
| **6 — Hardening** | Security headers, rate limit, background job, adapters, observability, full E2E | `middleware.ts`, `lib/adapters/**` | Playwright đủ 4 luồng · Lighthouse Perf ≥85 |

### Quy mô thực tế

Đây **không phải việc một buổi**. Phase 1–2 cho ra một site Đức chạy được, xem được, đúng thiết kế mockup. Phase 3–6 là phần webapp (portal, cockpit, agent) — nặng hơn toàn bộ phần public cộng lại.

Đề xuất: **làm liền Phase 1 + 2** để Sếp có cái nhìn thấy và duyệt hướng, rồi mới đi tiếp.

---

## 7. Giả định tôi đang dùng (Sếp bác thì tôi sửa)

1. Tiếng Đức là mặc định ở `/`, tiếng Việt ở `/vi` — không có `/de` prefix.
2. Tagline `TalentBridge Deutschland` trong mockup là **chính thức** và được dùng.
3. Dev dùng PGlite; production sẽ là Postgres thật trên VPS.
4. Email/OCR/e-signature ở Phase 1–3 là **mock adapter**, không gửi thật.
5. Ảnh trong `assets/` dùng được ngay cho Phase 2; thay ảnh Drive sau mà không đổi tên file.
6. Chưa mua tên miền → chưa cấu hình production domain.

---

## 8. Blocker cần Sếp trả lời trước khi go-live

1. **`[CẦN ĐIỀN 01]`** — pháp nhân + Impressum. Không có cái này thì **không được phép** đưa site Đức lên mạng.
2. **`[CẦN ĐIỀN 02]`** — nhóm chuyên gia đại học gồm ngành nào.
3. **Tên miền** — `nibelcgroup.de` hiện chưa đăng ký (DNS: không tồn tại). Đăng ký tên này hay dùng tên khác? Tôi không tự mua.

Ba cái này **không chặn Phase 1–2**. Tôi dựng code với các block đó ở trạng thái ẩn/blocked, Sếp điền sau qua `/admin/content` mà không cần sửa code.
