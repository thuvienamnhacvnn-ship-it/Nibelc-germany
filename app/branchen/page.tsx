import type { Metadata } from "next";
import { IndustriesView } from "@/components/industries/IndustriesView";
import { INDUSTRIES_PAGE } from "@/content/page-industries";

export const metadata: Metadata = {
  title: INDUSTRIES_PAGE.de.h1,
  description: INDUSTRIES_PAGE.de.sectionText,
  alternates: { languages: { de: "/branchen", en: "/en/industries", vi: "/vi/nganh-nghe" } },
};

export default function Page() {
  return (
    <div lang="de">
      <IndustriesView locale="de" />
    </div>
  );
}
