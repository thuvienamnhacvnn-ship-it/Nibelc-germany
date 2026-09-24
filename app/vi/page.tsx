import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HOME } from "@/content/locales";

export const metadata: Metadata = {
  title: HOME.vi.h1a + " " + HOME.vi.h1b + " " + HOME.vi.h1accent,
  description: HOME.vi.sub,
  alternates: { canonical: "/vi", languages: { de: "/", en: "/en", vi: "/vi" } },
};

export default function Page() {
  return (
    <div lang="vi">
      <HomeView locale="vi" />
    </div>
  );
}
