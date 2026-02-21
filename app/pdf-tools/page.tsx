"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function PDFToolsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTools =
    activeCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-[#f8fbff] to-[#eef3ff] overflow-hidden">

      {/* Floating Background Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-300 opacity-20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-300 opacity-20 blur-[150px] rounded-full"></div>

      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm text-center py-2 font-medium">
        ⚡ Powering over 1,000,000 documents daily
      </div>

      {/* Fixed Header */}
      <header className="fixed top-[36px] left-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="https://thesaasbook.com" className="text-2xl font-bold tracking-tight">
            <span className="text-gray-900">the</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SaaS
            </span>
            <span className="text-gray-900">book</span>
          </Link>

          <nav className="hidden md:flex gap-10 text-sm font-medium text-gray-700">
            <a href="https://thesaasbook.com" className="hover:text-blue-600 transition">Home</a>
            <a href="https://thesaasbook.com/categories" className="hover:text-blue-600 transition">Resources</a>
            <a href="https://thesaasbook.com/contact-us" className="hover:text-blue-600 transition">Contact</a>
            <a href="https://thesaasbook.com/about-us" className="hover:text-blue-600 transition">About</a>
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[110px]"></div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-14 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          PDF tools,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            simplified
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          Everything you need to convert, edit and optimize your PDF documents.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex overflow-x-auto gap-3 justify-start sm:justify-center">
          {["All", "Edit", "Optimize", "Convert"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition ${
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
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <a
                key={index}
                href={tool.href}
                className="group relative bg-white rounded-2xl p-8 border border-white/60 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Corner Glow */}
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition duration-500`}></div>

                <div className={`relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
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

      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-b from-white to-[#f3f7ff] pt-20 pb-10 border-t border-white/40">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-300 opacity-10 blur-[120px] rounded-full"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-sm text-gray-600">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                TheSaaSBook Tools
              </h3>
              <p>
                Modern browser-based PDF tools designed for speed, security, and simplicity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Tools</h4>
              <ul className="space-y-3">
                <li><a href="/pdf-tools/merge-pdf" className="hover:text-blue-600 transition">Merge PDF</a></li>
                <li><a href="/pdf-tools/compress-pdf" className="hover:text-blue-600 transition">Compress PDF</a></li>
                <li><a href="/pdf-tools/split-pdf" className="hover:text-blue-600 transition">Split PDF</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-3">
                <li><a href="https://thesaasbook.com/categories" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="https://thesaasbook.com/about-us" className="hover:text-blue-600 transition">About</a></li>
                <li><a href="https://thesaasbook.com/contact-us" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://thesaasbook.com/privacy-policy/" className="hover:text-blue-600 transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TheSaaSBook Tools. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}