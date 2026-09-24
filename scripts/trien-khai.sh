#!/bin/bash
# Triển khai NIBELC TalentBridge lên VPS ovh-fra (57.129.45.199).
#
# Chạy TRÊN máy chủ:   bash /opt/nibelc/scripts/trien-khai.sh
# Chạy TỪ máy trạm:    ssh ovh-fra 'bash /opt/nibelc/scripts/trien-khai.sh'
#
# Bố trí trên máy chủ:
#   /opt/nibelc        mã nguồn (clone từ GitHub, nhánh main)
#   /opt/nibelc-data   dữ liệu biểu mẫu gửi về — NẰM NGOÀI mã nguồn để
#                      `git pull` không bao giờ đụng vào
#   pm2 "nibelc"       chạy `next start -p 3460`
#   nginx              /etc/nginx/sites-available/nibelc → cổng 3460
set -euo pipefail

APP_DIR=/opt/nibelc
DATA_DIR=/opt/nibelc-data
PORT=3460
SITE_URL=https://www.nibelcgermany.de

cd "$APP_DIR"

echo "==> lấy mã mới"
git fetch --depth 1 origin main
git reset --hard origin/main
git log --oneline -1

echo "==> cài gói"
npm ci --no-audit --no-fund

echo "==> build"
NODE_ENV=production NEXT_PUBLIC_SITE_URL="$SITE_URL" npm run build

echo "==> khởi động lại"
mkdir -p "$DATA_DIR"
if pm2 describe nibelc >/dev/null 2>&1; then
  pm2 restart nibelc --update-env
else
  PORT="$PORT" NIBELC_DATA_DIR="$DATA_DIR" NEXT_PUBLIC_SITE_URL="$SITE_URL" \
    pm2 start node_modules/next/dist/bin/next --name nibelc -- start -p "$PORT"
fi
pm2 save >/dev/null

sleep 3
code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/")
echo "==> trang trả về HTTP $code"
[ "$code" = "200" ] || { echo "LỖI: trang không trả 200"; pm2 logs nibelc --lines 30 --nostream; exit 1; }

echo "==> xong"
