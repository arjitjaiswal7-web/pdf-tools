import PDFToolsClient from "./PDFToolsClient";

export const metadata = {
  title: "Online PDF Tools | Edit & Convert with theSaaSbook",
  description:
    "theSaaSbook is an online service to work with PDF files completely simplified and easy to use. Merge PDF, split PDF, compress PDF, Office to PDF, PDF to JPG and more!",
  alternates: {
    canonical: "https://tools.thesaasbook.com/pdf-tools",
  },
};

export default function PDFToolsPage() {
  return <PDFToolsClient />;
}