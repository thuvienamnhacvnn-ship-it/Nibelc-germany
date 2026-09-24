import type { Metadata } from "next";
import { EmployersView } from "@/components/employers/EmployersView";
import { EMPLOYERS } from "@/content/page-employers";

export const metadata: Metadata = {
  title: EMPLOYERS.en.h1a + " " + EMPLOYERS.en.h1b,
  description: EMPLOYERS.en.sub,
  alternates: { languages: { de: "/fuer-unternehmen", en: "/en/employers", vi: "/vi/doanh-nghiep" } },
};

export default function Page() {
  return (
    <div lang="en">
      <EmployersView locale="en" />
    </div>
  );
}
