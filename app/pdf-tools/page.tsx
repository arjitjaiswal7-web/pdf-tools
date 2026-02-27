import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Combine,
  Scissors,
  Edit3,
  Minimize2,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  Presentation,
  ShieldCheck,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PDF Tools Online - Merge, Split, Compress & Convert | TheSaaSBook",
  description:
    "Professional online PDF tools to merge, split, edit, compress and convert documents. Fast, secure, and browser-based.",
  alternates: {
    canonical: "https://tools.thesaasbook.com/pdf-tools",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "PDF Tools Online | TheSaaSBook",
    description:
      "Merge, split, edit, compress and convert PDFs with a smooth browser-based workflow.",
    url: "https://tools.thesaasbook.com/pdf-tools",
    siteName: "TheSaaSBook Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools Online | TheSaaSBook",
    description:
      "Merge, split, edit, compress and convert PDFs with a smooth browser-based workflow.",
  },
};

type ToolCategory = "Edit" | "Optimize" | "Convert";
type CategorySlug = "all" | "edit" | "optimize" | "convert";

type Tool = {
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  color: string;
  href: string;
};

type SearchParams = {
  category?: string | string[];
};

type PageProps = {
  searchParams?: SearchParams | Promise<SearchParams>;
};

const tools: Tool[] = [
  { title: "Merge PDF", description: "Combine PDFs in seconds.", icon: Combine, category: "Edit", color: "from-orange-500 to-red-500", href: "/pdf-tools/merge-pdf" },
  { title: "Split PDF", description: "Extract or divide PDF pages easily.", icon: Scissors, category: "Edit", color: "from-blue-500 to-indigo-500", href: "/pdf-tools/split-pdf" },
  { title: "Edit PDF", description: "Modify text and images inside PDF.", icon: Edit3, category: "Edit", color: "from-purple-500 to-indigo-500", href: "/pdf-tools/edit-pdf" },
  { title: "Compress PDF", description: "Reduce file size while keeping clarity.", icon: Minimize2, category: "Optimize", color: "from-green-500 to-emerald-500", href: "/pdf-tools/compress-pdf" },
  { title: "JPG to PDF", description: "Convert JPG images into PDFs.", icon: ImageIcon, category: "Convert", color: "from-pink-500 to-rose-500", href: "/pdf-tools/jpg-to-pdf" },
  { title: "PDF to Word", description: "Convert PDFs into Word files.", icon: FileText, category: "Convert", color: "from-indigo-500 to-blue-600", href: "/pdf-tools/pdf-to-word" },
  { title: "Word to PDF", description: "Convert Word files into PDF.", icon: FileText, category: "Convert", color: "from-cyan-500 to-blue-500", href: "/pdf-tools/word-to-pdf" },
  { title: "PDF to JPG", description: "Export PDF pages as JPG.", icon: ImageIcon, category: "Convert", color: "from-yellow-500 to-orange-500", href: "/pdf-tools/pdf-to-jpg" },
  { title: "PDF to Excel", description: "Convert PDF tables into Excel.", icon: FileSpreadsheet, category: "Convert", color: "from-emerald-500 to-green-600", href: "/pdf-tools/pdf-to-excel" },
  { title: "PDF to PowerPoint", description: "Convert PDF into slides.", icon: Presentation, category: "Convert", color: "from-red-500 to-pink-500", href: "/pdf-tools/pdf-to-powerpoint" },
];

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
    a: "Yes. Your files are processed locally in your browser and are not stored on external servers, ensuring privacy and data security.",
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

const slugMap: Record<CategorySlug, "All" | ToolCategory> = {
  all: "All",
  edit: "Edit",
  optimize: "Optimize",
  convert: "Convert",
};

function normalizeSlug(value?: string | string[]): CategorySlug {
  const raw = Array.isArray(value) ? value[0] : value;
  const slug = (raw ?? "all").toLowerCase().trim();
  if (slug === "edit" || slug === "optimize" || slug === "convert") return slug;
  return "all";
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await Promise.resolve(searchParams ?? {});
  const activeSlug = normalizeSlug(sp.category);
  const activeCategory = slugMap[activeSlug];

  const filteredTools =
    activeCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: activeCategory === "All" ? "PDF Tools" : `${activeCategory} PDF Tools`,
    itemListElement: filteredTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `https://tools.thesaasbook.com${tool.href}`,
    })),
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

  return (
    <div className="relative overflow-hidden bg-[#f7f9ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_500px_at_8%_0%,#dbeafe_0%,transparent_60%),radial-gradient(900px_420px_at_92%_0%,#e0e7ff_0%,transparent_60%),linear-gradient(to_bottom,#f8fbff,#eef3ff)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative max-w-6xl mx-auto px-6 pt-12 pb-10 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700 shadow-sm">
          <Sparkles size={14} aria-hidden="true" />
          Professional PDF Workspace
        </p>

        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-slate-900">
          PDF tools,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            simplified
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Everything you need to convert, edit and optimize your PDF documents.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <ShieldCheck size={16} className="text-emerald-600" />
            Privacy-first approach
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <Lock size={16} className="text-blue-600" />
            Browser-based workflow
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <Sparkles size={16} className="text-indigo-600" />
            Professional quality output
          </div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/pdf-tools" className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeSlug === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400"}`}>All</Link>
          <Link href="/pdf-tools?category=edit" className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeSlug === "edit" ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400"}`}>Edit</Link>
          <Link href="/pdf-tools?category=optimize" className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeSlug === "optimize" ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400"}`}>Optimize</Link>
          <Link href="/pdf-tools?category=convert" className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeSlug === "convert" ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400"}`}>Convert</Link>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex min-h-[340px] flex-col overflow-hidden bg-white rounded-2xl p-8 shadow-md border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div
                  className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${tool.color} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                />

                <div className={`relative w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
                  <Icon size={24} />
                </div>

                <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors group-hover:text-blue-600">
                  {tool.category}
                </div>

                <h3 className="mt-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                  {tool.title}
                </h3>

                <p className="mt-3 text-sm text-slate-500">{tool.description}</p>

                <div className="mt-auto pt-5 h-7">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Open tool
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Frequently asked questions</h2>
        <div className="mt-6 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-slate-800">{item.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
            <ShieldCheck className="text-emerald-600" size={20} />
            <h3 className="mt-3 text-base font-semibold text-slate-900">Security-first processing</h3>
            <p className="mt-2 text-sm text-slate-600">
              Built for safe file handling with privacy-conscious processing design.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
            <Zap className="text-amber-500" size={20} />
            <h3 className="mt-3 text-base font-semibold text-slate-900">Fast performance</h3>
            <p className="mt-2 text-sm text-slate-600">
              Optimized workflows for quick upload, conversion, and download.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
            <Sparkles className="text-blue-600" size={20} />
            <h3 className="mt-3 text-base font-semibold text-slate-900">Clean professional output</h3>
            <p className="mt-2 text-sm text-slate-600">
              Consistent results designed for teams, creators, and business use.
            </p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
