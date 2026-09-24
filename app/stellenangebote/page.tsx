import type { Metadata } from "next";
import { JobsView } from "@/components/pages/JobsView";
import { JOBS_COPY } from "@/content/jobs-current";
import { ROUTES } from "@/content/locales";

const t = JOBS_COPY.de;

export const metadata: Metadata = {
  title: t.title,
  description: t.lead,
  alternates: { languages: { de: ROUTES.jobs.de, en: ROUTES.jobs.en, vi: ROUTES.jobs.vi } },
};

export default function Page() {
  return (
    <div lang="de">
      <JobsView locale="de" />
    </div>
  );
}
