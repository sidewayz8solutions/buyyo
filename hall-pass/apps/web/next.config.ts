import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@hallpass/game-engine",
    "@hallpass/ai-npcs",
    "@hallpass/shared-ui",
    "@hallpass/iap-core",
    "react-native-web",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    };
    return config;
  },
};

export default nextConfig;
