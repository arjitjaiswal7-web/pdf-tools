"use client";

import { useState } from "react";
import {
  Image,
  FileText,
  Scissors,
  Combine,
  Minimize2,
  Edit,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";

const tools = [
  { title: "Merge PDF", description: "Combine PDFs in seconds.", icon: Combine, category: "Edit", color: "from-orange-500 to-red-500", href: "/pdf-tools/merge-pdf" },
  { title: "Split PDF", description: "Extract or divide PDF pages easily.", icon: Scissors, category: "Edit", color: "from-blue-500 to-indigo-500", href: "/pdf-tools/split-pdf" },
  { title: "Edit PDF", description: "Modify text and images inside PDF.", icon: Edit, category: "Edit", color: "from-purple-500 to-indigo-500", href: "/pdf-tools/edit-pdf" },
  { title: "Compress PDF", description: "Reduce file size without losing quality.", icon: Minimize2, category: "Optimize", color: "from-green-500 to-emerald-500", href: "/pdf-tools/compress-pdf" },
  { title: "JPG to PDF", description: "Convert JPG images into PDFs.", icon: Image, category: "Convert", color: "from-pink-500 to-rose-500", href: "/pdf-tools/jpg-to-pdf" },
  { title: "PDF to Word", description: "Convert PDFs into Word files.", icon: FileText, category: "Convert", color: "from-indigo-500 to-blue-600", href: "/pdf-tools/pdf-to-word" },
  { title: "Word to PDF", description: "Convert Word into PDF.", icon: FileText, category: "Convert", color: "from-cyan-500 to-blue-500", href: "/pdf-tools/word-to-pdf" },
  { title: "PDF to JPG", description: "Export PDF pages as JPG.", icon: Image, category: "Convert", color: "from-yellow-500 to-orange-500", href: "/pdf-tools/pdf-to-jpg" },
  { title: "PDF to Excel", description: "Convert PDF tables into Excel.", icon: FileSpreadsheet, category: "Convert", color: "from-emerald-500 to-green-600", href: "/pdf-tools/pdf-to-excel" },
  { title: "PDF to PowerPoint", description: "Convert PDF into slides.", icon: Presentation, category: "Convert", color: "from-red-500 to-pink-500", href: "/pdf-tools/pdf-to-powerpoint" },
];

export default function PDFToolsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools =
    activeCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory);

  return (
    <div className="relative bg-gradient-to-b from-white via-[#f8fbff] to-[#eef3ff]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-14 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-black">
          PDF tools,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            simplified
          </span>
        </h1>

        <h2 className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          Everything you need to convert, edit and optimize your PDF documents.
        </h2>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-4">
          {["All", "Edit", "Optimize", "Convert"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white border border-gray-300 text-gray-600 hover:border-blue-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Tool Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <a
                key={index}
                href={tool.href}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition duration-500`}
                />

                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}
                >
                  <Icon size={24} />
                </div>

                <div className="mt-6 text-xs font-semibold text-gray-400 uppercase">
                  {tool.category}
                </div>

                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {tool.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  {tool.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition">
                  SELECT TOOL ⚡
                </div>
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
}