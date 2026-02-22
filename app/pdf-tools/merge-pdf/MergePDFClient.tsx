"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
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
  Edit,
} from "lucide-react";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* -------------------- YOUR ORIGINAL LOGIC (UNCHANGED) -------------------- */

  const addFiles = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length === 0) {
      setError("Please upload valid PDF files.");
      return;
    }

    try {
      const processed = pdfFiles.map((file) => {
        if (file.size > 50 * 1024 * 1024) {
          throw new Error("Max file size is 50MB.");
        }

        return {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
        };
      });

      setFiles((prev) => [...prev, ...processed]);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(e.target.files || []);
    await addFiles(selected);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const updated = [...files];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setFiles(updated);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files.");
      return;
    }

    try {
      setIsMerging(true);
      setError(null);

      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const buffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes as BlobPart], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while merging.");
    } finally {
      setIsMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
    );
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f8fbff] to-[#eef3ff]">

      {/* HERO */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black mb-4">
            Merge PDF Files Online
          </h1>

          <h2 className="text-lg text-gray-500">
            Combine multiple PDFs into one secure document —
            fast and completely browser-based.
          </h2>
        </div>

        {files.length === 0 ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all rounded-3xl p-16 text-center cursor-pointer bg-white shadow-sm hover:shadow-md"
          >
            <FilePlus className="mx-auto mb-4 text-indigo-600" size={40} />
            <p className="text-lg font-medium">
              Click to upload or drag PDFs
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Max file size: 50MB
            </p>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <div className="space-y-6">

            {/* Add More */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {files.length} file{files.length > 1 && "s"} selected
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
              accept=".pdf"
              className="hidden"
              onChange={handleInputChange}
            />

            {/* File List */}
            <div className="bg-white rounded-3xl shadow border">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between px-6 py-4 border-b last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <FileText size={20} />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {formatSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="disabled:opacity-30"
                    >
                      <ArrowUp size={18} />
                    </button>

                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="disabled:opacity-30"
                    >
                      <ArrowDown size={18} />
                    </button>

                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500"
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

        {/* PREMIUM RELATED TOOLS (Same Card Style) */}
        <div className="mt-24">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Related PDF Tools
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Split PDF",
                icon: Scissors,
                href: "/pdf-tools/split-pdf",
                color: "from-blue-500 to-indigo-500",
              },
              {
                title: "Compress PDF",
                icon: Minimize2,
                href: "/pdf-tools/compress-pdf",
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Edit PDF",
                icon: Edit,
                href: "/pdf-tools/edit-pdf",
                color: "from-purple-500 to-indigo-500",
              },
              {
                title: "Combine PDF",
                icon: Combine,
                href: "/pdf-tools",
                color: "from-orange-500 to-red-500",
              },
            ].map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={index}
                  href={tool.href}
                  className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div
                    className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition duration-500`}
                  />

                  <div
                    className={`relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}
                  >
                    <Icon size={24} />
                  </div>

                  <h4 className="mt-6 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {tool.title}
                  </h4>

                  <div className="mt-3 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                    SELECT TOOL ⚡
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