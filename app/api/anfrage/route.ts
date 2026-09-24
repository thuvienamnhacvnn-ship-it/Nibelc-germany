import { NextResponse } from "next/server";
import { isEmail, normalise, saveAnfrage, type AnfrageKind } from "@/lib/anfragen";

export const runtime = "nodejs";

const FIELDS: Record<AnfrageKind, { keys: string[]; required: string[] }> = {
  kontakt: {
    keys: ["name", "email", "phone", "company", "role", "message"],
    required: ["name", "email", "message"],
  },
  personalbedarf: {
    keys: [
      "branche",
      "beruf",
      "anzahl",
      "standort",
      "start",
      "sprachniveau",
      "unternehmen",
      "ansprechpartner",
      "email",
      "phone",
      "notiz",
    ],
    required: ["branche", "beruf", "anzahl", "unternehmen", "ansprechpartner", "email"],
  },
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Bẫy bot: ô ẩn, người thật không bao giờ điền.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const kind = body.kind === "personalbedarf" ? "personalbedarf" : "kontakt";
  const spec = FIELDS[kind];
  const data = normalise(body, spec.keys);

  const missing = spec.required.filter((k) => !data[k]);
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing", fields: missing }, { status: 422 });
  }
  if (!isEmail(data.email!)) {
    return NextResponse.json({ ok: false, error: "email", fields: ["email"] }, { status: 422 });
  }

  await saveAnfrage({
    kind,
    locale: typeof body.locale === "string" ? body.locale : "de",
    receivedAt: new Date().toISOString(),
    data,
  });

  return NextResponse.json({ ok: true });
}
