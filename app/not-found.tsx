import Link from "next/link";
import type { Route } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/content/locales";
import { mainMenu } from "@/content/nav-menu";

/** Trang 404 — giữ người xem ở lại bằng các lối đi chính. */
export default function NotFound() {
  const menu = mainMenu("de").filter((m) => m.href !== ROUTES.home.de);

  return (
    <div lang="de" className="flex min-h-screen flex-col">
      <main id="inhalt" className="flex-1 bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#1f4f9f] uppercase">Fehler 404</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.02em] text-[#10284d]">Diese Seite gibt es nicht.</h1>
          <p className="mt-3 text-lg text-[#5b6b80]">
            Vielleicht wurde die Adresse geändert. Hier geht es weiter:
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {menu.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href as Route}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f6fb] px-5 py-4 font-semibold text-[#10284d] ring-1 ring-[#e3e9f1] hover:ring-[#1d5fd6]"
                >
                  {m.label}
                  <Icon name="arrowRight" className="h-4 w-4 text-[#1f4f9f]" strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href={ROUTES.home.de as Route} className="font-semibold text-[#1647a8] hover:underline">
              ← Zur Startseite
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter locale="de" />
    </div>
  );
}
