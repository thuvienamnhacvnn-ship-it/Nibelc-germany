import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Icon } from "@/components/ui/Icon";
import { INDUSTRY_ASSETS } from "@/content/industry-assets";
import { ROUTES } from "@/content/locales";
import { AGENT } from "@/content/page-agent";

/**
 * Trang 07 — màn hình làm việc nội bộ, dựng theo screens/07-agent-center.png.
 * Toàn bộ dữ liệu là minh hoạ; không có đăng nhập, không gửi đi đâu cả.
 */
export function AgentCenterView() {
  const t = AGENT;

  return (
    <div className="min-h-screen bg-[#eef3f9] text-[#10284d]">
      <p className="bg-[#0b2a52] px-4 py-2 text-center text-xs text-white/90">{t.badge}</p>

      <div className="flex">
        {/* Cột trái */}
        <aside className="hidden w-[272px] shrink-0 bg-[#0b2a52] text-white lg:block">
          <Link href={ROUTES.home.de as Route} className="flex h-[78px] items-center px-6">
            <Image src="/nibelc-logo-dark.svg" alt="NIBELC GmbH" width={1201} height={376} className="h-9 w-auto" />
          </Link>
          <nav aria-label="Arbeitsbereich" className="mt-2">
            <ul>
              {t.nav.map((n) => (
                <li key={n.label}>
                  <span
                    className={`flex items-center gap-3 px-6 py-3 text-[15px] ${
                      n.active ? "border-l-4 border-[var(--nb-orange)] bg-white/10 pl-5 font-semibold" : "text-white/80"
                    }`}
                  >
                    <Icon name={n.icon} className={`h-5 w-5 ${n.active ? "text-[var(--nb-orange)]" : "text-white/70"}`} strokeWidth={1.7} />
                    {n.label}
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="m-5 mt-8 overflow-hidden rounded-xl bg-[#123a6d]">
            <div className="relative h-32">
              <Image src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero} alt="" fill sizes="272px" className="object-cover opacity-70" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#123a6d] to-transparent" aria-hidden="true" />
            </div>
            <div className="p-4">
              <p className="text-sm leading-6 font-semibold">
                {t.promo.title.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <span className="mt-3 block h-[3px] w-10 bg-[var(--nb-orange)]" aria-hidden="true" />
              <p className="mt-3 text-xs text-white/70">{t.promo.sub}</p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Thanh trên */}
          <header className="flex h-[78px] min-w-0 items-center gap-4 bg-white px-4 ring-1 ring-[#e3e9f1] lg:gap-6 lg:px-6">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold">{t.brand.title}</p>
              <p className="truncate text-sm text-[#5b6b80]">{t.brand.sub}</p>
            </div>
            <label className="ml-auto hidden max-w-[500px] flex-1 items-center gap-3 rounded-lg border border-[#cdd8e6] px-4 py-2.5 md:flex">
              <Icon name="search" className="h-5 w-5 text-[#5b6b80]" strokeWidth={2} />
              <span className="sr-only">Suche</span>
              <input disabled placeholder={t.search} className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a99ad]" />
            </label>
            <span className="relative max-sm:hidden">
              <Icon name="chat" className="h-6 w-6 text-[#5b6b80]" strokeWidth={1.7} />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d64545] text-[11px] font-bold text-white">3</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfe7f1] text-sm font-bold text-[#0b2a52]">BN</span>
              <span className="hidden text-sm sm:block">
                <b className="block font-semibold">{t.user.name}</b>
                <span className="text-[#5b6b80]">{t.user.role}</span>
              </span>
            </span>
          </header>

          {/* Dải hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block">
              <Image src={INDUSTRY_ASSETS["akademische-fachkraefte"]!.hero} alt="" fill sizes="55vw" className="object-cover" style={{ objectPosition: "60% 50%" }} />
              <span className="absolute inset-0" style={{ background: "linear-gradient(90deg,#eef3f9 0,rgba(238,243,249,.6) 25%,rgba(238,243,249,0) 60%)" }} aria-hidden="true" />
            </div>
            <div className="relative px-6 py-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#1f3a60] uppercase">{t.hero.eyebrow}</p>
              <h1 className="mt-2 max-w-[20ch] text-3xl font-extrabold tracking-[-0.02em] lg:text-[34px]">{t.hero.title}</h1>
              <p className="mt-2 text-lg text-[#5b6b80]">{t.hero.sub}</p>
            </div>
            <ul className="absolute top-8 right-6 hidden border-l-2 border-[var(--nb-orange)] pl-3 text-xs tracking-[0.18em] text-[#1f3a60] uppercase xl:block">
              {t.hero.side.map((s) => (
                <li key={s} className="py-0.5">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Khu làm việc */}
          <div className="grid gap-5 px-6 pb-10 xl:grid-cols-[1.7fr_1fr]">
            {/* Hộp trò chuyện */}
            <section className="min-w-0 rounded-xl bg-white ring-1 ring-[#e3e9f1]">
              <header className="flex min-w-0 items-center gap-4 border-b border-[#e3e9f1] p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfe7f1] font-bold text-[#0b2a52]">
                  {t.chat.partner.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">{t.chat.partner.name}</p>
                  <p className="truncate text-sm text-[#5b6b80]">
                    {t.chat.partner.role} | {t.chat.partner.branch} | {t.chat.partner.region}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-4 text-[#1f4f9f]">
                  <Icon name="phone" className="h-5 w-5" strokeWidth={1.8} />
                  <Icon name="play" className="h-5 w-5" />
                </span>
              </header>

              <div className="space-y-5 p-5">
                <p className="mx-auto w-fit rounded-full bg-[#f0f4fa] px-4 py-1 text-xs text-[#5b6b80]">{t.chat.day}</p>

                {t.chat.messages.map((m) => (
                  <div key={m.time} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfe7f1] text-xs font-bold text-[#0b2a52]">
                      {t.chat.partner.initials}
                    </span>
                    <p className="max-w-[80%] rounded-xl bg-[#f3f6fb] px-4 py-3 text-[15px] leading-6">
                      {m.text}
                      <span className="mt-1 block text-right text-xs text-[#8a99ad]">{m.time}</span>
                    </p>
                  </div>
                ))}

                <div className="rounded-xl bg-[#eef4fd] p-5 ring-1 ring-[#d7e3f7]">
                  <p className="flex items-center gap-2 font-semibold text-[#1647a8]">
                    <Icon name="bolt" className="h-5 w-5" strokeWidth={1.8} />
                    {t.chat.agent.name}
                  </p>
                  <p className="mt-2 text-[15px] leading-6">{t.chat.agent.intro}</p>

                  <div className="mt-4 rounded-lg bg-white p-4 ring-1 ring-[#dbe4f0]">
                    <div className="flex items-start gap-3">
                      <Icon name="doc" className="mt-0.5 h-5 w-5 shrink-0 text-[#1f4f9f]" strokeWidth={1.7} />
                      <p className="font-semibold">{t.chat.agent.draftTitle}</p>
                      <span className="ml-auto flex shrink-0 items-center gap-2 rounded-md bg-[#f3f6fb] px-3 py-1.5 text-xs text-[#5b6b80]">
                        <Icon name="search" className="h-4 w-4" strokeWidth={2} />
                        {t.chat.agent.preview}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#5b6b80]">{t.chat.agent.draft}</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      {t.chat.agent.actions.map((a, i) => (
                        <span
                          key={a}
                          className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold ${
                            i === 2 ? "bg-[#12448f] text-white" : "bg-[#f3f6fb] text-[#10284d] ring-1 ring-[#dbe4f0]"
                          }`}
                        >
                          {i === 2 && <Icon name="send" className="h-4 w-4" strokeWidth={1.9} />}
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-right text-xs text-[#8a99ad]">{t.chat.agent.time}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex flex-1 items-center gap-3 rounded-lg border border-[#cdd8e6] px-4 py-3 text-sm text-[#8a99ad]">
                    <Icon name="folder" className="h-5 w-5" strokeWidth={1.7} />
                    {t.chat.input}
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#12448f] text-white">
                    <Icon name="send" className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                </div>
                <p className="text-center text-xs text-[#8a99ad]">{t.chat.agent.footer}</p>
              </div>
            </section>

            {/* Cột phải */}
            <aside className="min-w-0 space-y-4">
              <section className="rounded-xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                <div className="flex items-center gap-2">
                  <Icon name="briefcase" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.7} />
                  <h2 className="font-bold">{t.side.job.title}</h2>
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-[#e9f7ee] px-3 py-1 text-xs font-semibold text-[#16a34a]">
                    <Icon name="checkCircle" className="h-4 w-4" />
                    {t.side.job.state}
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold">{t.side.job.role}</p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5b6b80]">
                  {t.side.job.facts.map((f, i) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Icon name={["pin", "clock", "calendar"][i]!} className="h-4 w-4" strokeWidth={1.7} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-6 text-[#2a3d58]">{t.side.job.text}</p>
                <p className="mt-3 text-sm font-semibold text-[#1647a8]">{t.side.job.link} →</p>
              </section>

              <section className="rounded-xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dfe7f1] text-sm font-bold text-[#0b2a52]">KA</span>
                  <div className="min-w-0">
                    <p className="font-bold">{t.side.candidate.name}</p>
                    <p className="text-sm text-[#5b6b80]">{t.side.candidate.role}</p>
                    <p className="text-xs text-[#8a99ad]">{t.side.candidate.place}</p>
                  </div>
                  <span className="ml-auto rounded-lg bg-[#e9f7ee] px-3 py-2 text-center">
                    <b className="block text-lg text-[#16a34a]">{t.side.candidate.match}</b>
                    <span className="text-[10px] text-[#5b6b80]">{t.side.candidate.matchNote}</span>
                  </span>
                </div>
              </section>

              <section className="rounded-xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                <div className="flex items-center gap-2">
                  <Icon name="doc" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.7} />
                  <h2 className="font-bold">{t.side.documents.title}</h2>
                  <span className="ml-auto rounded-full bg-[#fdeaea] px-3 py-1 text-xs font-semibold text-[#c04343]">{t.side.documents.open}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {t.side.documents.items.map(([name, state]) => (
                    <li key={name} className="flex items-center gap-2">
                      <Icon name="doc" className={`h-4 w-4 ${state === "Vorhanden" ? "text-[#16a34a]" : "text-[#c04343]"}`} strokeWidth={1.7} />
                      <span className="text-[#2a3d58]">{name}</span>
                      <span className={`ml-auto font-semibold ${state === "Vorhanden" ? "text-[#16a34a]" : "text-[#c04343]"}`}>{state}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                <div className="flex items-center gap-2">
                  <Icon name="calendar" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.7} />
                  <h2 className="font-bold">{t.side.deadlines.title}</h2>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {t.side.deadlines.items.map(([name, when]) => (
                    <li key={name} className="flex items-center gap-2">
                      <Icon name="clock" className="h-4 w-4 text-[#5b6b80]" strokeWidth={1.7} />
                      <span className="text-[#2a3d58]">{name}</span>
                      <span className="ml-auto font-semibold text-[#c05621]">{when}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl bg-white p-5 ring-1 ring-[#e3e9f1]">
                <div className="flex items-center gap-2">
                  <Icon name="chart" className="h-5 w-5 text-[#1f4f9f]" strokeWidth={1.7} />
                  <h2 className="font-bold">{t.side.sources.title}</h2>
                </div>
                <p className="mt-1 text-xs text-[#8a99ad]">{t.side.sources.note}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {t.side.sources.items.map(([name, score]) => (
                    <li key={name} className="flex items-center gap-2">
                      <Icon name="doc" className="h-4 w-4 text-[#5b6b80]" strokeWidth={1.7} />
                      <span className="text-[#2a3d58]">{name}</span>
                      <span className="ml-auto rounded-full bg-[#eef4fd] px-2.5 py-0.5 text-xs font-semibold text-[#1647a8]">{score}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
