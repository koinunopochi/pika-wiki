import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare doesn't support image optimization
  images: {
    unoptimized: true,
  },
  
  // For better URL handling
  trailingSlash: false,
  
  // Ensure proper static generation
  generateBuildId: async () => {
    return 'pika-wiki-build';
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
