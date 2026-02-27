/// <reference lib="webworker" />

import { PDFDocument } from "pdf-lib";

type Req = { buffers: ArrayBuffer[] };
type Res = { ok: true; merged: ArrayBuffer } | { ok: false; error: string };

self.onmessage = async (event: MessageEvent<Req>) => {
  try {
    const { buffers } = event.data;
    const mergedPdf = await PDFDocument.create();

    for (const buffer of buffers) {
      const pdf = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const bytes = await mergedPdf.save();
    const merged = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

    const payload: Res = { ok: true, merged };
    (self as DedicatedWorkerGlobalScope).postMessage(payload, [merged]);
  } catch (err) {
    const payload: Res = {
      ok: false,
      error: err instanceof Error ? err.message : "Worker merge failed.",
    };
    (self as DedicatedWorkerGlobalScope).postMessage(payload);
  }
};
