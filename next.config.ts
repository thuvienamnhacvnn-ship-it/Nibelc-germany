import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 không hydrate khi mở bằng 127.0.0.1 nếu origin không được khai báo.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Ảnh nền banner phủ cả màn hình; mức 75 mặc định làm nhoè bầu trời.
    qualities: [75, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
  },
  typedRoutes: true,
  // Cho phép build ra thư mục khác để không đụng .next của máy chủ thử.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
