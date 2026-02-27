import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 30;

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form
      .getAll("files")
      .filter((v): v is File => v instanceof File && v.size > 0);

    if (files.length < 2) {
      return new Response("Please upload at least 2 PDF files.", { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return new Response(`Maximum ${MAX_FILES} files are allowed.`, { status: 400 });
    }

    for (const file of files) {
      if (!isPdf(file)) {
        return new Response(`Invalid file type: ${file.name}`, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return new Response(`File exceeds 50MB: ${file.name}`, { status: 400 });
      }
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    return new Response(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="merged_${Date.now()}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Something went wrong while merging.", { status: 500 });
  }
}
