# 6. Prompt mẫu cho ChatGPT sinh ảnh

## Câu lệnh Sếp dán kèm

```text
Hãy tạo bộ ảnh website cho NIBELC theo hồ sơ ngành tôi cung cấp.

QUY TẮC CỨNG:
1. Không tự nghĩ ra bất kỳ thông tin nào đang đánh dấu [CẦN ĐIỀN]. Nếu thiếu dữ liệu, dừng đúng phần đó và liệt kê câu hỏi cần xác nhận.
2. Dùng chính xác tên nghề tiếng Đức trong hồ sơ để khóa đúng workplace và công cụ.
3. Phong cách ảnh phóng sự/editorial chân thực tại Đức. Luôn thể hiện người gốc Á làm việc bình đẳng cùng đồng nghiệp bản địa Đức.
4. Không có chữ đọc được trong ảnh. Không logo/nhãn hiệu thật. Không cờ. Không bối cảnh châu Á. Không hiệu ứng khoa học viễn tưởng.
5. PPE, dụng cụ, thao tác và workplace phải đúng nghề, an toàn và hợp lý.
6. Mỗi ngành tạo bốn file riêng: 01 hero ngang 16:9; 02 dọc 3:4 thao tác nghề; 03 dọc 3:4 teamwork; 04 cận cảnh tay nghề.
7. Không ghép bốn ảnh thành contact sheet. Trả từng ảnh riêng và dùng đúng tên file.
8. Sau khi tạo, tự kiểm tra từng ảnh theo checklist và tạo lại ảnh vi phạm.

Đọc lần lượt: 02-8-NHOM-NGANH.md và 03-LUAT-SINH-ANH.md. Chỉ xử lý ngành tôi chỉ định. Không sinh ảnh cho ngành 07 khi [CẦN ĐIỀN 02] chưa được chốt.
```

## Prompt nền dùng cho từng ảnh

```text
Use case: photorealistic-natural
Asset type: NIBELC workforce website, [FILE ROLE], aspect ratio [RATIO]
Location: an authentic professional workplace in Germany, clearly European/German environment, no Asian setting
Profession: [EXACT GERMAN OCCUPATION]
Scene: [SCENE FROM INDUSTRY PROFILE]
People: a Vietnamese/Asian professional working naturally and at equal professional standing with a local German colleague; authentic candid interaction
Style: premium documentary editorial photography, natural skin and body proportions, real workplace texture, credible occupational detail
Composition: [WIDE / PORTRAIT / CLOSE-UP], usable negative space where relevant, no staged handshake
Lighting: realistic workplace or daylight, calm and confident mood
Constraints: occupationally correct tools, PPE and safe procedure; no readable text anywhere; no real brand logos; no flags; no watermark
Avoid: Asian architecture or street context, stock-photo posing, stereotypes, sci-fi effects, floating icons, fake UI, malformed hands, unsafe work
```

## Biến thể 4 ảnh

- Hero: wide environmental shot; hai người đang cùng giải quyết công việc; workplace nhận diện rõ; negative space cho headline.
- Portrait work: tập trung người lao động gốc Việt đang thực hiện đúng thao tác; đồng nghiệp Đức có thể ở nền.
- Portrait team: khoảnh khắc trao đổi/kiểm tra cùng nhau; vai trò bình đẳng; không bắt tay tạo dáng.
- Close-up: tay, công cụ và vật liệu/quy trình; không lộ nhãn hoặc chữ; kỹ thuật chính xác.

## Prompt riêng ngành 07

Không có prompt cho đến khi `[CẦN ĐIỀN 02]` được xác nhận. Sau đó tạo một bộ prompt riêng cho từng ngành đại học, không dùng một workplace chung.

