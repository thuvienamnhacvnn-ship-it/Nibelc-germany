import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HOME } from "@/content/locales";

export const metadata: Metadata = {
  title: HOME.en.h1a + " " + HOME.en.h1b + " " + HOME.en.h1accent,
  description: HOME.en.sub,
  alternates: { canonical: "/en", languages: { de: "/", en: "/en", vi: "/vi" } },
};

export default function Page() {
  return (
    <div lang="en">
      <HomeView locale="en" />
    </div>
  );
}
