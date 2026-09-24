import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";
import { ROUTES } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

const t = SIMPLE.en.about;

export const metadata: Metadata = {
  title: t.title,
  description: t.lead,
  alternates: {
    languages: { de: ROUTES.about.de, en: ROUTES.about.en, vi: ROUTES.about.vi },
  },
};

export default function Page() {
  return (
    <div lang="en">
      <AboutView locale="en" />
    </div>
  );
}
