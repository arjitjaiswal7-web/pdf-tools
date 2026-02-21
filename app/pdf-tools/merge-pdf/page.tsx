"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files.");
      return;
    }

    try {
      setLoading(true);
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>Merge PDF</h1>
      <p style={{ marginBottom: "20px" }}>
        Select multiple PDF files to merge.
      </p>

      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFiles}
      />

      <br /><br />

      <button
        onClick={mergePDFs}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Merging..." : "Merge PDFs"}
      </button>
    </div>
  );
}