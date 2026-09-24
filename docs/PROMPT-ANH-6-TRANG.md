# Sáu prompt tạo ảnh bìa cho NIBELC

Dán **từng prompt một, mỗi ảnh một chat mới**. Prompt cố ý ngắn — prompt dài
(kiểu "STYLE CONTRACT" ~1.400 ký tự) từng bị công cụ ảnh từ chối với thông báo
*"The user asked to edit or restore a specific existing image…"*.

**Luật chung đã nằm sẵn trong từng prompt:** tỷ lệ `16:9`, không chữ, không
logo, bối cảnh Đức, có người gốc Á làm việc cùng đồng nghiệp bản địa.

Ảnh 16:9 ChatGPT trả ra đều đặn **1672×941** — đủ dùng cho hero.

---

## 1. Trang chủ — `01-home.jpg`

> Photo, 16:9. A German businesswoman and a young Vietnamese man in business
> attire talking at a bright modern office table, Berlin skyline through the
> window behind them. Natural light, documentary style, no text, no logos.

## 2. Đơn tuyển — `02-jobs.jpg`

> Photo, 16:9. A Vietnamese worker and a German colleague harvesting tomatoes
> in a large modern commercial greenhouse, bright daylight through the glass
> roof. Documentary style, no text, no logos.

## 3. Ngành nghề — `03-industries.jpg`

> Photo, 16:9. A group of workers in different work clothes — chef whites, a
> hi-vis vest, a warehouse jacket — standing together in a bright industrial
> hall in Germany, relaxed and confident. No text, no logos.

## 4. Lộ trình — `04-process.jpg`

> Photo, 16:9. An advisor explaining documents at a desk to a young Vietnamese
> couple in a bright German office, calm and friendly. Documentary style, no
> text, no logos.

## 5. Về NIBELC — `05-about.jpg`

> Photo, 16:9. A diverse team of six people in a bright modern Berlin office
> standing near large windows, daylight, relaxed working atmosphere. No text,
> no logos.

## 6. Liên hệ — `06-contact.jpg`

> Photo, 16:9. A friendly receptionist at the front desk of a bright modern
> German office greeting a visitor, warm daylight. Documentary style, no text,
> no logos.

---

## Soát giữa chừng — bắt buộc

Sau **3 ảnh đầu** dừng lại mở xem bằng mắt: đúng bối cảnh Đức chưa, có người
gốc Á chưa, có lọt chữ hay logo không. Sai thì sửa prompt rồi mới chạy tiếp.

Bài học 15/09: bộ 158 ảnh concert chạy một mạch không soát, cuối cùng 119 ảnh
trùng bối cảnh, phí ~110 lượt Plus.

## Chỗ lưu

Ảnh về thì đặt vào `public/hero/` đúng tên file ở trên. Code đã trỏ sẵn —
chỉ cần đúng tên là trang tự dùng, không phải sửa gì.
