import type { Metadata } from "next";
import { IndustriesView } from "@/components/industries/IndustriesView";
import { INDUSTRIES_PAGE } from "@/content/page-industries";

export const metadata: Metadata = {
  title: INDUSTRIES_PAGE.en.h1,
  description: INDUSTRIES_PAGE.en.sectionText,
  alternates: { languages: { de: "/branchen", en: "/en/industries", vi: "/vi/nganh-nghe" } },
};

export default function Page() {
  return (
    <div lang="en">
      <IndustriesView locale="en" />
    </div>
  );
}
