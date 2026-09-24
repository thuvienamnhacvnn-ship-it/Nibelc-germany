import type { Metadata } from "next";
import { ProcessView } from "@/components/process/ProcessView";
import { PROCESS } from "@/content/page-process";

export const metadata: Metadata = {
  title: PROCESS.de.h1.join(" "),
  description: PROCESS.de.sub.join(" "),
  alternates: { languages: { de: "/prozess", en: "/en/process", vi: "/vi/lo-trinh" } },
};

export default function Page() {
  return (
    <div lang="de">
      <ProcessView locale="de" />
    </div>
  );
}
