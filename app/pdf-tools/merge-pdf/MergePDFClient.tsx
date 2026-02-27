"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FilePlus,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Download,
  AlertCircle,
  Combine,
  Scissors,
  Minimize2,
  Edit3,
  ArrowRight,
} from "lucide-react";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  lastModified: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 30;
const SERVER_FALLBACK_THRESHOLD = 80 * 1024 * 1024; // 80MB total

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function formatSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function downloadPdf(bytes: Uint8Array | ArrayBuffer) {
  // ensure we hand a plain ArrayBuffer to the Blob constructor
  const buffer = bytes instanceof Uint8Array ? (bytes.buffer as ArrayBuffer) : bytes;
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `merged_${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MergePDFClient() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + f.size, 0),
    [files]
  );

  const addFiles = async (newFiles: File[]) => {
    if (!newFiles.length) return;

    const existing = new Set(files.map((f) => `${f.name}_${f.size}_${f.lastModified}`));
    const accepted: PDFFile[] = [];
    const rejected: string[] = [];

    for (const file of newFiles) {
      const key = `${file.name}_${file.size}_${file.lastModified}`;

      if (existing.has(key)) {
        rejected.push(`${file.name}: duplicate file`);
        continue;
      }
      if (!isPdf(file)) {
        rejected.push(`${file.name}: not a PDF`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: exceeds 50MB`);
        continue;
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
      });
      existing.add(key);
    }

    setFiles((prev) => {
      const merged = [...prev, ...accepted];
      if (merged.length > MAX_FILES) {
        setError(`Only ${MAX_FILES} files are allowed. Extra files were skipped.`);
        return merged.slice(0, MAX_FILES);
      }
      return merged;
    });

    if (rejected.length) {
      setError(rejected.slice(0, 3).join(" | "));
    } else {
      setError(null);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    await addFiles(selected);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const updated = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= updated.length) return prev;
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return updated;
    });
  };

  const mergeOnMainThread = async (input: PDFFile[]) => {
    const { PDFDocument } = await import("pdf-lib");
    const mergedPdf = await PDFDocument.create();

    for (const pdfFile of input) {
      const buffer = await pdfFile.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  };

  const mergeWithWorker = async (input: PDFFile[]) => {
    if (typeof Worker === "undefined") {
      throw new Error("Web Worker not supported.");
    }

    const buffers = await Promise.all(input.map((f) => f.file.arrayBuffer()));

    return await new Promise<Uint8Array>((resolve, reject) => {
      const worker = new Worker(new URL("./merge-worker.ts", import.meta.url), {
        type: "module",
      });

      worker.onmessage = (event: MessageEvent<{ ok: boolean; merged?: ArrayBuffer; error?: string }>) => {
        const data = event.data;
        worker.terminate();

        if (!data.ok || !data.merged) {
          reject(new Error(data.error || "Worker merge failed."));
          return;
        }

        resolve(new Uint8Array(data.merged));
      };

      worker.onerror = () => {
        worker.terminate();
        reject(new Error("Worker crashed."));
      };

      worker.postMessage({ buffers }, buffers);
    });
  };

  const mergeOnServerFallback = async (input: PDFFile[]) => {
    const formData = new FormData();
    input.forEach((f) => formData.append("files", f.file, f.name));

    const res = await fetch("/api/pdf-tools/merge-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Server merge failed.");
    }

    return new Uint8Array(await res.arrayBuffer());
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files.");
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      let mergedBytes: Uint8Array;

      if (totalSize > SERVER_FALLBACK_THRESHOLD) {
        mergedBytes = await mergeOnServerFallback(files);
      } else {
        try {
          mergedBytes = await mergeWithWorker(files);
        } catch {
          try {
            mergedBytes = await mergeOnMainThread(files);
          } catch {
            mergedBytes = await mergeOnServerFallback(files);
          }
        }
      }

      downloadPdf(mergedBytes);
      setFiles([]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong while merging.";
      setError(message);
    } finally {
      setIsMerging(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    void addFiles(dropped);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fbff] to-[#eef3ff]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black mb-4">
            Merge PDF Files Online
          </h1>
          <p className="text-lg text-gray-500">
            Combine multiple PDFs into one secure document fast with browser-first processing.
          </p>
        </div>

        {files.length === 0 ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all rounded-3xl p-16 text-center cursor-pointer bg-white shadow-sm hover:shadow-md"
          >
            <FilePlus className="mx-auto mb-4 text-indigo-600" size={40} />
            <p className="text-lg font-medium">Click to upload or drag PDFs</p>
            <p className="text-sm text-gray-400 mt-2">Max 50MB per file</p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {files.length} file{files.length > 1 && "s"} selected ({formatSize(totalSize)})
              </p>

              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-medium hover:bg-indigo-100 transition"
              >
                <FilePlus size={16} />
                Add More PDFs
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="bg-white rounded-3xl shadow border">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between px-6 py-4 border-b last:border-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <FileText size={20} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="disabled:opacity-30"
                      aria-label="Move file up"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="disabled:opacity-30"
                      aria-label="Move file down"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500"
                      aria-label="Remove file"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="text-center pt-4">
              <button
                onClick={mergePDFs}
                disabled={isMerging || files.length < 2}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all disabled:opacity-50"
              >
                {isMerging ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center gap-3 justify-center">
                    Merge PDFs <Download size={20} />
                  </span>
                )}
              </button>
            </div>

            {files.length < 2 && (
              <p className="text-center text-sm text-gray-400">
                Add at least 2 files to merge
              </p>
            )}
          </div>
        )}

        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-center mb-8">Related PDF Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Split PDF", icon: Scissors, href: "/pdf-tools/split-pdf", color: "from-blue-500 to-indigo-500" },
              { title: "Compress PDF", icon: Minimize2, href: "/pdf-tools/compress-pdf", color: "from-green-500 to-emerald-500" },
              { title: "Edit PDF", icon: Edit3, href: "/pdf-tools/edit-pdf", color: "from-purple-500 to-indigo-500" },
              { title: "Merge PDF", icon: Combine, href: "/pdf-tools/merge-pdf", color: "from-orange-500 to-red-500" },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative flex min-h-[230px] flex-col overflow-hidden bg-white rounded-2xl p-8 shadow-md border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div
                    className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${tool.color} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                  />

                  <div
                    className={`relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}
                  >
                    <Icon size={24} />
                  </div>

                  <h4 className="mt-6 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {tool.title}
                  </h4>

                  <div className="mt-auto pt-4 h-7">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                      Open tool
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
