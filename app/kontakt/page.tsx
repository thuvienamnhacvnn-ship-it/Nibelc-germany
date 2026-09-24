import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";
import { ROUTES } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

const t = SIMPLE.de.contact;

export const metadata: Metadata = {
  title: t.title,
  description: t.lead,
  alternates: {
    languages: { de: ROUTES.contact.de, en: ROUTES.contact.en, vi: ROUTES.contact.vi },
  },
};

export default function Page() {
  return (
    <div lang="de">
      <ContactView locale="de" />
    </div>
  );
}
