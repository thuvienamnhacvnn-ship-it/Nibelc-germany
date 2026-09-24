import type { Metadata } from "next";
import { CandidatesView } from "@/components/candidates/CandidatesView";
import { CANDIDATES } from "@/content/page-candidates";

export const metadata: Metadata = {
  title: CANDIDATES.en.h1a + " " + CANDIDATES.en.h1accent + CANDIDATES.en.h1rest,
  description: CANDIDATES.en.sub,
  alternates: { languages: { de: "/fuer-bewerber", en: "/en/candidates", vi: "/vi/nguoi-lao-dong" } },
};

export default function Page() {
  return (
    <div lang="en">
      <CandidatesView locale="en" />
    </div>
  );
}
