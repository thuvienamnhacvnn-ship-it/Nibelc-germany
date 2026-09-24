"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/content/locales";
import { REQUEST } from "@/content/page-request";

/**
 * Biểu mẫu nhu cầu nhân sự, bốn bước như mẫu 08.
 * Ngành và nghề truyền từ server (đọc registry) để không lặp dữ liệu.
 */

export interface Option {
  value: string;
  label: string;
  /** Nghề thuộc ngành nào — để lọc danh sách nghề theo ngành đã chọn */
  group?: string;
}

const FIELD =
  "mt-1 w-full rounded-md border border-[#cdd8e6] bg-white px-4 py-3 text-[#10284d] outline-none focus:border-[#1d5fd6] focus:ring-2 focus:ring-[#1d5fd6]/25";

type Values = Record<string, string>;

const STEP_FIELDS: string[][] = [
  ["branche", "beruf", "anzahl", "standort", "start", "sprachniveau"],
  ["unternehmen", "notiz"],
  ["ansprechpartner", "email", "phone"],
  [],
];
const REQUIRED = ["branche", "beruf", "anzahl", "unternehmen", "ansprechpartner", "email"];

export function RequestForm({
  locale,
  branchen,
  berufe,
}: {
  locale: Locale;
  branchen: Option[];
  berufe: Option[];
}) {
  const t = REQUEST[locale];
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>({});
  const [bad, setBad] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const berufOptions = useMemo(
    () => berufe.filter((b) => !v.branche || b.group === v.branche),
    [berufe, v.branche],
  );

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((old) => ({ ...old, [k]: e.target.value, ...(k === "branche" ? { beruf: "" } : {}) }));

  function validate(fields: string[]): boolean {
    const missing = fields.filter((f) => REQUIRED.includes(f) && !v[f]?.trim());
    if (fields.includes("email") && v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) missing.push("email");
    setBad(missing);
    return missing.length === 0;
  }

  async function submit() {
    if (!validate(REQUIRED)) {
      setStep(REQUIRED.some((f) => bad.includes(f) && STEP_FIELDS[0]!.includes(f)) ? 0 : step);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "personalbedarf", locale, ...v, beruf: (v.beruf ?? "").split(":").pop() }),
      });
      const json = (await res.json()) as { ok: boolean; fields?: string[] };
      if (!json.ok) {
        setBad(json.fields ?? []);
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-xl bg-[#effaf1] p-8 ring-1 ring-[#bfe6c9]">
        <h2 className="flex items-center gap-3 text-xl font-bold text-[#186b36]">
          <Icon name="checkCircle" className="h-6 w-6" />
          {t.done.title}
        </h2>
        <p className="mt-3 text-[#276b41]">{t.done.text}</p>
      </div>
    );
  }

  const label = (k: keyof typeof t.fields, req = false) => (
    <>
      {t.fields[k]} {req && <span className="text-[var(--nb-orange)]">*</span>}
    </>
  );
  const invalid = (k: string) => (bad.includes(k) ? "border-[#d06060] ring-2 ring-[#d06060]/20" : "");

  return (
    <div>
      {/* Thanh bốn bước */}
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {t.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                i === step ? "bg-[var(--nb-orange)] text-white" : i < step ? "bg-[#0b4ea2] text-white" : "bg-[#dfe7f1] text-[#5b6b80]"
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-sm ${i === step ? "font-semibold text-[#10284d]" : "text-[#5b6b80]"}`}>{s}</span>
            {i < t.steps.length - 1 && <span className="hidden h-px w-10 bg-[#cdd8e6] sm:block" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <h2 className="mt-8 text-2xl font-bold text-[#10284d]">{t.stepTitles[step]}</h2>
      {step === 0 && <p className="mt-2 max-w-[75ch] text-[#2a3d58]">{t.intro}</p>}

      <div className="mt-6 space-y-5">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("branche", true)}
              <select value={v.branche ?? ""} onChange={set("branche")} className={`${FIELD} ${invalid("branche")}`}>
                <option value="">{t.placeholders.branche}</option>
                {branchen.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#10284d]">
              {label("beruf", true)}
              <select value={v.beruf ?? ""} onChange={set("beruf")} className={`${FIELD} ${invalid("beruf")}`}>
                <option value="">{t.placeholders.beruf}</option>
                {berufOptions.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
                <option value={t.berufOther}>{t.berufOther}</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#10284d]">
              {label("anzahl", true)}
              <input
                inputMode="numeric"
                value={v.anzahl ?? ""}
                onChange={set("anzahl")}
                placeholder={t.placeholders.anzahl}
                className={`${FIELD} ${invalid("anzahl")}`}
              />
            </label>

            <label className="block text-sm font-semibold text-[#10284d]">
              {label("standort")}
              <input value={v.standort ?? ""} onChange={set("standort")} placeholder={t.placeholders.standort} className={FIELD} />
            </label>

            <label className="block text-sm font-semibold text-[#10284d]">
              {label("start")}
              <select value={v.start ?? ""} onChange={set("start")} className={FIELD}>
                <option value="">{t.placeholders.start}</option>
                {t.startOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[#10284d]">
              {label("sprachniveau")}
              <select value={v.sprachniveau ?? ""} onChange={set("sprachniveau")} className={FIELD}>
                <option value="">{t.placeholders.sprachniveau}</option>
                {t.sprachOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <>
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("unternehmen", true)}
              <input value={v.unternehmen ?? ""} onChange={set("unternehmen")} className={`${FIELD} ${invalid("unternehmen")}`} />
            </label>
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("notiz")}
              <textarea value={v.notiz ?? ""} onChange={set("notiz")} rows={5} placeholder={t.placeholders.notiz} className={FIELD} />
            </label>
          </>
        )}

        {step === 2 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("ansprechpartner", true)}
              <input value={v.ansprechpartner ?? ""} onChange={set("ansprechpartner")} autoComplete="name" className={`${FIELD} ${invalid("ansprechpartner")}`} />
            </label>
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("email", true)}
              <input type="email" value={v.email ?? ""} onChange={set("email")} autoComplete="email" className={`${FIELD} ${invalid("email")}`} />
            </label>
            <label className="block text-sm font-semibold text-[#10284d]">
              {label("phone")}
              <input type="tel" value={v.phone ?? ""} onChange={set("phone")} autoComplete="tel" className={FIELD} />
            </label>
          </div>
        )}

        {step === 3 && (
          <dl className="divide-y divide-[#e3e9f1] rounded-xl bg-[#f7f9fc] p-6 ring-1 ring-[#e3e9f1]">
            <p className="pb-3 font-bold text-[#10284d]">{t.summaryTitle}</p>
            {Object.entries(t.fields).map(([k, lbl]) =>
              v[k] ? (
                <div key={k} className="flex gap-4 py-2 text-sm">
                  <dt className="w-1/3 shrink-0 text-[#5b6b80]">{lbl}</dt>
                  <dd className="text-[#10284d]">{k === "beruf" ? v[k]!.split(":").pop() : k === "branche" ? (branchen.find((b) => b.value === v[k])?.label ?? v[k]) : v[k]}</dd>
                </div>
              ) : null,
            )}
          </dl>
        )}

        {state === "error" && (
          <p role="alert" className="rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#a12c2c] ring-1 ring-[#f3c3c3]">
            {t.error}
          </p>
        )}

        <p className="text-xs text-[#5b6b80]">
          <span className="text-[var(--nb-orange)]">*</span> {t.required}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-md border border-[#cdd8e6] px-5 py-3 font-semibold text-[#10284d] hover:bg-[#f3f6fb]"
            >
              {t.back}
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => validate(STEP_FIELDS[step]!) && setStep(step + 1)}
              className="inline-flex items-center gap-3 rounded-md bg-[var(--nb-orange)] px-7 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)]"
            >
              {t.next}
              <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : (
            <button
              type="button"
              disabled={state === "sending"}
              onClick={submit}
              className="inline-flex items-center gap-3 rounded-md bg-[var(--nb-orange)] px-7 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)] disabled:opacity-60"
            >
              {state === "sending" ? t.sending : t.submit}
              <Icon name="send" className="h-4 w-4" strokeWidth={1.9} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
