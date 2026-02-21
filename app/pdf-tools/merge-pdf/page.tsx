"use client";

import React, { useState, useRef } from "react";
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

  // Add Files
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
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
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

    [updated[index], updated[target]] = [
      updated[target],
      updated[index],
    ];

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

      // Vercel-safe fix
      const blob = new Blob(
        [mergedBytes as BlobPart],
        { type: "application/pdf" }
      );

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
      (bytes / Math.pow(1024, i)).toFixed(2) +
      " " +
      sizes[i]
    );
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Merge PDF Files
          </h1>
          <p className="text-gray-500 text-lg">
            Combine multiple PDFs into one — fast, secure and
            completely browser-based.
          </p>
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

            {/* Add More Button */}
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
                      <p className="font-medium">
                        {file.name}
                      </p>
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

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Merge Button */}
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
      </div>
    </div>
  );
}