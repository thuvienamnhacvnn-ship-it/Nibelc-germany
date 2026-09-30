import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 92],
  },
  typedRoutes: true,
  // Máy này chặn native binding của Turbopack, nên build và dev đều chạy webpack
  // (đã ghim sẵn cờ --webpack trong package.json).
};

export default nextConfig;
