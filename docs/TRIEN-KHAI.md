# Triển khai

## Máy chủ

| | |
|---|---|
| VPS | ovh-fra · `57.129.45.199` (dùng chung với itw-berlin, vd-hotel, viet-duc-group) |
| Mã nguồn | `/opt/nibelc` — clone từ `github.com/thuvienamnhacvnn-ship-it/Nibelc-germany`, nhánh `main` |
| Dữ liệu biểu mẫu | `/opt/nibelc-data` — **ngoài** mã nguồn, `git pull` không đụng tới |
| Tiến trình | pm2 `nibelc` → `next start -p 3460` |
| nginx | `/etc/nginx/sites-available/nibelc` → `127.0.0.1:3460` |
| Tên miền | `nibelcgermany.de` (Namecheap) |

## Cập nhật sau khi push mã mới

```bash
ssh ovh-fra 'bash /opt/nibelc/scripts/trien-khai.sh'
```

Script tự lấy mã, cài gói, build, khởi động lại pm2 và kiểm tra trang trả về 200;
nếu không 200 thì in nhật ký và dừng với mã lỗi.

## Tên miền và HTTPS

Bản ghi DNS cần có ở Namecheap (Domain List → Manage → Advanced DNS):

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `57.129.45.199` | Automatic |
| A Record | `www` | `57.129.45.199` | Automatic |

Sau khi DNS đã về (kiểm bằng `nslookup nibelcgermany.de 1.1.1.1`):

```bash
ssh ovh-fra 'sudo certbot --nginx -d nibelcgermany.de -d www.nibelcgermany.de'
```

certbot tự chèn khối 443 và phần chuyển hướng HTTP→HTTPS vào file vhost.
Gia hạn chạy tự động qua systemd timer của certbot.

## Lưu ý khi sửa cấu hình nginx từ Windows

Ghi file qua PowerShell sẽ kèm BOM và nginx báo `unknown directive "﻿#"`.
Gỡ bằng:

```bash
sudo sed -i '1s/^\xEF\xBB\xBF//' /etc/nginx/sites-available/nibelc
```

Ba site khác dùng chung nginx này — luôn `sudo nginx -t` trước khi `reload`.

## Biến môi trường

| Biến | Giá trị trên máy chủ | Dùng cho |
|---|---|---|
| `PORT` | `3460` | cổng Next.js |
| `NIBELC_DATA_DIR` | `/opt/nibelc-data` | nơi ghi dữ liệu hai biểu mẫu |
| `NEXT_PUBLIC_SITE_URL` | `https://www.nibelcgermany.de` | canonical, sitemap, hreflang |

Chưa có SMTP: biểu mẫu chỉ ghi vào `NIBELC_DATA_DIR/*.jsonl`. Khi có hộp thư,
thêm bước gửi mail trong `lib/anfragen.ts` (`saveAnfrage`).
