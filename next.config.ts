import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 92],
  },
  typedRoutes: true,
  // Chấm tròn "N" của Next dev nằm đúng góc trái dưới — ở khổ điện thoại nó đè
  // lên mục "Trang chủ" của menu đáy, Sếp xem bản dev tưởng menu hỏng.
  // Bản production không có chấm này; tắt đi để bản dev nhìn đúng như bản thật.
  devIndicators: false,
  // Máy này chặn native binding của Turbopack, nên build và dev đều chạy webpack
  // (đã ghim sẵn cờ --webpack trong package.json).
};

export default nextConfig;
