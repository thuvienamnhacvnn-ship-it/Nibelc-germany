import type { Metadata } from "next";
import { CandidatesView } from "@/components/candidates/CandidatesView";
import { CANDIDATES } from "@/content/page-candidates";

export const metadata: Metadata = {
  title: CANDIDATES.de.h1a + " " + CANDIDATES.de.h1accent + CANDIDATES.de.h1rest,
  description: CANDIDATES.de.sub,
  alternates: { languages: { de: "/fuer-bewerber", en: "/en/candidates", vi: "/vi/nguoi-lao-dong" } },
};

export default function Page() {
  return (
    <div lang="de">
      <CandidatesView locale="de" />
    </div>
  );
}
