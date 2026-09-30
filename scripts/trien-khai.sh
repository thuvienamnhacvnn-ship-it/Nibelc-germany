#!/bin/bash
# Triển khai nibelcgermany.de lên VPS ovh-fra (57.129.45.199).
#
# Chạy TỪ máy trạm:  ssh ovh-fra 'bash /opt/nibelc/scripts/trien-khai.sh'
#
# Bố trí trên máy chủ:
#   /opt/nibelc        mã nguồn, clone từ GitHub nhánh main
#   pm2 "nibelc"       chạy `next start -p 3460`
#   nginx              nibelcgermany.de → 127.0.0.1:3460
set -euo pipefail

APP_DIR=/opt/nibelc
PORT=3460
SITE_URL=https://www.nibelcgermany.de

cd "$APP_DIR"

echo "==> commit đang chạy (ghi lại để quay về nếu cần)"
git log --oneline -1 || true

echo "==> lấy mã mới"
git fetch origin main
git reset --hard origin/main
git log --oneline -1

echo "==> cài gói"
npm ci --no-audit --no-fund

# Next lưu ảnh đã tối ưu THEO TÊN FILE. Thay ảnh mà giữ nguyên tên thì nó vẫn
# trả bản cũ — đã dính nhiều lần ở máy trạm.
echo "==> xoá cache ảnh đã tối ưu"
rm -rf .next/cache/images

# Turbopack chết trên môi trường này, build phải đi đường webpack (npm script
# đã ghim sẵn --webpack, đừng gọi thẳng `next build`).
echo "==> build"
NODE_ENV=production NEXT_PUBLIC_SITE_URL="$SITE_URL" npm run build

echo "==> khởi động lại"
if pm2 describe nibelc >/dev/null 2>&1; then
  pm2 restart nibelc --update-env
else
  PORT="$PORT" NEXT_PUBLIC_SITE_URL="$SITE_URL" \
    pm2 start node_modules/next/dist/bin/next --name nibelc -- start -p "$PORT"
fi
pm2 save

echo "==> kiểm tra"
sleep 3
curl -sS -o /dev/null -w 'localhost:%{http_code}\n' "http://127.0.0.1:$PORT/"
