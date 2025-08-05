import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages doesn't support image optimization
  images: {
    unoptimized: true,
  },
  
  // Generate index.html files for each route
  trailingSlash: true,
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
