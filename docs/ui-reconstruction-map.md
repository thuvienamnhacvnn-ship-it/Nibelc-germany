# NIBELC — UI Reconstruction Map

Bản đồ tái tạo sáu trang chuẩn, lập theo **DESIGN LOCK** trong master prompt.

Mọi số đo lấy trực tiếp từ pixel của ảnh chuẩn ở viewport khoá **1672 × 941**,
bằng `scripts/do-anh-mau.mjs`. Không ước lượng bằng mắt.

Quy đổi sang CSS: `% = px / 1672` (ngang) hoặc `px / 941` (dọc).

---

## Phát hiện chung — phải nhớ trước khi dựng

**Header KHÔNG giống nhau giữa các trang.** Đây là chỗ dễ sai nhất:

| Trang | Header | Chiều cao |
|---|---|---|
| 01 homepage | Navy đặc | ~101px (10,7%) |
| 02 für Unternehmen | Navy đặc | 67px (7,1%) |
| 03 für Bewerber | **Nền sáng** | ~48px + vùng nav tới 172px |
| 04 Branchen | Nền sáng, chồng lên ảnh hero | trong dải 0–155px |
| 05 Branche detail | Nền sáng, chồng lên ảnh hero | trong dải 0–358px |
| 06 Prozess | **Nền sáng** | 0–139px |

**Chỉ trang 01 có hero nền navy.** Năm trang còn lại hero nền sáng, ảnh tràn phải.
Đây là lý do không được dùng một component hero duy nhất cho cả sáu trang.

**Dải đáy ~177px (18,8%)** lặp lại ở các trang 02, 04, 05 — cùng một nhịp.

---

## 01 — Homepage → route `/`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Header | 0–100 | 101px (10,7%) | Navy `rgb(5,39,81)` |
| Hero | 101–767 | 667px (70,9%) | Navy + ảnh tràn phải |
| Dải 4 ô icon | 768–940 | **173px (18,4%)** | Sáng `rgb(218,223,231)` |

**Hero — số đo bắt buộc**

- Mép trái chữ: **50px = 3,0% bề ngang**. Chữ SÁT mép trái viewport,
  KHÔNG nằm trong container canh giữa.
- Mảng navy **cắt chéo**: mép ở **668px (40,0%)** phía trên,
  **622px (37,2%)** phía dưới → lệch **46px** trên 667px chiều cao.
- Hai dòng H1 trắng: cao chữ **57px** mỗi dòng, đỉnh dòng 1 ở y=237,
  đỉnh dòng 2 ở y=314 → **line-height 77px**.
  Quy ra `font-size ≈ 70px`, `line-height ≈ 1,1`.
- Dòng 3 của H1 màu xanh sáng (không bắt được bằng bộ lọc trắng).
- Hai dòng phụ đề: cao chữ 15px, ở y≈490 và y≈524.
- Nút: chữ ở y≈609, cao 14px.

**Vòng cung 4 chặng** nằm trên ảnh, bên phải mảng navy.

---

## 02 — Für Unternehmen → route `/fuer-unternehmen`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Header | 0–66 | **67px (7,1%)** | Navy `rgb(50,73,95)` |
| Hero | 69–427 | 359px (38,2%) | Sáng + ảnh tràn phải |
| Dải 8 ô ngành | 428–547 | 120px (12,8%) | Sáng `rgb(237,242,247)` |
| 6 bước + khối tuân thủ | 557–733 | **177px (18,8%)** | Sáng |
| Dịch vụ + dashboard | 734–881 | 148px | Sáng |

Hero KHÔNG có mảng navy — nền sáng.

---

## 03 — Für Bewerber (Việt) → `/vi/nguoi-lao-dong` + entry `/fuer-bewerber`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Header | 0–48 | ~49px | **Sáng** `rgb(225,228,235)` |
| Vùng nav/eyebrow | 65–172 | ~108px | Sáng |
| Hero | 173–542 | 370px (39,3%) | Sáng + ảnh tràn phải |
| Dải 8 thẻ chủ đề | 543–797 | **255px (27,1%)** | Trắng `rgb(253,253,253)` |
| Dải số liệu | 799–940 | **142px (15,1%)** | Navy `rgb(21,49,80)` |

Đây là trang duy nhất có **dải số liệu nền navy ở đáy**.

---

## 04 — Branchen → route `/branchen`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Header chồng ảnh | 0–155 | 156px (16,6%) | Sáng, đè lên ảnh |
| Hero | 160–529 | 370px (39,3%) | Sáng + ảnh phải |
| Lưới thẻ hàng 1 | 530–589 | 60px | Sáng |
| Lưới thẻ hàng 2 | 590–766 | **177px (18,8%)** | Có ảnh |
| Lưới thẻ hàng 3 | 767–832 | 66px | Sáng |
| Dải 4 chỉ số đáy | 833–940 | 108px (11,5%) | Sáng `rgb(170,186,206)` |

Mảng navy mép hơi chéo: 443px (26,5%) → 400px (23,9%), lệch 43px.

---

## 05 — Branche Elektrotechnik → template `/branchen/[slug]`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Hero (gồm header chồng lên) | 0–358 | 359px (38,2%) | Ảnh sáng |
| Dải 4 sự kiện | 359–461 | 103px (10,9%) | Trắng `rgb(252,253,253)` |
| Hàng 4 cột thẻ | 463–713 | **251px (26,7%)** | Sáng `rgb(231,234,239)` |
| Gallery + timeline | 714–890 | **177px (18,8%)** | Hỗn hợp |
| Dải kết | 902–940 | 39px (4,1%) | Navy `rgb(52,75,101)` |

---

## 06 — Prozess → route `/prozess`

| Khối | y (px) | Chiều cao | Nền |
|---|---|---|---|
| Header | 0–139 | 140px | Sáng |
| Hero | 140–396 | 257px (27,3%) | Sáng + ảnh phải |
| Mốc ngang 6 chặng | 406–484 | 79px | Sáng |
| Ma trận hàng 1 (Unternehmen) | 492–555 | 64px | Sáng |
| Ma trận hàng 2 (Bewerber) | 557–692 | 136px | Sáng `rgb(190,206,219)` |
| Dải kết | 695–917 | 223px (23,7%) | Sáng `rgb(235,240,246)` |

---

## Asset mapping — ASSET LOCK

Chỉ dùng `assets/**` và `brand/nibelc-logo-original.svg`.

Registry duy nhất: `content/industry-assets.ts`, mọi ngành khai
`source: "kit"`, `approved: true`. Không glob quét thư mục.

Bốn slot mỗi ngành, đúng tỷ lệ:

| Slot | Tệp | Tỷ lệ |
|---|---|---|
| hero | `01-hero-16x9.jpg` | 16:9 |
| portraitWork | `02-portrait-work-3x4.jpg` | 3:4 |
| portraitTeam | `03-portrait-team-3x4.jpg` | 3:4 |
| detail | `04-detail-closeup.jpg` | 4:3 |

**Cách ly:** `du-lieu-goc/`, mọi thư mục `drive`/`raw`/`incoming`/`downloads`,
và ảnh do người dùng tự tạo ngoài KIT — không import ở giai đoạn này. Có test
tự động làm fail build nếu mã production tham chiếu tới chúng.

---

## Trạng thái từng trang

| Route | Đo xong | Dựng xong | Ảnh diff | Đạt gate |
|---|---|---|---|---|
| `/` (+ `/en`, `/vi`) | ✅ | ✅ | ✅ | ✅ |
| `/fuer-unternehmen` (+ `/en/employers`, `/vi/doanh-nghiep`) | ✅ | ✅ | ✅ | ✅ |
| `/vi/nguoi-lao-dong` (+ `/fuer-bewerber`, `/en/candidates`) | ✅ | ✅ | ✅ | ✅ |
| `/branchen` (+ `/en/industries`, `/vi/nganh-nghe`) | ✅ | ✅ | ✅ | ✅ |
| `/branchen/[slug]` (+ `/en/industries/[slug]`, `/vi/nganh-nghe/[slug]`) | ✅ | ✅ | ✅ | ✅ |
| `/prozess` (+ `/en/process`, `/vi/lo-trinh`) | ✅ | ✅ | ✅ | ✅ |

Gate: lệch grid/khoảng cách chính ≤ 8–12px tại 1672×941, ảnh kiểm thử lưu ở
`artifacts/visual-regression/<route>.png`, kèm báo cáo diff.

---

## Báo cáo diff — trang 01 (`/`)

Ảnh: `artifacts/visual-regression/home.side.png` (mẫu | thực tế), `home.diff.png`.

| Mốc | Mẫu (y) | Thực tế (y) | Lệch |
|---|---|---|---|
| Header cao | 101 | 101 | 0 |
| Dòng 1 H1 | ~267 | ~270 | ~3px |
| Phụ đề dòng 1 | ~496 | ~501 | ~5px |
| Nút CTA | 581–651 | ~586–656 | ~5px |
| Chữ dải 4 ô | ~822 | ~825 | ~3px |
| Nút Agent (mép phải) | 1643 | ~1642 | ~1px |

Mọi mốc chính lệch ≤ 12px. Tỷ lệ pixel khác ~34% đến từ **ảnh KIT khác ảnh
trong mẫu** (bắt buộc theo ASSET LOCK), không phải từ bố cục.

**Giả định đã áp dụng:**
- Kính lúp tìm kiếm → thay bằng nút chọn ngôn ngữ DE·EN·VI cùng vị trí (chưa có
  trang tìm kiếm; giữ kính lúp là nút chết).
- Ô 2 và 3 dải dưới: bỏ "Praxisbewährt" và "20+" (khẳng định pháp lý / số chưa
  xác minh — policy CẦN ĐIỀN 05), giữ nguyên bố cục bốn ô.
- Nhãn trên vòng cung có nền trắng mờ: ảnh KIT tối hơn vùng trời trong mẫu, chữ
  tối trần sẽ không đọc được.
- Ảnh hero: ảnh KIT gần bố cục nhất (`07…/01-hero-16x9.jpg`, phòng họp, cửa kính).
- Tiếng Việt: khoảng dòng H1 83u thay vì 77u để dấu chồng tầng không chạm dòng trên;
  nav giãn 19u thay vì 27u để vừa chữ dài hơn.

---

## Báo cáo diff — trang 02 (`/fuer-unternehmen`)

Ảnh: `artifacts/visual-regression/employers.side.png`.

Mốc chính đều trong ngưỡng: header 67u, nav bắt đầu x=387 và kết thúc trùng mục
"Wissen", H1 hai dòng cùng bề ngang, CTA lệch ~8px, 8 ô ngành y 446–533, khối
tuân thủ, 4 thẻ dịch vụ, bảng điều khiển, thẻ tư vấn đúng toạ độ.

Tỷ lệ pixel khác ~44%: ảnh KIT khác ảnh mẫu, và ảnh mẫu có nhiều vệt nhoè/viền
sáng quanh chữ (lỗi dựng ảnh của mẫu) mà bản code không chép lại.

**Giả định đã áp dụng:**
- 8 ô ngành đọc từ registry, không chép 8 nhãn minh hoạ của mẫu (Bau, Pflege, IT…).
- "So funktioniert TalentBridge (2 Min.)" bỏ "(2 Min.)" vì chưa có video; dẫn sang /prozess.
- Thanh chứng thực khách hàng: giữ khung, khoá nội dung (CẦN ĐIỀN 05).
- Bảng điều khiển là minh hoạ sản phẩm; số là số mẫu, có nhãn "Beispielansicht".
  Thanh tiến độ tô đúng 67% cho khớp nhãn (mẫu tô ~73%).
- Dòng icon nhoè dưới thẻ tư vấn trong mẫu không đọc được → không dựng.

---

## Báo cáo diff — trang 03 (`/vi/nguoi-lao-dong`)

Ảnh: `artifacts/visual-regression/candidates-vi.side.png`.

| Mốc | Mẫu | Thực tế | Lệch |
|---|---|---|---|
| Dòng 1 H1 (bề ngang) | 509px | ~504px | ~5px |
| Phụ đề 3 dòng (y) | 325/353/381 | 325/353/381 | ~2px |
| Nút (y) | 414–481 | ~417–483 | ~3px |
| Hàng tin cậy (y) | 516 | ~520 | ~4px |
| 8 thẻ chủ đề | 583–778 | 583–778 | 0 |
| Dải số liệu | 799–941 | 799–941 | 0 |

**Giả định đã áp dụng:**
- Header trong suốt đè lên ảnh (ảnh chạy tới mép trên như mẫu).
- "không chi phí ẩn" → "thông tin rõ ràng": chưa có chính sách phí được duyệt (CẦN ĐIỀN 07).
- "Xem video" → "Xem lộ trình": chưa có video; nút dẫn sang trang lộ trình.
- 500+ / 50+ / 95% khoá (CẦN ĐIỀN 05): dev hiện "—", production bỏ ô. Ô "8 lĩnh vực" giữ (đọc từ registry).
- Nav và dòng chữ nhỏ trên tiêu đề dịch theo ngôn ngữ trang.
- DE/EN: dòng 2 tiêu đề rút gọn ("Selbstbestimmt starten.", "Take charge of your future.") để giữ đúng bố cục 2 dòng của mẫu.

---

## Báo cáo diff — trang 04 (`/branchen`)

Mẫu tham chiếu: `screens/04-branchen (2).png` (bản mới Sếp thay trong KIT).
Ảnh: `artifacts/visual-regression/industries.side.png`.

Mốc chính lệch ≤ 9px: header trắng 63u, H1 (~5px), phụ đề (~5px), hàng tin cậy
(~9px), mảng navy chéo góc phải (1640→1300), hàng tiêu đề + "8", lưới 2×4 thẻ
(415–617, 628–834), dải 4 ô đáy (848–941).

**Giả định đã áp dụng:**
- Ngành 07: giữ thẻ và ảnh, dòng vị trí thay bằng "In Vorbereitung", không có link
  (CẦN ĐIỀN 02). Mẫu in sẵn "Ingenieure, IT-Spezialisten, Wirtschaftsexperten".
- Số "8" và "8 Kompetenzfelder" đọc từ registry.
- Ảnh thẻ dùng slot hero 16:9 của từng ngành. Ba thẻ trong mẫu (Elektrotechnik,
  Logistik, Produktion) dùng ảnh không có trong KIT; ảnh chân dung KIT cũng không
  khớp hơn.
- Kính lúp dẫn tới /branchen (chưa có trang tìm kiếm riêng).
- Tiếng Việt: câu trong mảng navy rút gọn để vừa 2 dòng.

## Báo cáo diff — trang 05 (`/branchen/[slug]`)

Mẫu tham chiếu: `screens/05-branche-elektrotechnik.png`, đo trên
`/branchen/elektrotechnik-elektroniker`.
Ảnh: `artifacts/visual-regression/industry.side.png`.

Mốc chính lệch ≤ 3px (đo bằng DOM): H1 67/116 (mẫu 118), hai nút 298–338
(mẫu 301–341), thẻ trích dẫn 1403/185 220×152, dải 4 ý 358–400, bốn thẻ
408–667 (x 50/435/836/1221), thẻ ảnh + thẻ lộ trình 676–897, dải navy 902–941.
Sai khác pixel còn lại do ảnh KIT khác ảnh trong mẫu.

Một khuôn cho 7 ngành đang mở (`generateStaticParams` + `dynamicParams = false`);
ngành 07 trả 404, ngoài sitemap, bị chặn trong robots. Chữ riêng từng ngành ở
`content/page-industry-detail.ts` (tiêu đề, lĩnh vực, mô tả, nhiệm vụ EN/VI,
chú thích ảnh, tiêu điểm ảnh hero); nhiệm vụ tiếng Đức đọc từ registry.

**Giả định đã áp dụng:**
- Thẻ trích dẫn "Tien Nguyen, seit 2023 in Deutschland" là người bịa → câu
  thương hiệu "Menschen verbinden. Kompetenzen stärken." ký NIBELC TalentBridge.
- "Hohe Nachfrage…", "Zukunftssicher und systemrelevant" chưa có nguồn → câu mô
  tả dịch vụ. "(IHK)" bỏ vì Elektroniker thuộc Handwerk (HWK).
- Vorbereitung bỏ "(bis B1/B2)"; Anforderungen bỏ "abgeschlossene
  Berufsausbildung" và "A2 oder höher" (CẦN ĐIỀN 04 + 08); dev hiện khung cảnh báo.
- 100+ / 95% khoá (CẦN ĐIỀN 05): dev hiện "—", production bỏ ô; ô bắt tay giữ.
- Timeline: mẫu vẽ 7 chấm cho 6 bước → 6 chấm. Bỏ chấm carousel (không có carousel).
- Ba ảnh thư viện là slot hero / portraitTeam / detail của ngành trong KIT.
- Tiêu đề ngắt 2 dòng như mẫu ở mọi ngành, mọi ngôn ngữ.
- Sửa kèm: bề rộng cố định theo mẫu ở trang 03, 04, 05 trước đây áp cả mobile
  (chữ bị bóp dọc) → chỉ áp từ `lg` qua `[data-lgw]` / `lg:w-[…]`.

## Báo cáo diff — trang 06 (`/prozess`)

Mẫu tham chiếu: `screens/06-prozess.png`.
Ảnh: `artifacts/visual-regression/process.side.png` (+ `process-en`, `process-vi`).

Mốc chính lệch ≤ 2px (đo bằng DOM): header 0–78, H1 top 138, hàng 6 bước
(vòng số tâm x 233/470/707/945/1187/1417, y 439), nhãn làn x22–183, 12 thẻ
(làn 1 520–648, làn 2 657–788; x 192/430/668/907/1146/1395), dải kết 806–918.
Sai khác pixel còn lại do ảnh hero KIT (phòng họp sáng) khác ảnh trong mẫu.

**Giả định đã áp dụng:**
- "rechtssicher" → "verlässlich"; "Planbare Besetzung für nachhaltigen Erfolg" →
  "Planbare Schritte für nachhaltige Zusammenarbeit"; "Erprobte Prozesse" →
  "Klare Prozesse" (khẳng định chưa có bằng chứng, CẦN ĐIỀN 05).
- "Prozess als PDF herunterladen": chưa có file → nút mở hộp thoại in / lưu PDF
  của trình duyệt, cùng vị trí; thêm nhãn nhỏ "Beispielansicht" vì trạng thái
  Abgeschlossen / In Bearbeitung / Offen chỉ là minh hoạ như mẫu.
- "Teilnahme an Integrationsprogramm" → "Integrationsangebote nutzen" (không
  ngụ ý có chương trình riêng chưa được xác nhận).
- Ảnh hero: `PAGE_HERO.prozess` = hero KIT ngành 07 (ảnh KIT đã duyệt; ngành 07
  vẫn khoá, chỉ dùng ảnh).
- Mobile: mỗi bước thành một khối gồm tiêu đề + thẻ doanh nghiệp + thẻ ứng viên.

## Phần mở rộng — điều hướng, trang phụ, hai biểu mẫu, trang 07

Sáu trang đầu giữ nguyên bố cục khoá. Phần này là chức năng bổ sung.

### Điều hướng
- `content/nav-menu.ts` là cây menu duy nhất của web (3 ngôn ngữ).
  Mẫu 08 vẽ mũi tên ⌄ ở bốn mục; menu con chỉ trỏ tới trang có thật.
- `components/nav/NavDropdown.tsx`: menu xổ xuống desktop (chuột, bàn phím,
  Esc, click ra ngoài); mục "Branchen" xổ hai cột đọc từ registry.
- `components/nav/MobileMenu.tsx`: từ trước tới nay dưới 1024px web KHÔNG có
  menu nào. Panel phải render qua `createPortal` vì header có `backdrop-blur`
  — thuộc tính này làm `position: fixed` neo vào header thay vì cửa sổ.

### Trang mới
| Route | Nội dung lấy từ |
|---|---|
| `/ueber-uns` (+ en, vi) | `kit/docs/01-NIBELC-LAM-GI.md`, `content/legal.ts`, ấn phẩm công ty |
| `/leistungen` (+ en, vi) | sáu bước của `content/page-process.ts`, phạm vi dịch vụ |
| `/wissen` (+ en, vi) | 7 câu hỏi thường gặp, trả lời không hứa kết quả |
| `/kontakt` (+ en, vi) | biểu mẫu + dữ liệu pháp nhân |
| `/personalbedarf` (+ en, vi) | mẫu 08, biểu mẫu bốn bước |
| `/datenschutz` | mô tả đúng hành vi thật của site (không cookie, không tracking) |
| `/agent-center` | mẫu 07, dữ liệu minh hoạ, noindex + chặn trong robots |
| `not-found` | trang 404 dẫn về các lối đi chính |

Chân trang chung `components/SiteFooter.tsx`: liên kết Impressum chỉ hiện khi
CẦN ĐIỀN 01 đủ dữ liệu (§5 TMG đòi Handelsregister, HRB, người đại diện).

### Biểu mẫu
`/api/anfrage` nhận cả hai biểu mẫu, có bẫy bot (ô ẩn), kiểm tra bắt buộc và
định dạng email, ghi mỗi lần gửi thành một dòng JSON trong `NIBELC_DATA_DIR`
(mặc định `.data/`, ngoài repo). Chưa có SMTP nên không chỗ nào hứa gửi email.

### Ảnh từ Drive
- 32 ảnh ngành: đã dùng hết cho 8 nhóm ngành.
- 4 ấn phẩm công ty (`public/unternehmen/`): 1 poster giới thiệu hiện ở mọi
  ngôn ngữ; 3 tin tuyển dụng đã cắt bỏ khung chụp màn hình và chỉ hiện ở bản
  tiếng Việt, kèm chú thích rằng lương và số lượng chỉ áp dụng cho đợt đó.
- `source-bases/` (10 ảnh nền gốc trước khi cắt) không đưa lên web: đây là bản
  thô của chính 32 ảnh kia.

### Khác mẫu, có chủ đích (trang 07 và 08)
- Mẫu 07 và 08 in tên người, số điện thoại và email không khớp ấn phẩm công ty
  ("Linh Nguyen", +49 69 …, beratung@nibelc.de) → dùng dữ liệu pháp nhân thật,
  không gán cho người cụ thể.
- Mẫu 08 hứa "Rückmeldung innerhalb von 1–2 Werktagen" → "so schnell wie
  möglich" (chưa có cam kết SLA được duyệt).
- Mẫu 07: mọi dữ liệu là minh hoạ, có nhãn "Demoansicht" trên đầu trang.

## Chuẩn hoá menu (một menu chính cho cả web)

Trước đây mỗi trang có nav riêng vì bám theo nhãn in trong từng ảnh mẫu, nên
đi giữa các trang thấy menu đổi liên tục (mẫu 01 "Für Arbeitgeber", mẫu 02
"Für Unternehmen", mẫu 03 "Für Bewerber aus Vietnam", mẫu 05 "Unser Service"…).

Từ nay **mọi header đọc `content/nav-menu.ts`**; ảnh mẫu chỉ còn quyết định
vị trí, cỡ chữ và màu.

**Menu chính — 7 mục, xếp theo hành trình người đọc**

| # | Mục | Menu con |
|---|---|---|
| 1 | Startseite | — |
| 2 | Für Unternehmen | Leistungen im Überblick · Ablauf der Zusammenarbeit · Personalbedarf melden |
| 3 | Für Fachkräfte | Ihr Weg nach Deutschland · Branchen und Berufe · Wissen und Ratgeber |
| 4 | Branchen | 7 ngành đang mở + Alle Branchen ansehen |
| 5 | Prozess | — |
| 6 | Wissen | Häufige Fragen · Prozess im Detail · Branchenüberblick |
| 7 | Über uns | NIBELC Germany GmbH · Unsere Leistungen · Kontakt |

Kontakt cố ý không ở cấp 1: đã có nút gọi hành động bên phải header, mục trong
"Über uns" và mục trong chân trang — để cấp 1 không có hai mục cùng một việc.

**Nút bên phải header** cũng thống nhất: "Anfrage starten" → `/personalbedarf`
(tiếng Việt "Gửi yêu cầu"). Trước đó mỗi trang một nút khác nhau (Kontakt,
Anmelden, Kontakt aufnehmen, Beratung anfragen).

**Hai mục bỏ khỏi header, vì chưa có trang thật:**
- "Login / Anmelden" (mẫu 01 và 03) — chưa có đăng nhập.
- "NIBELC Agent fragen" (mẫu 01) — Agent Center là màn hình nội bộ, không dẫn
  khách vào; nút giữ đúng kiểu dáng mẫu nhưng đổi nhãn và đích.

`navX` / `navGap` / `navFont` của từng trang được chỉnh lại cho 7 mục vừa khung
1672px ở cả ba ngôn ngữ; vì thế vị trí ngang của nav lệch so với ảnh mẫu — đây
là thay đổi có chủ đích, đổi lấy sự thống nhất.

## Header chung + lề trang (thay đổi có chủ đích so với ảnh mẫu)

**1. Một header duy nhất — `components/SiteHeader.tsx`**

Mỗi ảnh mẫu vẽ header một kiểu: cao 101 / 67 / 84 / 63 / 60 / 78, logo 66 / 50 /
68 / 52, nav bắt đầu ở 387…572, nút phải mỗi trang một nhãn. Dựng đúng từng mẫu
thì bấm sang trang khác thanh menu nhảy chỗ và đổi cỡ.

Nay mọi trang dùng chung một header: cao 78u, lề 34u, logo 52u, tên chương
trình hai dòng, nav cỡ 14u cách nhau 26u bắt đầu ở 545px, nút "Anfrage starten"
ở 1397px, dính trên khi cuộn (`sticky`). Ảnh mẫu chỉ còn quyết định **màu nền**
(navy ở trang chủ và trang Für Unternehmen, sáng ở các trang còn lại).

Hai chi tiết để menu không xê dịch:
- nav đặt ở khoảng cách cố định sau logo, không dùng `mx-auto`;
- mục đang mở chỉ đổi màu và có gạch chân, **không** in đậm — chữ đậm rộng hơn
  vài px sẽ đẩy các mục sau nó.

Header trong suốt đè lên ảnh (mẫu 03, 04, 05) cũng bỏ: header nay luôn đặc, nội
dung bắt đầu ngay dưới. `HeaderBar.tsx` và `HeaderNavy.tsx` đã xoá.

**2. Lề trang 2cm — nền vẫn tràn hết mép**

Nội dung trước đây chạm mép trái màn hình (mẫu vẽ chữ ở x=35…50). Nay chữ và
nội dung lùi vào 2cm, còn **nền và ảnh banner vẫn tràn hết bề ngang**:

```css
--nb-gutter: clamp(0px, 4.5vw, 76px);   /* 76px ≈ 2cm trên màn lớn */
--u: calc((min(100vw, 1672px) - 2 * var(--nb-gutter)) / 1672);

header, main > section, main > div, main > footer, body > footer {
  border-inline: var(--nb-gutter) solid transparent;
}
```

Dùng **viền trong suốt** thay cho padding là có lý do: nền vẽ tới mép ngoài
(border-box) nên vẫn tràn màn hình, trong khi mọi thứ bên trong — kể cả phần tử
đặt tuyệt đối theo toạ độ mẫu — tính từ mép trong, tức đã lùi vào 2cm. Padding
không làm được điều này vì phần tử tuyệt đối neo vào padding box.

Ảnh banner và mảng màu phủ trong banner mang class `.nb-photo-right`
(`right: calc(-1 * var(--nb-gutter))`) để chạy ra sát mép phải; mốc toạ độ vẫn
tính từ trái nên tỷ lệ theo mẫu không đổi.

Vì `--u` tính trong khung đã trừ lề nên mọi toạ độ theo mẫu vẫn đúng tỷ lệ, chỉ
thu nhỏ và lùi vào. Trên điện thoại lề co lại còn ~18px.

**Hệ quả:** bố cục sáu trang mẫu không còn khớp pixel với `screens/*.png` ở phần
header và lề ngoài; tỷ lệ bên trong vẫn giữ nguyên. Đây là yêu cầu của chủ dự án
(menu thống nhất, không tràn sát mép), đặt trên DESIGN LOCK ban đầu.

## Bản điện thoại (kiểu ứng dụng)

- `components/home/MobileHero.tsx`: banner riêng cho điện thoại, hai lớp —
  nền dọc (cửa kính nhìn ra skyline Berlin) + PNG hai nhân vật đã tách nền.
  **Nghiêng máy thì nền chạy ngược hướng nghiêng**, nhân vật nhích nhẹ theo,
  tạo chiều sâu; cùng nguyên tắc với hiệu ứng rê chuột ở bản desktop.
  iOS 13+ đòi người dùng bấm mới cho đọc cảm biến → nút nhỏ "3D" ở góc ảnh.
  Bật "giảm chuyển động" trong hệ điều hành thì banner đứng yên.
- `components/nav/MobileActionBar.tsx`: thanh hành động cố định dưới màn hình
  (gọi · gửi yêu cầu · liên hệ), chỉ có dưới 1024px; đáy trang chừa chỗ bằng
  `padding-bottom` trong globals.css.
- Chân trang `SiteFooter` nay có ở **mọi** trang (trước chỉ các trang phụ có).
- Sửa cho vừa màn hình nhỏ: nhãn chữ hoa giảm giãn cách, bảng điều khiển mẫu
  ở trang 02 xếp dọc và số liệu thành lưới 2 cột, khối số liệu trang 05 xếp
  dọc, thẻ hai làn trang 06 có nhãn "Unternehmen/Bewerber" riêng vì bảng hai
  làn chỉ đọc được ở desktop, thanh chứng thực rỗng (chưa duyệt CẦN ĐIỀN 05)
  không còn vẽ khung trống.
- Đã quét tràn ngang ở 360 / 390 / 430 / 768 / 1440 / 1672px: sạch.

## Logo và banner sau khi có lề trang

- Logo giữ nguyên màu gốc. Nền tối dùng `public/nibelc-logo-dark.svg` —
  chỉ đổi phần chữ sang trắng, dải màu cờ Đức giữ nguyên (trước đây dùng
  `brightness-0 invert` làm mất hết màu).
- Header có đường kẻ mảnh dưới chân (trắng mờ trên nền navy, xám nhạt trên
  nền sáng) để không chìm vào banner cùng màu.
- Banner trang chủ **neo mép phải màn hình** và rộng `1672u + lề`: màn rộng
  hơn mẫu thì phần thừa nằm bên trái và là nền navy — không bao giờ hở dải
  nền bên phải. Hai lớp ảnh kéo tới sát mép phải khung (`right: 0`), tỷ lệ
  do `object-cover` giữ.

## Đơn hàng đang chạy

Ba ảnh trong `public/unternehmen/02…04` KHÔNG phải ấn phẩm giới thiệu mà là
**tin tuyển dụng của các đơn hàng đang chạy**. Chúng đã được chuyển khỏi trang
"Über uns" sang nơi đúng vai trò:

- `content/jobs-current.ts` — dữ liệu từng đơn, đọc trực tiếp từ tin gốc:
  số suất (40 / 5 / 5), nơi làm việc (München · Seevetal · Münster), mức lương
  (2.000–2.400 € · 2.100–2.500 € · 2.000–2.400 €), 40 giờ/tuần, diện visa
  16a · 18a · 19c kết hợp 15d, quyền lợi bảo hiểm và hỗ trợ chỗ ở.
- `/stellenangebote` (+ `/en/jobs`, `/vi/don-hang`) — trang danh sách, mỗi đơn
  một thẻ: thông số, công việc thực tế, yêu cầu, quyền lợi, nút ứng tuyển và
  liên kết sang trang ngành tương ứng.
- `components/home/JobTicker.tsx` — dải chạy ngang ở đầu trang chủ, có chấm
  nhấp nháy, tên đơn + số suất, bấm vào là sang trang đơn hàng. Dừng khi rê
  chuột; đứng yên nếu người dùng bật "giảm chuyển động".
- Menu: thêm mục con "Đơn hàng đang chạy" trong nhánh Người lao động; trang
  cũng nằm trong sitemap.

**Không đưa lên web, dù tin gốc có in:** giới hạn tuổi và giới tính
("Nam/Nữ tuyển từ 20–45") — AGG cấm nêu tuổi hay giới tính trong tin tuyển
dụng tại Đức. Ảnh tin gốc (có in dòng đó) chỉ hiện ở bản tiếng Việt.
Mức lương ở đây là của riêng từng đơn, không phải bảng lương chung — bảng
lương chung vẫn khoá theo CẦN ĐIỀN 03.

## Banner trang chủ: đơn vị riêng và hiệu ứng

- **`--ub`** là đơn vị của banner: `min(100vw, 1672px) / 1672`, KHÔNG trừ lề
  trang. Ảnh, vòng cung và bốn huy hiệu dùng `--ub` nên giữ đúng tỷ lệ bản
  mẫu và phủ hết bề ngang; chỉ khối chữ dùng `--u` nên vẫn thụt lề 2cm.
- Ba chỗ từng cắt mất ảnh và để hở dải navy bên phải, nay đã bỏ: `overflow-hidden`
  của section hero, lớp bọc bị giới hạn trong lề, và việc trừ lề hai lần
  (lớp bọc trừ một lần, khung ảnh trừ thêm lần nữa → cả banner lệch phải 76px,
  chàng trai bên phải bị cắt mất vai).
- Lề trang đổi sang bậc số nguyên (0 / 24 / 48 / 76px) vì tính theo `vw` ra
  nửa pixel và sinh thanh cuộn ngang; `html { overflow-x: clip }` chặn phần dư.
- Bốn huy hiệu nay là liên kết thật (ngành · quy trình · quy trình · kiến thức)
  và có hiệu ứng khi rê chuột: nhích lên, phóng nhẹ, đổi sang cam, đổ bóng cam,
  chữ chuyển xanh đậm.
- Vòng cung vàng có hai hiệu ứng: quầng sáng thở nhẹ (`nb-arc-glow`) và một vệt
  sáng chạy dọc theo cung (`nb-arc-run`). Người bật "giảm chuyển động" thì cả
  hai tắt.

## Khung điện thoại kiểu ứng dụng (bản 2)

**Header** (`SiteHeader`, dưới 1024px): chỉ hai thứ — dải chữ chạy
(`components/nav/MobileTicker.tsx`, nội dung là đơn hàng đang tuyển, bấm vào
sang trang đơn hàng) nằm trên cùng, và **logo NIBELC căn giữa** ngay dưới.
Không nav, không nút, không hộp ngôn ngữ — tất cả đã xuống menu đáy.

**Menu đáy** (`components/nav/MobileTabBar.tsx`) thay thanh hành động cũ:
thanh bo tròn nổi trên nền, năm ô — Trang chủ · Ngành nghề · **nút tròn cam
nhô lên** (gửi yêu cầu) · Đơn hàng · Menu. Ô đang mở đổi màu và có chấm cam.
"Menu" mở tấm trượt từ đáy lên: toàn bộ menu chính (menu con mở gập), nút gọi,
nút liên hệ và ba ngôn ngữ. Tấm trượt render qua portal vì header có
`backdrop-blur` — thuộc tính đó biến mọi `position: fixed` bên trong thành neo
theo header.

**Banner điện thoại** (`MobileHero`) nay có đủ như bản desktop: vòng cung vàng
(cùng hai hiệu ứng `nb-arc-glow` + `nb-arc-run`) và bốn huy hiệu dẫn sang
ngành / quy trình / quy trình / kiến thức. Huy hiệu cuối lật chữ sang trái để
không nằm lên mặt người trong ảnh.

**Hiệu ứng nghiêng máy:** chỉ lớp NỀN chạy, và chạy ngược hướng nghiêng
(biên độ 26×18px, làm mượt 8%/khung hình); PNG hai nhân vật **đứng yên** nên
chủ thể không rung. Cách bật cảm biến: gắn tai nghe ngay từ đầu; nếu sau 1,2
giây không nhận được sự kiện nào và trình duyệt có `requestPermission` (đúng
iOS 13+) thì mới hiện nút "3D" mời người dùng bấm. Trước đây cứ thấy
`requestPermission` là hiện nút, nhưng Chrome trên Android cũng khai hàm đó
mà vẫn gửi sự kiện ngay — nút thành thừa và hiệu ứng không chạy.
