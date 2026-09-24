import type { Metadata } from "next";
import { EmployersView } from "@/components/employers/EmployersView";
import { EMPLOYERS } from "@/content/page-employers";

export const metadata: Metadata = {
  title: EMPLOYERS.vi.h1a + " " + EMPLOYERS.vi.h1b,
  description: EMPLOYERS.vi.sub,
  alternates: { languages: { de: "/fuer-unternehmen", en: "/en/employers", vi: "/vi/doanh-nghiep" } },
};

export default function Page() {
  return (
    <div lang="vi">
      <EmployersView locale="vi" />
    </div>
  );
}
