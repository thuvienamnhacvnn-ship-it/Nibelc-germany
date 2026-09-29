# NIBELC GERMANY — BẢN V2

Dựng lại toàn bộ webapp theo phong cách poster `E:\Works\itw\A2.png`.
Chuyên môn: **xuất khẩu lao động** và **du học nghề (Ausbildung)** tại Đức.

Tài liệu này gồm ba phần:
- **A. Bộ nhận diện** — chốt màu, chữ, chất ảnh
- **B. Form webapp** — sơ đồ trang và chức năng từng trang
- **C. Danh sách ảnh** — mã ảnh, tỷ lệ, thư mục lưu, prompt tạo ảnh

---

## A. BỘ NHẬN DIỆN (lấy từ poster A2)

| | |
|---|---|
| Nền chính | Trời xanh sáng `#8EC9F0` → trắng `#FFFFFF`, mây trắng |
| Xanh thương hiệu | `#0B3C8C` (chữ tiêu đề, thanh dưới) · `#1A5BB8` (nhạt hơn) |
| Vàng đồng | `#C9962C` → `#F0C86A` (gradient chữ nhấn, viền icon) |
| Đỏ cờ Đức | `#DD0000` · Đen `#111111` · Vàng cờ `#FFCE00` |
| Nền khối sáng | `#F2F7FD` · Viền `#D9E6F5` |
| Chữ thân | `#1B2B45` trên nền sáng |

**Chữ:** tiêu đề in đậm, nghiêng nhẹ, có bóng — kiểu poster. Thân chữ Inter/Manrope.
**Nhấn:** dải ruy-băng cờ Đức chéo góc, icon tròn viền vàng đồng, chữ viết tay vàng cho khẩu hiệu.
**Ảnh:** nắng vàng, trong trẻo, người thật, bối cảnh Đức nhận ra ngay (Cổng Brandenburg, tháp truyền hình Berlin, nhà thờ, sông Spree, phố cổ).

**Khác hẳn bản cũ:** bản cũ nền xanh đêm. Bản V2 **nền sáng**, cờ Đức và vàng đồng là điểm nhấn.

---

## B. FORM WEBAPP

### B1. Trang công khai (3 ngôn ngữ: VI gốc, DE, EN)

| # | Trang | Đường dẫn | Nội dung chính |
|---|---|---|---|
| 01 | Trang chủ | `/` | Banner lớn · thanh tìm đơn · 8 nhóm ngành · đơn nổi bật · 2 lộ trình (đi làm / du học nghề) · con số thật · lời chứng · dải đối tác |
| 02 | Đơn hàng | `/don-hang` | Bộ lọc: ngành · vùng · mức lương · diện visa · số suất còn lại. Xem dạng thẻ hoặc bảng. Sắp xếp. So sánh |
| 03 | Chi tiết đơn hàng | `/don-hang/[ma]` | Ảnh nghề · lương · chỉ tiêu · visa · hợp đồng · công việc thực tế · yêu cầu · quyền lợi · nơi làm việc trên bản đồ · poster gốc tải PDF · nút ứng tuyển |
| 04 | Du học nghề | `/du-hoc-nghe` | Ausbildung là gì · điều kiện · 8 ngành đào tạo · trợ cấp học nghề · lộ trình 3 năm |
| 05 | Chi tiết ngành học nghề | `/du-hoc-nghe/[nganh]` | Chương trình · thời lượng · trợ cấp · trường/doanh nghiệp tiếp nhận · cơ hội sau tốt nghiệp |
| 06 | Ngành nghề | `/nganh-nghe` | 8 nhóm ngành, mỗi nhóm một ô ảnh lớn |
| 07 | Chi tiết ngành | `/nganh-nghe/[nganh]` | Mô tả · các vị trí · mức lương tham khảo · đơn đang tuyển thuộc ngành |
| 08 | Lộ trình | `/lo-trinh` | **Hai luồng song song**: đi làm việc (6 bước) và du học nghề (7 bước), bấm chuyển |
| 09 | Điều kiện & hồ sơ | `/dieu-kien-ho-so` | Danh mục giấy tờ tick được, in ra được; phân theo diện visa 16a/18a/18b/19c |
| 10 | Công cụ tính | `/tinh-thu-nhap` | Nhập ngành + vùng → ước tính thu nhập, chi phí sinh hoạt, tiền tiết kiệm |
| 11 | Trắc nghiệm chọn nghề | `/chon-nghe` | 6 câu hỏi → gợi ý 3 đơn hàng phù hợp |
| 12 | Cẩm nang | `/cam-nang` | Bài viết: visa, tiếng Đức, công nhận bằng, đời sống ở Đức |
| 13 | Về chúng tôi | `/ve-chung-toi` | Pháp nhân, giấy phép, đội ngũ, văn phòng Berlin + Việt Nam |
| 14 | Cho doanh nghiệp Đức | `/fuer-unternehmen` | Dịch vụ tuyển dụng, quy trình, tuân thủ pháp lý |
| 15 | Gửi nhu cầu nhân sự | `/nhu-cau-nhan-su` | Form 4 bước dành cho doanh nghiệp |
| 16 | Ứng tuyển | `/ung-tuyen` | Form nhiều bước + tải CV/bằng cấp; sinh **mã hồ sơ** |
| 17 | Tra cứu hồ sơ | `/tra-cuu` | Nhập mã hồ sơ → xem đang ở bước nào |
| 18 | Liên hệ | `/lien-he` | Bản đồ, hai số điện thoại, Zalo, WhatsApp, form |
| 19 | Pháp lý | `/datenschutz`, `/impressum` | Bắt buộc theo luật Đức |

### B2. Chức năng làm nên khác biệt

1. **Bộ lọc đơn hàng tức thì** — lọc ngay trên máy người xem, không chờ tải lại
2. **So sánh đơn hàng** — chọn 2–3 đơn, xem bảng đối chiếu lương / chỉ tiêu / visa / quyền lợi
3. **Máy tính thu nhập** — ước tính thu nhập ròng và tiền dư mỗi tháng theo vùng
4. **Trắc nghiệm chọn nghề** — 6 câu, ra gợi ý đơn phù hợp
5. **Lưu đơn yêu thích** — lưu trên máy người xem, xem lại ở `/don-hang?luu=1`
6. **Mã hồ sơ + tra cứu** — ứng viên tự xem hồ sơ đang ở bước nào
7. **Chia sẻ Zalo / WhatsApp** — mỗi đơn một nút chia sẻ kèm ảnh
8. **Tải poster đơn hàng** — xuất PDF một trang đúng mẫu tin tuyển dụng
9. **Đếm ngược suất còn lại** — hiện số suất còn trên tổng
10. **Ba thứ tiếng** — VI / DE / EN, đổi ngay tại chỗ

### B3. Dữ liệu

- **Đơn hàng**: 3 đơn nhà kính đã có (Quản lý nhà kính 5 suất · Thợ bảo trì 5 suất · Công nhân trồng rau củ quả 40 suất) + các đơn trong Drive khi Sếp gửi thêm
- **8 nhóm ngành** (đúng theo Drive):
  1. Khách sạn, nhà hàng và bếp
  2. Chuỗi siêu thị và bán lẻ thực phẩm
  3. Làm bánh và sản xuất bánh công nghiệp
  4. Chế biến thịt và thực phẩm
  5. Xây dựng, điện, cơ khí và hạ tầng
  6. Logistics, kho vận và lái xe
  7. Chuyên gia đại học theo §18b
  8. Nông nghiệp nhà kính và làm vườn

**Luật giữ nguyên:** không bịa lương, chỉ tiêu, số liệu. Không nêu tuổi/giới tính ở bản tiếng Đức và tiếng Anh (luật AGG cấm). Poster gốc tiếng Việt chỉ hiện ở bản tiếng Việt.

---

## C. DANH SÁCH ẢNH CẦN TẠO

### C0. Quy ước chung

**Thư mục gốc:** `C:\Users\admin\nibelcgroup\public\anh\`
Tên file viết thường, không dấu, nối bằng gạch ngang. Lưu **JPG chất lượng 92**, trừ ảnh cần nền trong suốt thì PNG.

**Câu mô tả phong cách — dán vào CUỐI mọi prompt:**

> Photorealistic, bright natural daylight, clean modern German setting, warm golden sunlight, clear blue sky, high detail, professional commercial photography, subtle German flag colour accents (black, red, gold), optimistic and trustworthy mood, no text, no watermark, no logo.

**Câu về người — dán khi ảnh có người:**

> Young Vietnamese adults aged 22–35, friendly and confident, natural smiles, working alongside German colleagues, realistic skin texture, professional workwear appropriate to the trade.

---

### C1. Ảnh banner (12 ảnh)

Thư mục: `public\anh\banner\`

| Mã | Tên file | Tỷ lệ | Dùng ở |
|---|---|---|---|
| B-01 | `trang-chu-desktop.jpg` | 16:9 · 2560×1440 | Banner trang chủ, máy tính |
| B-02 | `trang-chu-mobile.jpg` | 9:16 · 1440×2560 | Banner trang chủ, điện thoại |
| B-03 | `don-hang.jpg` | 21:9 · 2560×1100 | Đầu trang Đơn hàng |
| B-04 | `du-hoc-nghe.jpg` | 21:9 | Đầu trang Du học nghề |
| B-05 | `nganh-nghe.jpg` | 21:9 | Đầu trang Ngành nghề |
| B-06 | `lo-trinh.jpg` | 21:9 | Đầu trang Lộ trình |
| B-07 | `dieu-kien.jpg` | 21:9 | Điều kiện & hồ sơ |
| B-08 | `cam-nang.jpg` | 21:9 | Cẩm nang |
| B-09 | `ve-chung-toi.jpg` | 21:9 | Về chúng tôi |
| B-10 | `doanh-nghiep.jpg` | 21:9 | Cho doanh nghiệp Đức |
| B-11 | `lien-he.jpg` | 21:9 | Liên hệ |
| B-12 | `ung-tuyen.jpg` | 21:9 | Ứng tuyển |

**B-01 — Banner trang chủ (máy tính)**
> Wide cinematic hero image for a Vietnamese–German recruitment platform. Left third is open bright sky for text. Right side: a group of four young Vietnamese professionals — a chef in white jacket, a nurse in scrubs with stethoscope, a technician in blue overalls holding a white hard hat, a student in a blazer holding a folder — standing confidently together, looking up and forward. Behind them the Brandenburg Gate and the Berlin TV Tower under a bright blue sky with soft white clouds, green trees, the Spree river with a stone bridge. A flowing German flag ribbon (black, red, gold) sweeps across the upper right corner. [phong cách] [người]

**B-02 — Banner trang chủ (điện thoại)**
> Vertical hero image, same scene and people as B-01 but composed for a phone screen: the group of four young Vietnamese professionals fills the lower two thirds, the Brandenburg Gate and Berlin TV Tower rise behind them, bright blue sky with clouds occupies the top third for text. [phong cách] [người]

**B-03 — Đơn hàng**
> Ultra-wide banner: a bright modern German workplace collage feel — a greenhouse row, a hotel kitchen, a logistics warehouse — blended softly, with a young Vietnamese worker in the foreground right smiling at the camera. Lots of open bright sky on the left for a headline. [phong cách] [người]

**B-04 — Du học nghề**
> Ultra-wide banner: a bright German vocational training workshop, young Vietnamese apprentices in workwear learning from a German master craftsman, tools and training benches, large windows with daylight, a small German flag on the wall. Open bright area on the left for a headline. [phong cách] [người]

**B-05 — Ngành nghề**
> Ultra-wide banner showing eight professions side by side in soft focus: cook, supermarket clerk, baker, butcher, electrician, warehouse worker, office professional, greenhouse grower — all young Vietnamese adults in the correct uniforms, arranged like a bright modern mosaic. [phong cách] [người]

**B-06 — Lộ trình**
> Ultra-wide banner: a symbolic journey from Vietnam to Germany — on the left a young Vietnamese person with a suitcase at an airport, in the middle an aeroplane climbing into a blue sky, on the right the Berlin skyline in warm morning light. Bright, hopeful, uncluttered. [phong cách] [người]

**B-07 — Điều kiện & hồ sơ**
> Ultra-wide banner: a bright desk scene — a German work visa application, a passport, certificates, a laptop, a cup of coffee, a small German flag — shot from above at a slight angle, natural daylight, clean and organised. [phong cách]

**B-08 — Cẩm nang**
> Ultra-wide banner: a young Vietnamese person studying German in a bright modern classroom or library in Germany, notebooks and a laptop, large windows, warm daylight, other students softly out of focus. [phong cách] [người]

**B-09 — Về chúng tôi**
> Ultra-wide banner: a bright modern office in Berlin with a large window overlooking the Brandenburg Gate, a mixed Vietnamese–German team of five talking around a meeting table, friendly and professional. [phong cách] [người]

**B-10 — Cho doanh nghiệp Đức**
> Ultra-wide banner: a German factory manager in a shirt shaking hands with a Vietnamese recruitment consultant in a suit on a bright modern production floor, both smiling, machinery softly out of focus behind. [phong cách] [người]

**B-11 — Liên hệ**
> Ultra-wide banner: the exterior of a modern glass office building at Potsdamer Platz Berlin on a bright sunny day, blue sky, people walking, a German flag on the façade. [phong cách]

**B-12 — Ứng tuyển**
> Ultra-wide banner: a young Vietnamese woman filling in an online application on a laptop at a bright desk at home, hopeful expression, a German language textbook and a passport beside the laptop, sunlight through the window. [phong cách] [người]

---

### C2. Ảnh 8 nhóm ngành (24 ảnh)

Thư mục: `public\anh\nganh\<ma-nganh>\`
Mỗi nhóm **3 ảnh**: `hero.jpg` (16:9 · 1920×1080), `doc.jpg` (3:4 · 1200×1600), `chi-tiet.jpg` (4:3 · 1600×1200).

| Mã thư mục | Nhóm ngành |
|---|---|
| `01-khach-san-nha-hang` | Khách sạn, nhà hàng và bếp |
| `02-sieu-thi-ban-le` | Chuỗi siêu thị và bán lẻ thực phẩm |
| `03-lam-banh` | Làm bánh và sản xuất bánh công nghiệp |
| `04-che-bien-thit` | Chế biến thịt và thực phẩm |
| `05-xay-dung-dien-co-khi` | Xây dựng, điện, cơ khí và hạ tầng |
| `06-logistics-kho-van` | Logistics, kho vận và lái xe |
| `07-chuyen-gia-dai-hoc` | Chuyên gia đại học theo §18b |
| `08-nong-nghiep-nha-kinh` | Nông nghiệp nhà kính và làm vườn |

**Prompt gốc — thay phần in đậm cho từng nhóm:**

> `hero.jpg` — Wide photograph of **[BỐI CẢNH]** in Germany, a young Vietnamese worker **[HÀNH ĐỘNG]** in the foreground, a German colleague working nearby, bright daylight through large windows, clean and modern. [phong cách] [người]
>
> `doc.jpg` — Vertical portrait of a single young Vietnamese **[NGHỀ]** in correct uniform at their workplace in Germany, looking at the camera with a calm confident smile, shallow depth of field, workplace softly out of focus behind. [phong cách] [người]
>
> `chi-tiet.jpg` — Close-up of the hands and tools of the trade: **[CHI TIẾT NGHỀ]**, sharp detail, natural light, no faces. [phong cách]

| Nhóm | [BỐI CẢNH] | [HÀNH ĐỘNG] | [NGHỀ] | [CHI TIẾT NGHỀ] |
|---|---|---|---|---|
| 01 | a busy professional hotel kitchen | plating a dish | chef | knives, herbs and a plated dish on a steel counter |
| 02 | a bright German supermarket aisle | stocking fresh produce shelves | supermarket employee | hands arranging fruit and a price scanner |
| 03 | an artisan German bakery at dawn | shaping bread dough | baker | hands shaping dough, flour dust, loaves on a wooden peel |
| 04 | a clean modern meat processing hall | working at a cutting station in white coat, hairnet and gloves | butcher | gloved hands with a knife on a stainless steel table |
| 05 | a German construction site with a crane | installing an electrical control cabinet | electrician | hands wiring a control panel, cable ties, a multimeter |
| 06 | a large automated logistics warehouse | scanning parcels beside a forklift | warehouse logistics worker | a barcode scanner, parcels and a pallet truck |
| 07 | a bright modern German engineering office | presenting on a screen to colleagues | engineer or IT specialist | a laptop, technical drawings and a coffee cup on a desk |
| 08 | a modern high-tech greenhouse full of vegetables | checking tomato plants with a tablet | greenhouse grower | hands checking a tomato truss, drip irrigation lines |

---

### C3. Ảnh đơn hàng (mỗi đơn 5 ảnh)

Thư mục: `public\anh\don-hang\<ma-don>\`
Mỗi đơn: `chinh.jpg` (16:9 · 1920×1080) + `viec-1.jpg` … `viec-4.jpg` (4:3 · 1200×900).

Ba đơn đang chạy:

| Mã thư mục | Đơn hàng | Ảnh chính | 4 ảnh "công việc thực tế" |
|---|---|---|---|
| `quan-ly-nha-kinh` | Quản lý nhà kính · 5 suất · 2.100–2.500 € | Hai người quản lý cầm tablet giữa nhà kính công nghệ cao | 1 giám sát sản xuất · 2 lập kế hoạch trồng trọt · 3 theo dõi chất lượng cây · 4 vận hành bền vững |
| `tho-bao-tri-nha-kinh` | Thợ bảo trì nhà kính · 5 suất · 2.000–2.400 € | Thợ bảo trì sửa hệ thống điện trong nhà kính | 1 kiểm tra hệ thống điện · 2 bảo dưỡng tưới tiêu, bơm nước · 3 bảo trì thông gió, sưởi ấm · 4 đảm bảo thiết bị vận hành ổn định |
| `cong-nhan-trong-rau` | Công nhân trồng rau củ quả · 40 suất · 2.000–2.400 € | Nữ công nhân trẻ thu hoạch cà chua trong nhà kính | 1 chăm sóc, tưới nước · 2 thu hoạch theo quy trình · 3 phân loại, đóng gói · 4 môi trường nhà kính hiện đại |

**Prompt mẫu (đơn `cong-nhan-trong-rau`, ảnh chính):**
> Wide photograph inside a modern Dutch-style high-tech greenhouse in Germany, endless rows of tomato and lettuce plants under bright daylight, a young Vietnamese woman in a green work apron and cap harvesting ripe tomatoes into a crate, smiling, a colleague working further down the row. [phong cách] [người]

**Prompt mẫu (ảnh việc 3 — phân loại, đóng gói):**
> Photograph of a young Vietnamese worker sorting and packing freshly harvested vegetables into crates on a stainless steel line inside a bright German greenhouse packing area, focused and careful. [phong cách] [người]

> Các đơn hàng mới lấy từ Drive sẽ bổ sung theo đúng mẫu này: một ảnh chính 16:9 và bốn ảnh việc 4:3.

---

### C4. Ảnh lộ trình (13 ảnh)

Thư mục: `public\anh\lo-trinh\`
Tỷ lệ 16:10 · 1600×1000.

**Luồng đi làm việc** — `lam-viec-1.jpg` … `lam-viec-6.jpg`

| Ảnh | Bước | Prompt |
|---|---|---|
| 1 | Tư vấn & định hướng | A Vietnamese consultant explaining job options to a young couple across a desk in a bright office in Vietnam, brochures and a laptop on the table |
| 2 | Chuẩn bị hồ sơ | Hands organising documents, certificates and a passport into a folder on a bright desk |
| 3 | Đào tạo & phỏng vấn | A young Vietnamese student in a German language class raising a hand, teacher at a whiteboard with German words |
| 4 | Làm thủ tục visa | A young Vietnamese man at a visa interview counter, handing documents to an officer, calm and confident |
| 5 | Xuất cảnh | A young Vietnamese worker with a suitcase walking through a bright airport departure hall, aeroplane visible through the window |
| 6 | Hỗ trợ tại Đức | A Vietnamese worker being welcomed by a German colleague at the workplace entrance, handshake, bright morning light |

**Luồng du học nghề** — `hoc-nghe-1.jpg` … `hoc-nghe-7.jpg`

| Ảnh | Bước | Prompt |
|---|---|---|
| 1 | Chọn ngành học nghề | A young Vietnamese student browsing vocational programmes on a laptop with a counsellor |
| 2 | Học tiếng Đức B1 | A German language classroom, young Vietnamese students practising conversation |
| 3 | Thi chứng chỉ | A young Vietnamese student taking a language exam in a bright exam hall |
| 4 | Ký hợp đồng đào tạo | A German company manager and a young Vietnamese apprentice signing a training contract |
| 5 | Xin visa học nghề | Documents for a German vocational training visa laid out on a desk with a passport |
| 6 | Nhập học tại Đức | A young Vietnamese apprentice on the first day at a German vocational school, backpack, friendly classmates |
| 7 | Tốt nghiệp & đi làm | A young Vietnamese apprentice in workwear receiving a certificate from a German master craftsman, proud smile |

---

### C5. Ảnh con người & minh hoạ (8 ảnh)

Thư mục: `public\anh\nguoi\`

| Mã | Tên file | Tỷ lệ | Prompt |
|---|---|---|---|
| N-01 | `ung-vien-nam.jpg` | 3:4 | Portrait of a young Vietnamese man in blue workwear holding a white hard hat, bright German workshop behind, confident smile |
| N-02 | `ung-vien-nu.jpg` | 3:4 | Portrait of a young Vietnamese woman in a nurse uniform with a stethoscope, bright German clinic corridor behind, warm smile |
| N-03 | `hoc-vien.jpg` | 3:4 | Portrait of a young Vietnamese student with a backpack and folder in front of a German vocational school building |
| N-04 | `tu-van-vien.jpg` | 3:4 | Portrait of a Vietnamese consultant in a navy blazer in a bright Berlin office, friendly and professional |
| N-05 | `doanh-nghiep-duc.jpg` | 16:9 | A German factory owner and HR manager talking on a bright production floor |
| N-06 | `lop-tieng-duc.jpg` | 16:9 | A bright German language classroom with young Vietnamese students and a German teacher |
| N-07 | `ky-tuc-xa.jpg` | 16:9 | A clean modern shared apartment for workers in Germany, tidy kitchen, daylight |
| N-08 | `doi-song-duc.jpg` | 16:9 | Young Vietnamese workers relaxing in a German city park on a sunny weekend, bicycles, laughter |

---

### C6. Nền và hoa văn (5 ảnh, PNG nền trong suốt)

Thư mục: `public\anh\nen\`

| Mã | Tên file | Mô tả |
|---|---|---|
| H-01 | `ribbon-co-duc.png` | Dải ruy-băng cờ Đức (đen–đỏ–vàng) uốn lượn, nền trong suốt, dùng ở góc banner |
| H-02 | `ve-quet-co-duc.png` | Vệt quét sơn ba màu cờ Đức kiểu cọ, nền trong suốt |
| H-03 | `may-trang.png` | Cụm mây trắng mềm, nền trong suốt, phủ đầu trang |
| H-04 | `duong-chan-troi-berlin.png` | Đường nét skyline Berlin một nét mảnh màu trắng, nền trong suốt, dùng ở chân trang |
| H-05 | `song-vang.png` | Dải sóng gradient vàng đồng, nền trong suốt, dùng ngăn giữa các khối |

---

## D. TỔNG KẾT SỐ LƯỢNG ẢNH

| Nhóm | Số ảnh |
|---|---|
| C1 Banner | 12 |
| C2 Ngành nghề (8 × 3) | 24 |
| C3 Đơn hàng (3 × 5) | 15 |
| C4 Lộ trình (6 + 7) | 13 |
| C5 Con người | 8 |
| C6 Nền & hoa văn | 5 |
| **Tổng** | **77** |

## E. CÂY THƯ MỤC CẦN TẠO SẴN

```
C:\Users\admin\nibelcgroup\public\anh\
├─ banner\
├─ nganh\
│  ├─ 01-khach-san-nha-hang\
│  ├─ 02-sieu-thi-ban-le\
│  ├─ 03-lam-banh\
│  ├─ 04-che-bien-thit\
│  ├─ 05-xay-dung-dien-co-khi\
│  ├─ 06-logistics-kho-van\
│  ├─ 07-chuyen-gia-dai-hoc\
│  └─ 08-nong-nghiep-nha-kinh\
├─ don-hang\
│  ├─ quan-ly-nha-kinh\
│  ├─ tho-bao-tri-nha-kinh\
│  └─ cong-nhan-trong-rau\
├─ lo-trinh\
├─ nguoi\
└─ nen\
```

## F. THỨ TỰ LÀM

1. Sếp duyệt phần B (form) và C (danh sách ảnh)
2. Agent tạo cây thư mục ở mục E và sinh 77 ảnh theo prompt
3. Tôi dựng bộ nhận diện V2 (màu, chữ, các mảnh dùng chung) và trang chủ
4. Dựng lần lượt các trang theo thứ tự: Đơn hàng → Chi tiết đơn → Ngành nghề → Du học nghề → Lộ trình → công cụ → còn lại
5. Kiểm tra từng trang ở 1440×900 và 390×844, chụp ảnh đối chiếu
