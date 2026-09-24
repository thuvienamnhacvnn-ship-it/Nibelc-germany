import type { Metadata } from "next";
import { CandidatesView } from "@/components/candidates/CandidatesView";
import { CANDIDATES } from "@/content/page-candidates";

export const metadata: Metadata = {
  title: CANDIDATES.vi.h1a + " " + CANDIDATES.vi.h1accent + CANDIDATES.vi.h1rest,
  description: CANDIDATES.vi.sub,
  alternates: { languages: { de: "/fuer-bewerber", en: "/en/candidates", vi: "/vi/nguoi-lao-dong" } },
};

export default function Page() {
  return (
    <div lang="vi">
      <CandidatesView locale="vi" />
    </div>
  );
}
