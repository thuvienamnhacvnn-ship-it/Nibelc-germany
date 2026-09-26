import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobDetailView } from "@/components/jobs/JobDetailView";
import { JOB_ORDERS, jobById } from "@/content/jobs-current";
import { LOCALES, jobPath } from "@/content/locales";

export const dynamicParams = false;

export function generateStaticParams() {
  return JOB_ORDERS.map((j) => ({ job: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ job: string }> }): Promise<Metadata> {
  const { job } = await params;
  const j = jobById(job);
  if (!j) return {};
  return {
    title: j.title.de,
    description: j.summary.de,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, jobPath(l, j.id)])) },
  };
}

export default async function Page({ params }: { params: Promise<{ job: string }> }) {
  const { job } = await params;
  const j = jobById(job);
  if (!j) notFound();
  return (
    <div lang="de">
      <JobDetailView locale="de" job={j} />
    </div>
  );
}
