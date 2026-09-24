import type { Metadata } from "next";
import { RequestView } from "@/components/pages/RequestView";
import { ROUTES } from "@/content/locales";
import { REQUEST } from "@/content/page-request";

const t = REQUEST.en;

export const metadata: Metadata = {
  title: t.h1.join(" "),
  description: t.lead,
  alternates: { languages: { de: ROUTES.request.de, en: ROUTES.request.en, vi: ROUTES.request.vi } },
};

export default function Page() {
  return (
    <div lang="en">
      <RequestView locale="en" />
    </div>
  );
}
