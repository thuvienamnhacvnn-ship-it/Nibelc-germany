#!/bin/bash
# Quay web về một bản cũ trên VPS.
#
#   ssh ovh-fra 'bash /opt/nibelc/scripts/khoi-phuc.sh <mã-commit>'
#
# Không truyền mã thì lùi về commit ngay trước bản đang chạy (HEAD~1).
# Script chỉ đổi mã nguồn + build lại; dữ liệu biểu mẫu ở /opt/nibelc-data
# không bị đụng tới.
set -euo pipefail

APP_DIR=/opt/nibelc
DATA_DIR=/opt/nibelc-data
PORT=3460
SITE_URL=https://www.nibelcgermany.de

cd "$APP_DIR"
TARGET="${1:-HEAD~1}"

echo "==> đang chạy: $(git log --oneline -1)"
git fetch origin main --quiet || true
git reset --hard "$TARGET"
echo "==> quay về:  $(git log --oneline -1)"

npm ci --no-audit --no-fund
NODE_ENV=production NEXT_PUBLIC_SITE_URL="$SITE_URL" npm run build

mkdir -p "$DATA_DIR"
pm2 restart nibelc --update-env
pm2 save >/dev/null

sleep 3
code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/")
echo "==> trang trả về HTTP $code"
[ "$code" = "200" ] || { echo "LỖI: trang không trả 200"; pm2 logs nibelc --lines 30 --nostream; exit 1; }
echo "==> đã khôi phục"
