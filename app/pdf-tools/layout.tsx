"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PDFToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Show All Tools only when NOT on main tools page
  const showAllTools = pathname !== "/pdf-tools";

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbff]">

      {/* Announcement Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm text-center py-2 font-medium">
        ⚡ Powering over 1,000,000 documents daily
      </div>

      {/* Header */}
      <header className="fixed top-[36px] left-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <a
            href="https://thesaasbook.com"
            className="text-2xl font-bold tracking-tight"
          >
            the
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SaaS
            </span>
            book
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">

            {showAllTools && (
              <Link
                href="/pdf-tools"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                All Tools
              </Link>
            )}

            <a href="https://thesaasbook.com">Home</a>
            <a href="https://thesaasbook.com/categories">Resources</a>
            <a href="https://thesaasbook.com/contact-us">Contact</a>
            <a href="https://thesaasbook.com/about-us">About</a>
          </nav>

          {/* Mobile Right Section */}
          <div className="flex items-center gap-3 md:hidden">

            {showAllTools && (
              <Link
                href="/pdf-tools"
                className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white"
              >
                All Tools
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-800"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-8 flex flex-col gap-8 text-xl font-medium text-gray-700 shadow-lg">

            <a
              href="https://thesaasbook.com"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </a>

            <a
              href="https://thesaasbook.com/categories"
              onClick={() => setMobileOpen(false)}
            >
              Resources
            </a>

            <a
              href="https://thesaasbook.com/contact-us"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </a>

            <a
              href="https://thesaasbook.com/about-us"
              onClick={() => setMobileOpen(false)}
            >
              About
            </a>

          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-[110px]" />

      {/* Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-sm text-gray-600">

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                TheSaaSBook Tools
              </h3>
              <p>
                Modern browser-based PDF tools designed for speed,
                privacy and simplicity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Tools</h4>
              <ul className="space-y-3">
                <li><Link href="/pdf-tools/merge-pdf">Merge PDF</Link></li>
                <li><Link href="/pdf-tools/split-pdf">Split PDF</Link></li>
                <li><Link href="/pdf-tools/compress-pdf">Compress PDF</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://thesaasbook.com/categories">Blog</a>
                </li>
                <li>
                  <a href="https://thesaasbook.com/contact-us">Contact</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul>
                <li>
                  <a href="https://thesaasbook.com/privacy-policy/">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TheSaaSBook Tools. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}