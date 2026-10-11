import type { Metadata } from "next";
import { Gallery } from "./Gallery";

export const metadata: Metadata = {
  title: "LitSketch illustration review",
  description: "Every object and icon in the LitSketch illustration library, for review.",
  robots: { index: false, follow: false },
};

export default function IllustrationsPage() {
  return <Gallery />;
}
