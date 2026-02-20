"use client";

import { useState } from "react";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleMerge = async () => {
    if (files.length === 0) return alert("Please select PDFs");

    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/merge", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();

    setLoading(false);
  };

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>Merge PDF Tool</h1>

      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleMerge} disabled={loading}>
        {loading ? "Merging..." : "Merge PDFs"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {files.map((file, index) => (
          <p key={index}>{file.name}</p>
        ))}
      </div>
    </main>
  );
}
