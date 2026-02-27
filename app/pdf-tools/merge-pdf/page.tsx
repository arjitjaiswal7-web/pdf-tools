import type { Metadata } from "next";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import MergePDFClient from "./MergePDFClient";

const SITE_URL = "https://tools.thesaasbook.com";
const PAGE_URL = `${SITE_URL}/pdf-tools/merge-pdf`;

const faqItems = [
  {
    q: "What are TheSaaSBook PDF tools?",
    a: "TheSaaSBook PDF tools are browser-based utilities that help you merge, split, compress, and convert PDF files quickly and easily without installing any software.",
  },
  {
    q: "Are TheSaaSBook PDF tools free to use?",
    a: "Yes, all tools are free to use and work directly in your browser. There is no sign-up or subscription required.",
  },
  {
    q: "Are my PDF files secure and private?",
    a: "Yes. Files are handled with a privacy-first workflow for safe document processing.",
  },
  {
    q: "Do I need to create an account to use the tools?",
    a: "No account is required. You can start using the tools immediately without registration.",
  },
  {
    q: "Can I use these PDF tools on mobile devices?",
    a: "Yes. The tools are fully responsive and work on mobile phones, tablets, and desktops.",
  },
  {
    q: "What types of PDF conversions are supported?",
    a: "You can merge PDFs, split PDFs, compress files, convert JPG to PDF, and convert PDFs to Word, Excel, PowerPoint, and JPG formats.",
  },
];

export const metadata: Metadata = {
  title: "Merge PDF Online for Free | Fast & Secure | TheSaaSBook",
  description:
    "Merge PDF files online for free. Combine multiple PDFs in seconds with a fast and secure workflow.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Merge PDF Online for Free | TheSaaSBook",
    description:
      "Combine multiple PDF files into one document quickly with a secure, browser-based workflow.",
    siteName: "TheSaaSBook Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online for Free | TheSaaSBook",
    description:
      "Combine multiple PDF files into one document quickly with a secure, browser-based workflow.",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Merge PDF Tool",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  url: PAGE_URL,
  description: "Merge multiple PDF files into one document quickly and securely.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "PDF Tools",
      item: `${SITE_URL}/pdf-tools`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Merge PDF",
      item: PAGE_URL,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function MergePDFPage() {
  return (
    <>
      <MergePDFClient />

      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-md p-8 md:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <Sparkles size={14} />
            Quick Guide
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
            How to merge PDF files
          </h2>

          <ol className="mt-6 space-y-4 text-slate-600 text-lg">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                1
              </span>
              Upload 2 or more PDF files.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                2
              </span>
              Reorder files as needed.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
                3
              </span>
              Click Merge PDFs and download your merged file.
            </li>
          </ol>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Security-first processing</h3>
            <p className="mt-2 text-slate-600 leading-7">
              Built for safe file handling with privacy-conscious processing design.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Zap size={18} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Fast performance</h3>
            <p className="mt-2 text-slate-600 leading-7">
              Optimized workflows for quick upload, conversion, and download.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles size={18} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Clean professional output</h3>
            <p className="mt-2 text-slate-600 leading-7">
              Consistent results designed for teams, creators, and business use.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {faqItems.map((item) => (
              <details key={item.q} className="rounded-lg border border-slate-200 p-4">
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
