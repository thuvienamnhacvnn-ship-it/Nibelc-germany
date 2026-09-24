import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PrintButton } from "@/components/process/PrintButton";
import { Icon } from "@/components/ui/Icon";
import { PAGE_HERO } from "@/content/industry-assets";
import { ROUTES, type Locale } from "@/content/locales";
import { navFor, requestLabel } from "@/content/nav-menu";
import { PROCESS, SAMPLE_STATUS, type ProcessLane, type StepStatus } from "@/content/page-process";

/**
 * Trang 06 — screens/06-prozess.png. Bố cục bị khoá.
 *
 * Toạ độ desktop (1 --u = 1px ảnh mẫu, y tính từ đỉnh trang):
 *   header sáng 0–78 (logo x34, tagline x240, nav x553 cách 24, nút navy x1445–1638)
 *   hero 78–405: chữ trái x37, ảnh phải từ x≈700, câu nghiêng góc phải x1525
 *   hàng 6 bước 405–520: vòng số tâm x 233/470/707/945/1187/1417, y 439
 *   nhãn làn x22–183: Unternehmen 520–648, Bewerber 657–788
 *   6 thẻ mỗi làn: x 192/430/668/907/1146/1395, rộng 230/230/231/232/241/255
 *   dải kết 806–918 x22–1650
 */

const STEP_X = [233, 470, 707, 945, 1187, 1417];
const ICON_X = [273, 513, 750, 988, 1228, 1458];
const STEP_ICON = ["users", "search", "doc", "shield", "plane", "home"];
const CARD_X = [192, 430, 668, 907, 1146, 1395];
const CARD_W = [230, 230, 231, 232, 241, 255];
const LANE = { company: { y: 115, h: 128 }, candidate: { y: 252, h: 131 } } as const;
const VALUE_X = [556, 761, 951, 1181];
const VALUE_ICON = ["users", "gear", "shield", "sprout"];

const u = (n: number) => `calc(${n} * var(--u))`;

function box(x: number, y: number, w: number, h: number): CSSProperties {
  return { ["--x" as string]: x, ["--y" as string]: y, ["--w" as string]: w, ["--h" as string]: h } as CSSProperties;
}
const ABS =
  "lg:absolute lg:left-[calc(var(--x)*var(--u))] lg:top-[calc(var(--y)*var(--u))] lg:w-[calc(var(--w)*var(--u))] lg:h-[calc(var(--h)*var(--u))]";

const STATUS_STYLE: Record<StepStatus, { icon: string; cls: string }> = {
  done: { icon: "checkCircle", cls: "text-[#16a34a]" },
  active: { icon: "checkCircle", cls: "text-[#1d5fd6]" },
  open: { icon: "circleOpen", cls: "text-[#6b7a8f]" },
};

function LaneCard({
  lane,
  status,
  statusLabel,
  responsible,
  style,
}: {
  lane: ProcessLane;
  status: StepStatus;
  statusLabel: string;
  responsible: string;
  style: CSSProperties;
}) {
  const s = STATUS_STYLE[status];
  return (
    <div
      className={`${ABS} relative rounded-lg bg-white p-4 ring-1 ring-[#e3e9f1] shadow-[0_6px_18px_-12px_rgba(15,35,64,.35)] lg:rounded-[calc(8*var(--u))] lg:px-[calc(14*var(--u))] lg:pt-[calc(10*var(--u))] lg:pb-0`}
      style={style}
    >
      <ul className="space-y-1 lg:space-y-0">
        {lane.bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-[#2a3d58] lg:gap-[calc(9*var(--u))] lg:text-[calc(12*var(--u))] lg:leading-[calc(16.5*var(--u))]">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#2a3d58] lg:mt-[calc(7*var(--u))] lg:h-[calc(4*var(--u))] lg:w-[calc(4*var(--u))]" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 lg:absolute lg:inset-x-[calc(10*var(--u))] lg:bottom-[calc(9*var(--u))] lg:mt-0 lg:gap-[calc(8*var(--u))]">
        <Icon name="user" className="h-4 w-4 shrink-0 text-[#1f4f9f] lg:h-[calc(17*var(--u))] lg:w-[calc(17*var(--u))]" strokeWidth={2} />
        <span className="text-xs leading-tight whitespace-nowrap text-[#2a3d58] lg:text-[calc(10.5*var(--u))] lg:leading-[calc(15*var(--u))]">
          <b className="block font-semibold text-[#10284d]">{responsible}</b>
          {lane.role}
        </span>
        <span className={`ml-auto flex items-center gap-1 text-xs font-medium whitespace-nowrap lg:gap-[calc(4*var(--u))] lg:text-[calc(10*var(--u))] ${s.cls}`}>
          <Icon name={s.icon} className="h-4 w-4 lg:h-[calc(16*var(--u))] lg:w-[calc(16*var(--u))]" strokeWidth={1.8} />
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export function ProcessView({ locale }: { locale: Locale }) {
  const t = PROCESS[locale];
  const employers = ROUTES.employers[locale];

  return (
    <>
      <SiteHeader locale={locale} page="process" variant="light" />

      <main id="inhalt" className="bg-[#f3f6fb]">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden bg-[#f1f5fa] lg:h-[calc(327*var(--u))]">
          <div className="relative aspect-[16/9] lg:nb-photo-right lg:absolute lg:inset-y-0 lg:left-[calc(700*var(--u))] lg:aspect-auto">
            <Image
              src={PAGE_HERO.prozess}
              alt=""
              fill
              priority
              sizes="(min-width:1024px) 60vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "70% 62%" }}
            />
          </div>
          <div
            className="nb-photo-right absolute inset-y-0 left-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, #f1f5fa 0, #f1f5fa calc(700 * var(--u)), rgba(241,245,250,.6) calc(770 * var(--u)), rgba(241,245,250,0) calc(860 * var(--u)))",
            }}
            aria-hidden="true"
          />
          {/* Góc phải: phủ kín thành nền sáng để câu nghiêng không nằm lên
              mặt người trong ảnh (ảnh KIT có người trải hết bề ngang). */}
          <div
            className="absolute inset-y-0 right-0 hidden w-[calc(360*var(--u))] lg:block"
            style={{
              background:
                "linear-gradient(270deg, #eef3f9 0, #eef3f9 calc(185 * var(--u)), rgba(238,243,249,.82) calc(250 * var(--u)), rgba(238,243,249,0) 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute hidden -rotate-[5deg] text-[#1b3a6b] lg:block"
            style={{ left: u(1525), top: u(17) }}
            aria-hidden="true"
          >
            <p className="text-[calc(18*var(--u))] leading-[calc(25*var(--u))] tracking-[0.05em] uppercase">
              {t.side.title.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
            <span className="mt-[calc(26*var(--u))] ml-[calc(25*var(--u))] block h-[calc(3*var(--u))] w-[calc(40*var(--u))] bg-[var(--nb-orange)]" />
            <p className="mt-[calc(16*var(--u))] ml-[calc(40*var(--u))] text-[calc(12*var(--u))] leading-[calc(17*var(--u))] tracking-[0.1em] uppercase">
              {t.side.sub.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </div>

          <div className="relative px-4 py-8 lg:absolute lg:top-0 lg:left-[calc(37*var(--u))] lg:w-[calc(800*var(--u))] lg:p-0">
            <p className="text-xs font-medium tracking-[0.2em] text-[#1f3a60] uppercase lg:mt-[calc(30*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(16*var(--u))]">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.025em] text-[#0f1f45] lg:mt-[calc(14*var(--u))] lg:text-[calc(50*var(--u))] lg:leading-[calc(52*var(--u))]">
              {t.h1[0]}
              <br />
              {t.h1[1]}
            </h1>
            <p className="mt-3 text-lg text-[#3a4a5e] lg:mt-[calc(5*var(--u))] lg:text-[calc(19.5*var(--u))] lg:leading-[calc(26*var(--u))] lg:whitespace-nowrap">
              {t.sub[0]}
              <br className="hidden lg:block" /> {t.sub[1]}
            </p>
            <ul className="mt-6 flex flex-wrap gap-5 lg:mt-[calc(24*var(--u))] lg:flex-nowrap lg:gap-0">
              {t.trust.map(([a, b], i) => (
                <li key={a} className="flex items-center gap-3 lg:gap-[calc(13*var(--u))]" style={{ ["--w" as string]: [258, 276, 230][i] } as CSSProperties} data-lgw>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#1f4f9f] text-[#1f4f9f] lg:h-[calc(50*var(--u))] lg:w-[calc(50*var(--u))] lg:border-[calc(2*var(--u))]">
                    <Icon name={["users", "shield", "chart"][i]!} className="h-6 w-6 lg:h-[calc(26*var(--u))] lg:w-[calc(26*var(--u))]" strokeWidth={1.7} />
                  </span>
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(13.5*var(--u))] lg:leading-[calc(20*var(--u))] lg:whitespace-nowrap">
                    <b className="block font-semibold text-[#10284d]">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- SÁU BƯỚC + HAI LÀN ---------------- */}
        <section className="relative px-4 py-8 lg:h-[calc(401*var(--u))] lg:p-0">
          <div className="absolute inset-x-0 top-0 hidden h-[calc(115*var(--u))] bg-white/75 lg:block" aria-hidden="true" />
          <p className="relative mb-4 flex flex-col items-end gap-1 text-xs text-[#1d5fd6] lg:absolute lg:top-[calc(14*var(--u))] lg:right-[calc(22*var(--u))] lg:mb-0 lg:gap-[calc(3*var(--u))] lg:text-[calc(10.5*var(--u))]">
            <PrintButton label={t.pdf} className="flex items-center gap-1 hover:underline lg:gap-[calc(5*var(--u))]" />
            <span className="text-[#6b7a8f] lg:text-[calc(9.5*var(--u))]">{t.sample}</span>
          </p>

          {/* Hàng tiêu đề 6 bước (desktop) */}
          <ol className="relative hidden lg:block">
            {t.steps.map((s, i) => (
              <li key={s.title}>
                <span
                  className={`absolute flex h-[calc(36*var(--u))] w-[calc(36*var(--u))] -translate-x-1/2 items-center justify-center rounded-full text-[calc(17*var(--u))] font-bold text-white shadow-[0_4px_12px_-4px_rgba(29,95,214,.6)] ${
                    i === 0 ? "bg-[var(--nb-orange)]" : "bg-[#0b4ea2]"
                  }`}
                  style={{ left: u(STEP_X[i]!), top: u(16) }}
                >
                  {i + 1}
                </span>
                <span className="absolute w-px bg-[#d6dee8]" style={{ left: u(STEP_X[i]!), top: u(52), height: u(63) }} aria-hidden="true" />
                <span className="absolute" style={{ left: u(ICON_X[i]!), top: u(17) }}>
                  <Icon name={STEP_ICON[i]!} className="h-[calc(34*var(--u))] w-[calc(34*var(--u))] text-[#1f4f9f]" strokeWidth={1.6} />
                </span>
                {i < 5 && (
                  <span
                    className="absolute h-px bg-[#1f4f9f]/70"
                    style={{ left: u(ICON_X[i]! + 46), top: u(34), width: u(STEP_X[i + 1]! - 30 - ICON_X[i]! - 46) }}
                    aria-hidden="true"
                  />
                )}
                <span className="absolute whitespace-nowrap" style={{ left: u(ICON_X[i]! - 2), top: u(51) }}>
                  <b className="block text-[calc(15.5*var(--u))] leading-[calc(20*var(--u))] font-bold text-[#10284d]">{s.title}</b>
                  <span className="mt-[calc(3*var(--u))] block text-[calc(12.5*var(--u))] leading-[calc(15*var(--u))] text-[#6b7a8f]">
                    {s.sub[0]}
                    <br />
                    {s.sub[1]}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          {/* Nhãn hai làn */}
          {(["company", "candidate"] as const).map((k) => (
            <div
              key={k}
              className={`${ABS} mt-6 flex items-center gap-4 rounded-lg px-5 py-4 text-white lg:mt-0 lg:flex-col lg:items-start lg:justify-center lg:gap-[calc(6*var(--u))] lg:rounded-[calc(8*var(--u))] lg:px-[calc(24*var(--u))] lg:py-0 ${
                k === "company" ? "bg-[#0b3a80]" : "bg-[#1450b0]"
              }`}
              style={box(22, LANE[k].y, 161, LANE[k].h)}
            >
              <Icon name={k === "company" ? "building" : "user"} className="h-8 w-8 lg:h-[calc(36*var(--u))] lg:w-[calc(36*var(--u))]" strokeWidth={1.6} />
              <span>
                <b className={`block text-lg font-bold whitespace-nowrap lg:leading-[calc(22*var(--u))] ${t.lanes[k][0].length > 11 ? "lg:text-[calc(15.5*var(--u))]" : "lg:text-[calc(17.5*var(--u))]"}`}>{t.lanes[k][0]}</b>
                <span className="block text-sm text-white/85 lg:text-[calc(13*var(--u))]">{t.lanes[k][1]}</span>
              </span>
            </div>
          ))}

          {/* Thẻ theo bước — mobile: mỗi bước một khối gồm tiêu đề + 2 thẻ */}
          <div className="mt-4 grid gap-4 lg:contents">
            {t.steps.map((s, i) => (
              <div key={s.title} className="grid gap-2 lg:contents">
                <p className="mt-2 flex items-center gap-3 font-bold text-[#10284d] lg:hidden">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${i === 0 ? "bg-[var(--nb-orange)]" : "bg-[#0b4ea2]"}`}>{i + 1}</span>
                  {s.title}
                  <span className="font-normal text-[#6b7a8f]">
                    · {s.sub[0]} {s.sub[1]}
                  </span>
                </p>
                {(["company", "candidate"] as const).map((k) => (
                  <LaneCard
                    key={k}
                    lane={s[k]}
                    status={SAMPLE_STATUS[i]!}
                    statusLabel={t.status[SAMPLE_STATUS[i]!]}
                    responsible={t.responsible}
                    style={box(CARD_X[i]!, LANE[k].y, CARD_W[i]!, LANE[k].h)}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- DẢI KẾT ---------------- */}
        <section className="px-4 pb-8 lg:relative lg:h-[calc(135*var(--u))] lg:p-0">
          <div className="relative grid gap-5 rounded-xl bg-[#edf2f9] p-5 ring-1 ring-[#dfe7f1] lg:absolute lg:left-[calc(22*var(--u))] lg:block lg:h-[calc(112*var(--u))] lg:w-[calc(1628*var(--u))] lg:rounded-[calc(10*var(--u))] lg:p-0">
            <div className="flex gap-4 lg:absolute lg:top-[calc(16*var(--u))] lg:left-[calc(28*var(--u))] lg:w-[calc(475*var(--u))] lg:gap-[calc(16*var(--u))]">
              <Icon name="chart" className="h-12 w-12 shrink-0 text-[#1f4f9f] lg:mt-[calc(8*var(--u))] lg:h-[calc(50*var(--u))] lg:w-[calc(50*var(--u))]" strokeWidth={3} />
              <div>
                <h2 className="text-xl font-bold text-[#10284d] lg:text-[calc(19*var(--u))] lg:leading-[calc(21*var(--u))]">
                  {t.closing.title[0]}
                  <br />
                  {t.closing.title[1]}
                </h2>
                <p className="mt-2 text-sm text-[#2a3d58] lg:mt-[calc(4*var(--u))] lg:w-[calc(400*var(--u))] lg:text-[calc(12.5*var(--u))] lg:leading-[calc(19*var(--u))]">
                  {t.closing.text}
                </p>
              </div>
            </div>
            <span className="absolute hidden w-px bg-[#c9d6ea] lg:block" style={{ left: u(510), top: u(16), height: u(80) }} aria-hidden="true" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:contents">
              {t.values.map(([a, b], i) => (
                <li key={a} className="flex items-center gap-3 lg:absolute lg:top-[calc(37*var(--u))] lg:gap-[calc(13*var(--u))]" style={{ left: u(VALUE_X[i]!) }}>
                  <Icon name={VALUE_ICON[i]!} className="h-9 w-9 shrink-0 text-[#1f4f9f] lg:h-[calc(38*var(--u))] lg:w-[calc(38*var(--u))]" strokeWidth={1.6} />
                  <span className="text-sm text-[#2a3d58] lg:text-[calc(12*var(--u))] lg:leading-[calc(19*var(--u))] lg:whitespace-nowrap">
                    <b className="block font-semibold text-[#10284d] lg:text-[calc(13.5*var(--u))]">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <div className="lg:absolute lg:top-[calc(19*var(--u))] lg:left-[calc(1381*var(--u))]">
              <Link
                href={`${employers}#beratung` as Route}
                className="inline-flex items-center justify-center gap-3 rounded-md bg-[var(--nb-orange)] px-6 py-3 font-semibold text-white shadow-[0_8px_18px_-8px_rgba(255,106,19,.8)] hover:bg-[var(--nb-orange-dark)] lg:h-[calc(43*var(--u))] lg:w-[calc(214*var(--u))] lg:gap-[calc(12*var(--u))] lg:rounded-[calc(6*var(--u))] lg:p-0 lg:text-[calc(15*var(--u))]"
              >
                {t.closingCta}
                <Icon name="arrowRight" className="h-4 w-4 lg:h-[calc(17*var(--u))] lg:w-[calc(17*var(--u))]" strokeWidth={2} />
              </Link>
              <p className="mt-2 text-sm text-[#3a4a5e] lg:mt-[calc(15*var(--u))] lg:text-[calc(12.5*var(--u))]">{t.closingClaim}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
