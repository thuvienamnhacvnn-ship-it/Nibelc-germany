import { tuDien } from "../dict";

/**
 * VỀ CHÚNG TÔI — /ve-chung-toi. Con số trên trang tính từ dữ liệu (số đơn,
 * số suất, số nước, số nhóm ngành), không ghi cứng ở đây.
 */
type Muc = { ten: string; mo: string };

export const veChungToi = tuDien<{
  meta: { tieuDe: string; moTa: string };
  hero: { tieuDe: string; mo: string };
  ai: { tieuDe: string; doan1: (ten: string) => string; doan2: string; nut: string };
  nganh: { pflege: string; gastronomie: string; elektro: string; bau: string };
  conSo: {
    tieuDe: string;
    don: Muc;
    suat: Muc;
    nuoc: Muc;
    nhomNganh: Muc;
  };
  lamGi: {
    tieuDe: string;
    don: Muc & { nut: string };
    nghe: Muc & { nut: string };
    dongHanh: Muc & { nut: string };
  };
  giaTri: { tieuDe: string; ds: [Muc, Muc, Muc, Muc] };
  ketNoi: { tieuDe: string; mo: string; ds: [Muc, Muc, Muc] };
}>({
  vi: {
    meta: {
      tieuDe: "Về NIBELC — Kết nối con người, kiến tạo cơ hội",
      moTa: "NIBELC GROUP GERMANY đồng hành cùng người Việt trên hành trình học tập và làm việc tại Đức, châu Âu.",
    },
    hero: {
      tieuDe: "Kết nối con người – Kiến tạo cơ hội",
      mo: "Đồng hành cùng người Việt trên hành trình học tập và làm việc tại Đức, châu Âu.",
    },
    ai: {
      tieuDe: "Chúng tôi là ai",
      doan1: (ten) => `${ten} là cầu nối giữa người Việt và thị trường lao động, giáo dục nghề nghiệp tại Đức và châu Âu.`,
      doan2:
        "Chúng tôi mang đến cơ hội việc làm, du học nghề và phát triển sự nghiệp bền vững thông qua mạng lưới đối tác uy tín, quy trình chuyên nghiệp và đội ngũ giàu kinh nghiệm. Với sự am hiểu văn hoá, luật pháp và thị trường địa phương, NIBELC đồng hành cùng học viên và người lao động trên toàn bộ hành trình — từ Việt Nam đến khi ổn định cuộc sống và công việc tại Đức.",
      nut: "Bắt đầu hành trình cùng NIBELC",
    },
    nganh: {
      pflege: "Điều dưỡng / Y tế",
      gastronomie: "Nhà hàng / Khách sạn",
      elektro: "Điện / Điện tử",
      bau: "Xây dựng / Nội thất",
    },
    conSo: {
      tieuDe: "Những con số tạo nên niềm tin",
      don: { ten: "đơn hàng đang tuyển", mo: "Cập nhật theo thông báo tuyển dụng thật" },
      suat: { ten: "suất tuyển", mo: "Tổng số suất của các đơn đang mở" },
      nuoc: { ten: "quốc gia", mo: "Đức và các nước châu Âu lân cận" },
      nhomNganh: { ten: "nhóm ngành nghề", mo: "Từ điều dưỡng tới công nghệ thông tin" },
    },
    lamGi: {
      tieuDe: "Chúng tôi làm gì",
      don: {
        ten: "Đơn hàng việc làm",
        mo: "Tuyển chọn và giới thiệu vị trí tại doanh nghiệp Đức và châu Âu, theo đúng thông báo tuyển dụng của đối tác.",
        nut: "Xem đơn hàng",
      },
      nghe: {
        ten: "Du học nghề Ausbildung",
        mo: "Chương trình học nghề kép tại Đức: vừa học vừa làm, có lương đào tạo và bằng nghề được công nhận.",
        nut: "Tìm hiểu ngành",
      },
      dongHanh: {
        ten: "Đồng hành trọn hành trình",
        mo: "Từ hồ sơ, tiếng Đức, visa cho tới khi ổn định công việc và cuộc sống tại nước sở tại.",
        nut: "Xem lộ trình",
      },
    },
    giaTri: {
      tieuDe: "Giá trị cốt lõi",
      ds: [
        { ten: "Uy tín", mo: "Đặt lợi ích của học viên và người lao động lên hàng đầu." },
        { ten: "Minh bạch", mo: "Thông tin rõ ràng, quy trình chuyên nghiệp, không hứa suông." },
        { ten: "Đồng hành", mo: "Hỗ trợ tận tâm trước, trong và sau khi sang Đức." },
        { ten: "Phát triển bền vững", mo: "Kiến tạo tương lai lâu dài cho mỗi cá nhân." },
      ],
    },
    ketNoi: {
      tieuDe: "Kết nối Việt Nam – Đức và hoà nhập châu Âu",
      mo: "Chúng tôi xây dựng cầu nối vững chắc giữa người Việt và thị trường Đức, mở ra cơ hội học tập, làm việc và phát triển sự nghiệp tại châu Âu.",
      ds: [
        { ten: "Con người là trung tâm", mo: "Mỗi hồ sơ là một con người, không phải một con số." },
        { ten: "Cơ hội toàn cầu", mo: "Mạng lưới đối tác tại Đức và các nước châu Âu." },
        { ten: "Tương lai vững chắc", mo: "Từ tri thức và nghề nghiệp, không phải may rủi." },
      ],
    },
  },
  en: {
    meta: {
      tieuDe: "About NIBELC — Connecting people, creating opportunities",
      moTa: "NIBELC GROUP GERMANY supports people from Vietnam on their journey to study and work in Germany and Europe.",
    },
    hero: {
      tieuDe: "Connecting people – Creating opportunities",
      mo: "Supporting people from Vietnam on their journey to study and work in Germany and Europe.",
    },
    ai: {
      tieuDe: "Who we are",
      doan1: (ten) =>
        `${ten} is a bridge between people from Vietnam and the labour market and vocational education system in Germany and Europe.`,
      doan2:
        "We offer opportunities for employment, vocational training and long-term career development through a network of reputable partners, professional processes and an experienced team. With a sound understanding of local culture, law and the labour market, NIBELC supports trainees and workers throughout the entire journey — from Vietnam until they are settled in their life and work in Germany.",
      nut: "Start your journey with NIBELC",
    },
    nganh: {
      pflege: "Nursing / Healthcare",
      gastronomie: "Hospitality / Hotels",
      elektro: "Electrical / Electronics",
      bau: "Construction / Interiors",
    },
    conSo: {
      tieuDe: "Figures that build trust",
      don: { ten: "open vacancies", mo: "Updated from genuine job advertisements" },
      suat: { ten: "places available", mo: "Total places across all open vacancies" },
      nuoc: { ten: "countries", mo: "Germany and neighbouring European countries" },
      nhomNganh: { ten: "occupational sectors", mo: "From nursing to information technology" },
    },
    lamGi: {
      tieuDe: "What we do",
      don: {
        ten: "Job vacancies",
        mo: "Selecting candidates and placing them in positions with employers in Germany and Europe, exactly as advertised by our partners.",
        nut: "View vacancies",
      },
      nghe: {
        ten: "Ausbildung — vocational training",
        mo: "Dual vocational training in Germany: learning while working, with a training allowance and a recognised qualification.",
        nut: "Explore occupations",
      },
      dongHanh: {
        ten: "Support every step of the way",
        mo: "From your application, German lessons and visa through to settling into work and life in your new country.",
        nut: "View the process",
      },
    },
    giaTri: {
      tieuDe: "Core values",
      ds: [
        { ten: "Integrity", mo: "We put the interests of trainees and workers first." },
        { ten: "Transparency", mo: "Clear information, professional processes, no empty promises." },
        { ten: "Partnership", mo: "Dedicated support before, during and after the move to Germany." },
        { ten: "Sustainable growth", mo: "Building a long-term future for every individual." },
      ],
    },
    ketNoi: {
      tieuDe: "Connecting Vietnam and Germany, integrating into Europe",
      mo: "We build a solid bridge between people from Vietnam and the German labour market, opening up opportunities to study, work and develop a career in Europe.",
      ds: [
        { ten: "People at the centre", mo: "Every application is a person, not a number." },
        { ten: "Global opportunities", mo: "A network of partners in Germany and across Europe." },
        { ten: "A secure future", mo: "Built on knowledge and skills, not on luck." },
      ],
    },
  },
  de: {
    meta: {
      tieuDe: "Über NIBELC – Menschen verbinden, Chancen schaffen",
      moTa: "Die NIBELC GROUP GERMANY begleitet Menschen aus Vietnam auf ihrem Weg zu Ausbildung und Arbeit in Deutschland und Europa.",
    },
    hero: {
      tieuDe: "Menschen verbinden – Chancen schaffen",
      mo: "Wir begleiten Menschen aus Vietnam auf ihrem Weg zu Ausbildung und Arbeit in Deutschland und Europa.",
    },
    ai: {
      tieuDe: "Wer wir sind",
      doan1: (ten) =>
        `Die ${ten} ist die Brücke zwischen Menschen aus Vietnam und dem Arbeitsmarkt sowie der Berufsbildung in Deutschland und Europa.`,
      doan2:
        "Wir eröffnen Chancen auf Beschäftigung, Ausbildung und eine nachhaltige berufliche Entwicklung – durch ein Netzwerk seriöser Partner, professionelle Abläufe und ein erfahrenes Team. Mit fundierter Kenntnis der Kultur, des Rechts und des Arbeitsmarkts vor Ort begleitet NIBELC Auszubildende und Beschäftigte auf dem gesamten Weg – von Vietnam bis zum gefestigten Leben und Arbeiten in Deutschland.",
      nut: "Starten Sie Ihren Weg mit NIBELC",
    },
    nganh: {
      pflege: "Pflege / Gesundheit",
      gastronomie: "Gastronomie / Hotellerie",
      elektro: "Elektro / Elektronik",
      bau: "Bau / Innenausbau",
    },
    conSo: {
      tieuDe: "Zahlen, die Vertrauen schaffen",
      don: { ten: "offene Stellenangebote", mo: "Aktualisiert anhand echter Stellenausschreibungen" },
      suat: { ten: "zu besetzende Plätze", mo: "Gesamtzahl der Plätze aller offenen Stellen" },
      nuoc: { ten: "Länder", mo: "Deutschland und benachbarte europäische Länder" },
      nhomNganh: { ten: "Berufsfelder", mo: "Von der Pflege bis zur Informationstechnik" },
    },
    lamGi: {
      tieuDe: "Was wir tun",
      don: {
        ten: "Stellenangebote",
        mo: "Auswahl und Vermittlung für Stellen bei Unternehmen in Deutschland und Europa – genau nach den Ausschreibungen unserer Partner.",
        nut: "Stellenangebote ansehen",
      },
      nghe: {
        ten: "Ausbildung in Deutschland",
        mo: "Duale Berufsausbildung in Deutschland: Lernen und Arbeiten zugleich, mit Ausbildungsvergütung und anerkanntem Berufsabschluss.",
        nut: "Berufe entdecken",
      },
      dongHanh: {
        ten: "Begleitung auf dem ganzen Weg",
        mo: "Von den Bewerbungsunterlagen über Deutschkurs und Visum bis zum gefestigten Arbeits- und Lebensalltag im Zielland.",
        nut: "Ablauf ansehen",
      },
    },
    giaTri: {
      tieuDe: "Unsere Werte",
      ds: [
        { ten: "Verlässlichkeit", mo: "Die Interessen von Auszubildenden und Beschäftigten stehen bei uns an erster Stelle." },
        { ten: "Transparenz", mo: "Klare Informationen, professionelle Abläufe, keine leeren Versprechen." },
        { ten: "Begleitung", mo: "Engagierte Unterstützung vor, während und nach dem Umzug nach Deutschland." },
        { ten: "Nachhaltige Entwicklung", mo: "Eine langfristige Perspektive für jeden Einzelnen." },
      ],
    },
    ketNoi: {
      tieuDe: "Vietnam und Deutschland verbinden – in Europa ankommen",
      mo: "Wir bauen eine tragfähige Brücke zwischen Menschen aus Vietnam und dem deutschen Arbeitsmarkt und eröffnen Chancen für Ausbildung, Arbeit und berufliche Entwicklung in Europa.",
      ds: [
        { ten: "Der Mensch im Mittelpunkt", mo: "Hinter jeder Bewerbung steht ein Mensch, keine Nummer." },
        { ten: "Internationale Chancen", mo: "Ein Partnernetzwerk in Deutschland und ganz Europa." },
        { ten: "Eine sichere Zukunft", mo: "Gebaut auf Wissen und Können, nicht auf Glück." },
      ],
    },
  },
});
