import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { HOME } from "@/content/locales";

export const metadata: Metadata = {
  title: HOME.de.h1a + " " + HOME.de.h1b + " " + HOME.de.h1accent,
  description: HOME.de.sub,
  alternates: { canonical: "/", languages: { de: "/", en: "/en", vi: "/vi" } },
};

export default function Page() {
  return (
    <div lang="de">
      <HomeView locale="de" />
    </div>
  );
}
