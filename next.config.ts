import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Headless Chromium for PDF export must stay a real node_module, not bundled.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/pdf": [
      "./styles/doodle.css",
      "./node_modules/@fontsource/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-*-normal.woff2",
      "./node_modules/@fontsource/bowlby-one/files/bowlby-one-latin-400-normal.woff2",
      "./node_modules/@fontsource/kalam/files/kalam-latin-*-normal.woff2",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
