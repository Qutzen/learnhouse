import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "qutzen-lms.t3.tigrisfiles.io",
        port: "",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
