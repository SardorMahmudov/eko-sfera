import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Monorepo ildizini aniq ko'rsatish (bir nechta lockfile ogohlantirishini yo'qotadi)
  turbopack: {
    root: path.join(__dirname, "..", ".."),
  },
};

export default nextConfig;
