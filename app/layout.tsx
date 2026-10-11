import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "./globals.css";
import { DisplaySetting } from "@/components/DisplaySetting";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "LitSketch: printable doodle notes from any passage",
  description:
    "LitSketch by AmplifiED turns a reading passage into accessible, printable doodle notes for grades 6 to 12, aligned to Florida B.E.S.T. ELA benchmarks.",
  applicationName: "LitSketch",
  appleWebApp: { capable: true, title: "LitSketch", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b6b66" },
    { media: "(prefers-color-scheme: dark)", color: "#10151e" },
  ],
};

// Applies the saved display choice before first paint so the page never flashes.
const themeScript = `try{var t=localStorage.getItem("litsketch:theme");if(t==="light"||t==="dark"||t==="contrast")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="no-print">
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <header className="site-header">
            <Link className="brand" href="/" aria-label="LitSketch home">
              <BrandMark />
              <span className="brand-name">
                LitSketch<span className="brand-by">by AmplifiED</span>
              </span>
            </Link>
            <DisplaySetting />
          </header>
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer">
            <p>
              LitSketch is a teacher tool. It never collects student information. Use passages you own or works in the
              public domain.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
