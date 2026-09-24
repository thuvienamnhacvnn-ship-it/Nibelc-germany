import type { Metadata } from "next";
import { ProcessView } from "@/components/process/ProcessView";
import { PROCESS } from "@/content/page-process";

export const metadata: Metadata = {
  title: PROCESS.en.h1.join(" "),
  description: PROCESS.en.sub.join(" "),
  alternates: { languages: { de: "/prozess", en: "/en/process", vi: "/vi/lo-trinh" } },
};

export default function Page() {
  return (
    <div lang="en">
      <ProcessView locale="en" />
    </div>
  );
}
