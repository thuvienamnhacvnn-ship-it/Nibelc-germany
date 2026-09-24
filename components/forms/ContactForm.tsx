"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/content/locales";
import { SIMPLE } from "@/content/page-simple";

type State = "idle" | "sending" | "done" | "error";

const FIELD =
  "mt-1 w-full rounded-md border border-[#cdd8e6] bg-white px-4 py-3 text-[#10284d] outline-none focus:border-[#1d5fd6] focus:ring-2 focus:ring-[#1d5fd6]/25";

export function ContactForm({ locale }: { locale: Locale }) {
  const t = SIMPLE[locale].contact;
  const [state, setState] = useState<State>("idle");
  const [bad, setBad] = useState<string[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setBad([]);
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "kontakt", locale, ...Object.fromEntries(fd) }),
      });
      const json = (await res.json()) as { ok: boolean; fields?: string[] };
      if (!json.ok) {
        setBad(json.fields ?? []);
        setState("error");
        return;
      }
      setState("done");
      e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="flex items-start gap-3 rounded-xl bg-[#effaf1] p-6 text-[#186b36] ring-1 ring-[#bfe6c9]">
        <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0" />
        {t.done}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[#10284d]">
          {t.fields.name} *
          <input name="name" required autoComplete="name" className={FIELD} aria-invalid={bad.includes("name")} />
        </label>
        <label className="block text-sm font-semibold text-[#10284d]">
          {t.fields.email} *
          <input name="email" type="email" required autoComplete="email" className={FIELD} aria-invalid={bad.includes("email")} />
        </label>
        <label className="block text-sm font-semibold text-[#10284d]">
          {t.fields.phone}
          <input name="phone" type="tel" autoComplete="tel" className={FIELD} />
        </label>
        <label className="block text-sm font-semibold text-[#10284d]">
          {t.fields.company}
          <input name="company" autoComplete="organization" className={FIELD} />
        </label>
      </div>

      <label className="block text-sm font-semibold text-[#10284d]">
        {t.fields.role}
        <select name="role" className={FIELD} defaultValue={t.roles[0]}>
          {t.roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-[#10284d]">
        {t.fields.message} *
        <textarea name="message" required rows={6} className={FIELD} aria-invalid={bad.includes("message")} />
      </label>

      {state === "error" && (
        <p role="alert" className="rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#a12c2c] ring-1 ring-[#f3c3c3]">
          {t.error}
        </p>
      )}

      <p className="text-xs text-[#5b6b80]">{t.privacy}</p>

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-3 rounded-md bg-[var(--nb-orange)] px-7 py-3 font-semibold text-white hover:bg-[var(--nb-orange-dark)] disabled:opacity-60"
      >
        {state === "sending" ? t.sending : t.submit}
        <Icon name="send" className="h-4 w-4" strokeWidth={1.9} />
      </button>
    </form>
  );
}
