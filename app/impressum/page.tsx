import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { NavLink } from "@/components/layout/NavLink";
import { LEGAL, impressumComplete, impressumMissing } from "@/data/company";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Angaben gemäß § 5 TMG für ${LEGAL.name}, ${LEGAL.city}.`,
  robots: { index: false },
};

export default function Page() {
  const du = impressumComplete();
  const thieu = impressumMissing();

  return (
    <div className="nb-duoi-header">
      <PageHero
        anh="/assets/banners/lien-he.jpg"
        nhan="Rechtliches"
        tieuDe="Impressum"
        mo="Angaben gemäß § 5 TMG."
      />

      <section className="mx-auto max-w-[820px] px-8 py-14">
        <Muc tieuDe="Diensteanbieter">
          <address className="text-[16px] leading-[1.9] not-italic text-[var(--nb-text-dim)]">
            {LEGAL.name}
            <br />
            {LEGAL.street}
            <br />
            {LEGAL.postalCode} {LEGAL.city}
            <br />
            {LEGAL.country}
          </address>
        </Muc>

        <Muc tieuDe="Kontakt">
          <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
            Telefon: {LEGAL.phone}
            <br />
            E-Mail: {LEGAL.email}
          </p>
        </Muc>

        <Muc tieuDe="Rechtsform">
          <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">{LEGAL.rechtsform}</p>
        </Muc>

        {du ? (
          <>
            <Muc tieuDe="Registereintrag">
              <p className="text-[16px] text-[var(--nb-text-dim)]">
                {LEGAL.handelsregister} · {LEGAL.hrb}
              </p>
            </Muc>
            <Muc tieuDe="Vertretungsberechtigt">
              <p className="text-[16px] text-[var(--nb-text-dim)]">{LEGAL.geschaeftsfuehrer}</p>
            </Muc>
            <Muc tieuDe="Umsatzsteuer-Identifikationsnummer">
              <p className="text-[16px] text-[var(--nb-text-dim)]">{LEGAL.ustIdNr}</p>
            </Muc>
          </>
        ) : (
          <div className="nb-panel mt-9 p-6">
            <b className="flex items-center gap-2.5 text-[15.5px] font-semibold text-[var(--nb-gold-soft)]">
              <AlertTriangle size={18} />
              Registerangaben werden ergänzt
            </b>
            <p className="mt-3 text-[14.5px] leading-[1.8] text-[var(--nb-text-dim)]">
              Folgende nach § 5 TMG erforderliche Angaben liegen der Redaktion dieser Website noch nicht in belegbarer
              Form vor und werden nachgetragen, sobald sie bestätigt sind:
            </p>
            <ul className="mt-3 space-y-1.5">
              {thieu.map((x) => (
                <li key={x} className="flex gap-2.5 text-[14.5px] text-[var(--nb-text-dim)]">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--nb-gold)]" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Muc tieuDe="Haftung für Inhalte und Links">
          <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
            Die Inhalte dieser Website werden mit Sorgfalt erstellt. Angaben zu Stellen, Vergütungen und
            Ausbildungsbedingungen geben den Stand der jeweiligen Ausschreibung wieder und ersetzen keinen Arbeits- oder
            Ausbildungsvertrag. Für Inhalte externer Links sind deren Betreiber verantwortlich.
          </p>
        </Muc>

        <Muc tieuDe="Datenschutz">
          <p className="text-[16px] leading-[1.9] text-[var(--nb-text-dim)]">
            Informationen zur Verarbeitung personenbezogener Daten finden Sie in der{" "}
            <NavLink href="/datenschutz" className="font-medium text-[var(--nb-gold-soft)] hover:underline">
              Datenschutzerklärung
            </NavLink>
            .
          </p>
        </Muc>
      </section>
    </div>
  );
}

function Muc({ tieuDe, children }: { tieuDe: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 first-of-type:mt-0">
      <h2 className="nb-display text-[21px] text-white">{tieuDe}</h2>
      <span className="mt-3 mb-4 block h-px w-14 bg-[var(--nb-gold)]" aria-hidden="true" />
      {children}
    </section>
  );
}
