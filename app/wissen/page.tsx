import type { Metadata } from "next";
import { KnowledgeView } from "@/components/pages/KnowledgeView";
import { ROUTES } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

const t = SIMPLE.de.knowledge;

export const metadata: Metadata = {
  title: t.title,
  description: t.lead,
  alternates: {
    languages: { de: ROUTES.knowledge.de, en: ROUTES.knowledge.en, vi: ROUTES.knowledge.vi },
  },
};

export default function Page() {
  return (
    <div lang="de">
      <KnowledgeView locale="de" />
    </div>
  );
}
