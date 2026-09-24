import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";
import { ROUTES } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

const t = SIMPLE.de.services;

export const metadata: Metadata = {
  title: t.title,
  description: t.lead,
  alternates: {
    languages: { de: ROUTES.services.de, en: ROUTES.services.en, vi: ROUTES.services.vi },
  },
};

export default function Page() {
  return (
    <div lang="de">
      <ServicesView locale="de" />
    </div>
  );
}
