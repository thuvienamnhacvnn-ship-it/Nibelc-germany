import type { BaiBanDich } from "./articles";

/**
 * CẨM NANG — bản tiếng Anh (Anh-Anh văn phòng). Khoá theo id bài trong
 * data/articles.ts. Số khối, số đoạn, số gạch đầu dòng PHẢI khớp bản gốc
 * (choThieuBaiViet() kiểm). Thuật ngữ hành chính Đức giữ nguyên tiếng Đức.
 */
export const ARTICLES_EN: Record<string, BaiBanDich> = {
  "hoc-tieng-duc-bao-lau": {
    tieuDe: "How long does it take to learn enough German to go?",
    tomTat:
      "Going from zero to B1 usually takes 10 – 14 months of regular study. This article explains how many hours each level needs and why stop-start learning takes twice as long.",
    khoi: [
      {
        tieuDe: "How many hours each level needs",
        doan: [
          "The Common European Framework of Reference divides language ability into six levels, from A1 to C2. People who work or train in Germany usually need B1; some fields, such as nursing and IT, require B2.",
          "Each level typically takes around 180 – 240 hours of classroom teaching, plus roughly the same again in self-study. With four three-hour lessons a week, each level takes about 3 – 4 months.",
        ],
        gach: [
          "A1: greetings, introducing yourself, simple shopping",
          "A2: describing everyday activities, understanding short announcements",
          "B1: handling most situations at work, recounting events, giving your opinion",
          "B2: understanding complex content, discussing professional topics fluently",
        ],
      },
      {
        tieuDe: "Why stop-start learning takes twice as long",
        doan: [
          "German changes word endings according to gender, case and number. This only sticks with constant repetition. A two-week break means relearning part of the grammar almost from scratch.",
          "Learners who attend four lessons a week for 12 months usually pass B1. Learners who study on and off for 20 months are often still at A2. Same number of hours, different result.",
        ],
        luuY: "While you prepare, treat your language course as your main job. It is the investment that decides which vacancies you can apply for and what you will earn.",
      },
      {
        tieuDe: "Learn the vocabulary of your trade early",
        doan: [
          "A B1 certificate gets your application through the door, but what gets you through your first week at work is the vocabulary of your own trade: the names of tools, the names of tasks, your supervisor's instructions.",
          "Ask for a list of specialist vocabulary in advance and learn it alongside your main course — do not wait until you have passed B1.",
        ],
      },
    ],
  },
  "thang-dau-tien-o-duc": {
    tieuDe: "What to do in your first month in Germany",
    tomTat:
      "Anmeldung, health insurance, a bank account, a tax ID — four formalities that must be done early, and they depend on each other in a set order.",
    khoi: [
      {
        tieuDe: "The right order for the four formalities",
        doan: [
          "These four formalities are linked: do them in the wrong order and you have to start again. The order that works is to register your address first, then deal with the rest.",
        ],
        gach: [
          "1. Anmeldung — address registration at the Bürgeramt; you need a confirmation from your landlord (Wohnungsgeberbestätigung)",
          "2. Health insurance — choose a statutory health insurance fund; it issues the insurance number your employer needs for payroll",
          "3. Bank account — you need your Anmeldung certificate and passport",
          "4. Tax ID (Steuer-ID) — sent to you automatically by post once your Anmeldung is complete",
        ],
        luuY: "Without an Anmeldung you will hardly be able to open a bank account, and without a bank account your employer cannot pay your salary. Complete your Anmeldung within the first two weeks.",
      },
      {
        tieuDe: "Documents to carry with you at all times",
        gach: [
          "Passport with visa",
          "A printed copy of your employment contract or training contract",
          "Anmeldung certificate",
          "Health insurance card",
          "Bank account details",
        ],
      },
      {
        tieuDe: "Always open your post",
        doan: [
          "In Germany, everything important arrives by letter: the immigration office, the tax office, insurers, banks. Many letters come with a deadline for replying.",
          "Make sure your name is on the letterbox and open every envelope as soon as it arrives. If you do not understand a letter, take a photo of it and ask an adviser or your mentor at work.",
        ],
      },
    ],
  },
  "doc-bang-luong-duc": {
    tieuDe: "Reading a German payslip: why you receive less than your contract says",
    tomTat:
      "Your contract states gross pay. After income tax and four compulsory insurance contributions, the amount paid into your account is usually 20 – 40% lower. This article explains each line.",
    khoi: [
      {
        tieuDe: "Gross and net",
        doan: [
          "Brutto is gross pay — the figure in your contract. Netto is net pay — the figure that reaches your account. The difference is tax and social insurance, both deducted automatically before you are paid.",
          "This money is not lost. Pension, health, unemployment and long-term care insurance protect you when you are ill, when you lose your job and in old age.",
        ],
      },
      {
        tieuDe: "The four compulsory insurances",
        gach: [
          "Rentenversicherung — pension insurance, around 9.3% employee share",
          "Krankenversicherung — health insurance, around 8.5% depending on the fund",
          "Pflegeversicherung — long-term care insurance, around 1.8%, plus a surcharge if you have no children",
          "Arbeitslosenversicherung — unemployment insurance, around 1.3%",
        ],
        doan: ["Your employer pays a similar share on top; that part does not appear in the net figure on your payslip."],
      },
      {
        tieuDe: "Your tax class makes a big difference",
        doan: [
          "Single people are placed in tax class I. Married people whose spouse earns less may be placed in class III and pay considerably less tax. This is worth asking about as soon as you arrive, because if you apply late you have to wait for the annual tax return to get the money back.",
        ],
        luuY: "Submit a tax return (Steuererklärung) at the end of each year. Many employees get a significant refund for commuting costs, training costs and the cost of supporting dependants.",
      },
    ],
  },
  "van-hoa-lam-viec-duc": {
    tieuDe: "German working culture: the five biggest surprises",
    tomTat:
      "Strict punctuality, direct communication, reporting sick the proper way, going home when your shift ends, and holiday as an entitlement rather than a favour.",
    khoi: [
      {
        tieuDe: "On time means five minutes early",
        doan: [
          "In Germany, arriving exactly at the start of your shift already counts as late: that is the time you must be ready to work, not the time you walk through the gate. Repeated lateness is an entirely lawful reason to terminate a contract.",
        ],
      },
      {
        tieuDe: "Being direct is not being rude",
        doan: [
          "Germans give feedback directly and specifically. It can sound harsh if you are used to softer language, but it is how they work with everyone and it is not aimed at you personally.",
          "In return, if you do not understand a task, you must say so straight away. Nodding silently and then doing it wrong is judged far more harshly than asking again.",
        ],
      },
      {
        tieuDe: "If you are ill, report it — properly",
        doan: [
          "You must tell your employer you are ill before your shift starts, on the very first day. If you are off for longer than the set number of days, you need a doctor's certificate (Arbeitsunfähigkeitsbescheinigung).",
          "If you report sick correctly, you continue to be paid as the law requires. Staying away without notice is treated as abandoning your job.",
        ],
        luuY: "Ask in your first week: who you report sickness to, which phone number to use, and from which day you need a doctor's certificate.",
      },
      {
        tieuDe: "Go home when your shift ends — and holiday is your right",
        doan: [
          "German law limits working hours and requires a rest period between two shifts. Staying on is not seen as hard work; it is seen as working inefficiently or breaking the rules.",
          "The days of annual leave in your contract are your entitlement. Book them in advance through your employer's procedure — there is no need to ask as a favour.",
        ],
      },
    ],
  },
  "tranh-lua-dao": {
    tieuDe: "Eight signs that a job offer cannot be trusted",
    tomTat:
      "A guaranteed visa, pressure to pay a deposit quickly, no chance to read the contract before signing — these are signs to stop and check.",
    khoi: [
      {
        tieuDe: "Eight signs to stop",
        gach: [
          "A guarantee that your visa will be approved. Nobody can guarantee this, because the decision lies with the German consular authorities.",
          "Pressure to transfer money the same day, with the excuse that places are running out.",
          "No access to the full employment contract before you sign.",
          "Earnings far above the usual level for that occupation, with no explanation why.",
          "No clear name of the employer or the place of work.",
          "A request to pay into a personal account instead of a company account.",
          "No invoice and no receipt for any payment.",
          "Contact only through social media accounts, with no office address you can visit.",
        ],
      },
      {
        tieuDe: "Three things to do before you sign anything",
        gach: [
          "Ask for a translation of the contract into your own language and read every clause on pay, working hours, accommodation and duration.",
          "Visit the company's office in person at least once. A real address, real people, real desks.",
          "Ask directly: if the visa application is refused, which payments are refunded, how quickly, and in which clause of the contract this is written.",
        ],
        luuY: "Any promise only counts once it is written into the contract. Promises made by phone or text message are not legally binding.",
      },
    ],
  },
  "dinh-cu-va-gia-dinh": {
    tieuDe: "From work permit to permanent residence and bringing your family",
    tomTat:
      "The path from a work visa to a permanent settlement permit, and the conditions for bringing your spouse and children to Germany.",
    khoi: [
      {
        tieuDe: "The three stages of residence documents",
        gach: [
          "Visa (Visum) — issued by the embassy, valid for a short period to allow entry.",
          "Residence permit (Aufenthaltserlaubnis) — issued by the immigration office after arrival, tied to your job or training programme.",
          "Settlement permit (Niederlassungserlaubnis) — unlimited, granted once you have lived in Germany long enough, paid into the pension insurance for long enough, reached the required language level and can support yourself.",
        ],
      },
      {
        tieuDe: "Bringing your family over",
        doan: [
          "Bringing a spouse and minor children to join you is a right under German law, but it comes with conditions: housing of sufficient size, an income that supports the whole family without benefits, and, as a rule, basic German for the family member joining you.",
          "This means your income and housing situation in the first few years directly affect when your family can join you.",
        ],
        luuY: "Every year of pension contributions counts. That is one more reason to work under a proper contract and avoid undeclared work.",
      },
    ],
  },
  "gui-tien-ve-nha": {
    tieuDe: "Sending money home: how not to lose out",
    tomTat:
      "Transfer fees and exchange rates eat into your money more than you might think. This article explains how to compare the real cost and what to avoid.",
    khoi: [
      {
        tieuDe: "The real cost has two parts",
        doan: [
          "The fee shown on screen is only one part. The rest is hidden in the exchange rate: a provider may charge no fee but apply a rate a few per cent below the market rate.",
          "The right way to compare is to look at how much your family receives for the same amount in euros, not at the fee line.",
        ],
      },
      {
        tieuDe: "What to avoid",
        gach: [
          "Sending cash home with acquaintances, with no paperwork at all.",
          "Using unlicensed services that promise unusually high exchange rates.",
          "Sending all your earnings home in the first month without keeping a reserve.",
        ],
        luuY: "Always keep a reserve of at least one month's living costs in Germany. A rental deposit, medical costs or a month of late pay can all happen.",
      },
    ],
  },
  "chuan-bi-hanh-ly": {
    tieuDe: "What to pack for Germany — and what to leave behind",
    tomTat:
      "Checked baggage has a weight limit. The list below prioritises things that are hard to find or expensive in Germany and leaves out items that only add weight.",
    khoi: [
      {
        tieuDe: "Do pack",
        gach: [
          "All original documents and their translations, in your hand luggage",
          "Any medication you take, with the prescription translated into English or German",
          "Glasses, safety shoes or tools of your trade you are used to, if they are light",
          "Thermal base layers — the German winter is longer than you think",
          "A few compact, dried spices from home",
        ],
      },
      {
        tieuDe: "Do not pack",
        gach: [
          "Fresh food, meat or dairy products — EU entry rules ban them and they will be confiscated",
          "Bulky pots, pans and bedding — second-hand items are very cheap in Germany",
          "A heavy winter coat — better to buy one locally to suit the climate",
          "Large amounts of undeclared cash — above the legal threshold you must declare it to customs",
        ],
        luuY: "Photograph all important documents and save them in your own email account. If your luggage is lost, you still have copies to get replacements.",
      },
    ],
  },
};
