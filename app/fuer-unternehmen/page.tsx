import type { Metadata } from "next";
import { EmployersView } from "@/components/employers/EmployersView";
import { EMPLOYERS } from "@/content/page-employers";

export const metadata: Metadata = {
  title: EMPLOYERS.de.h1a + " " + EMPLOYERS.de.h1b,
  description: EMPLOYERS.de.sub,
  alternates: { languages: { de: "/fuer-unternehmen", en: "/en/employers", vi: "/vi/doanh-nghiep" } },
};

export default function Page() {
  return (
    <div lang="de">
      <EmployersView locale="de" />
    </div>
  );
}
