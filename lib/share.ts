/** PDF export plus the iPhone/iPad/Mac share sheet, with a plain download everywhere else. */

export function pdfFileName(title: string, docLabel: string): string {
  const slug = `${title} ${docLabel}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${slug || "litsketch"}.pdf`;
}

export async function makePdf(html: string, title: string, fileName: string, answers = false): Promise<File> {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, title, lang: "en", answers }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "LitSketch couldn't make the PDF. Use the Print button instead.");
  }
  const blob = await res.blob();
  return new File([blob], fileName, { type: "application/pdf" });
}

/** Apple devices and touch devices get the share sheet (AirDrop, Mail, Save to Files). */
export function shouldUseShareSheet(file: File): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) return false;
  try {
    if (!navigator.canShare({ files: [file] })) return false;
  } catch {
    return false;
  }
  const apple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  const touch = navigator.maxTouchPoints > 0 && matchMedia("(pointer: coarse)").matches;
  return apple || touch;
}

export async function shareFile(file: File, title: string): Promise<"shared" | "cancelled"> {
  try {
    await navigator.share({ files: [file], title });
    return "shared";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    throw err;
  }
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
