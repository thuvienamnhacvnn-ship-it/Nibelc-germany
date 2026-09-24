/**
 * Trang 07 — screens/07-agent-center.png.
 *
 * Đây là màn hình làm việc nội bộ, KHÔNG phải trang công khai: chưa có đăng
 * nhập, chưa có dữ liệu thật, nên bản này dựng đúng bố cục mẫu với dữ liệu
 * minh hoạ và gắn nhãn rõ ràng, `noindex` + chặn trong robots.
 *
 * Khác mẫu, có chủ đích:
 *  - Mẫu ghi tên người thật ("Dr. Markus Keller", "Le Minh Tran",
 *    "Nguyen Tran"), tên công ty và ngày cụ thể → thay bằng tên minh hoạ
 *    ("Musterbetrieb", "Kandidat A"), không gán cho người có thật.
 *  - Các tỉ lệ 87 % / 95 % / 90 % trong mẫu là điểm số do máy chấm; giữ vai
 *    trò minh hoạ và nói rõ trong nhãn, không phải số liệu thành tích.
 *  - Nút "Freigeben" chỉ là trình bày, chưa nối với hệ thống nào.
 */

interface AgentNavItem {
  label: string;
  icon: string;
  active?: boolean;
}

export const AGENT = {
  badge: "Demoansicht — Beispieldaten, keine echten Personen oder Vorgänge",
  brand: { title: "TalentBridge Deutschland", sub: "Menschen verbinden. Mittelstand stärken." },
  search: "Kandidaten, Jobs, Unternehmen …",
  user: { name: "Beispielnutzer", role: "Recruitment Consultant" },
  nav: [
    { label: "Dashboard", icon: "home" },
    { label: "Agent Center", icon: "bolt", active: true },
    { label: "Kandidaten", icon: "user" },
    { label: "Unternehmen", icon: "building" },
    { label: "Stellen", icon: "briefcase" },
    { label: "Prozesse", icon: "gear" },
    { label: "Dokumente", icon: "doc" },
    { label: "Berichte", icon: "chart" },
    { label: "Wissen", icon: "book" },
    { label: "Einstellungen", icon: "gear" },
  ] as AgentNavItem[],
  promo: { title: ["Internationale", "Talente. Starke", "Zukunft in Deutschland."], sub: "NIBELC TalentBridge" },
  hero: {
    eyebrow: "Agent Center",
    title: "Ihr Assistent für professionelles Recruiting",
    sub: "Schneller kommunizieren. Besser entscheiden. Gemeinsam mehr erreichen.",
    side: ["Kompetenz", "Integration", "Perspektive"],
  },
  chat: {
    partner: { initials: "MB", name: "Musterbetrieb GmbH", role: "Personalreferat", branch: "Maschinenbau", region: "Nordrhein-Westfalen" },
    day: "Beispielverlauf",
    messages: [
      {
        from: "partner" as const,
        time: "10:24",
        text: "Guten Tag, vielen Dank für die zugesandten Profile. Können Sie mir bitte noch ein kurzes Update zu Kandidat A geben? Passt das Profil grundsätzlich zu unserem Bedarf?",
      },
    ],
    agent: {
      name: "NIBELC Agent",
      time: "10:29",
      intro: "Gerne. Kandidat A erfüllt die fachlichen Anforderungen. Ich habe die Unterlagen geprüft und einen Entwurf für Ihre Rückmeldung vorbereitet. Sie können den Text anpassen und anschließend freigeben.",
      draftTitle: "Entwurf: Rückmeldung zu Kandidat A",
      draft:
        "Sehr geehrte Damen und Herren, vielen Dank für Ihre Anfrage. Kandidat A bringt die geforderte Qualifikation als Mechatroniker mit, verfügt über relevante Berufserfahrung und ist an einem langfristigen Einsatz in Ihrem Unternehmen interessiert …",
      actions: ["Bearbeiten", "Entwurf prüfen", "Freigeben"],
      preview: "Vorschau",
      footer: "Beispielansicht — es wird nichts gesendet.",
    },
    input: "Nachricht schreiben …",
  },
  side: {
    job: {
      title: "Stellenbedarf",
      state: "Aktiv",
      role: "Mechatroniker (m/w/d)",
      facts: ["Region Beispielstadt", "Vollzeit", "Ab sofort"],
      text: "Instandhaltung und Montage von Produktionsanlagen. Teamorientiert, Reisebereitschaft innerhalb Deutschlands.",
      link: "Details anzeigen",
    },
    candidate: {
      title: "Kandidat im Fokus",
      name: "Kandidat A",
      role: "Mechatroniker",
      place: "Vietnam / Verfahren läuft",
      match: "87 %",
      matchNote: "Beispielwert",
    },
    documents: {
      title: "Fehlende Dokumente",
      open: "2 offen",
      items: [
        ["Anerkennung Berufsabschluss", "Fehlt"],
        ["Sprachzertifikat Deutsch", "Fehlt"],
        ["Arbeitszeugnis (übersetzt)", "Vorhanden"],
      ] as [string, string][],
    },
    deadlines: {
      title: "Fristen",
      items: [
        ["Rückmeldung an Unternehmen", "in 3 Tagen"],
        ["Voraussichtlicher Start", "nach Abschluss des Verfahrens"],
      ] as [string, string][],
    },
    sources: {
      title: "Quellen & Einschätzung",
      note: "Beispielwerte — zeigen, worauf eine Einschätzung beruht.",
      items: [
        ["Lebenslauf", "95 %"],
        ["Zeugnisse", "90 %"],
        ["Interview-Notizen", "80 %"],
        ["Arbeitsmarkt-Daten (DE)", "70 %"],
      ] as [string, string][],
    },
  },
} as const;
