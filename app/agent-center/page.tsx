import type { Metadata } from "next";
import { AgentCenterView } from "@/components/agent/AgentCenterView";

// Màn hình nội bộ: không index, không nằm trong sitemap, chặn trong robots.
export const metadata: Metadata = {
  title: "Agent Center",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div lang="de">
      <AgentCenterView />
    </div>
  );
}
