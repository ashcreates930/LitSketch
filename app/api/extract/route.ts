import mammoth from "mammoth";
import { extractPdf } from "@/lib/extract/pdf";
import { clientKey, rateLimited, sameOrigin } from "@/lib/rate-limit";

export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024; // Vercel request bodies top out at 4.5 MB

function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("This request came from outside LitSketch.", 403);
  if (rateLimited(`extract:${clientKey(req)}`, 60, 60 * 60 * 1000)) {
    return fail("Too many uploads this hour. Please wait a few minutes.", 429);
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return fail("That file could not be read. Try saving it again, or paste the text instead.");
  }
  if (!file) return fail("No file was attached. Please choose a file.");
  if (file.size > MAX_BYTES) return fail("That file is larger than 4 MB. Try a smaller file, or paste the text instead.");

  const name = file.name.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());

  try {
    let text = "";
    let heading: string[] = [];
    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
      text = result.value;
    } else if (name.endsWith(".pdf")) {
      ({ text, heading } = await extractPdf(bytes));
    } else if (name.endsWith(".txt")) {
      text = new TextDecoder().decode(bytes);
    } else {
      return fail("LitSketch can read .docx (Word), .pdf, and .txt files.");
    }

    text = text.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) {
      return fail(
        name.endsWith(".pdf")
          ? "This PDF looks like a scanned picture, so LitSketch can't read its words. Please paste the text instead."
          : "That file has no text in it. Please paste the passage instead.",
      );
    }
    // heading: title/author lines found above the text, used only as a hint for the real title
    return Response.json({ text, heading });
  } catch (err) {
    console.error("extract failed", err);
    return fail("That file could not be read. Try saving it again, or paste the text instead.");
  }
}
