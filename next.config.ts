import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/game-covers/**", search: "?v=2" },
    ],
  },
};

export default nextConfig;
