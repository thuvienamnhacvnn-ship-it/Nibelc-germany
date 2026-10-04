import { tuDien } from "../dict";
import { tien } from "../format";

/**
 * KHU ĐƠN HÀNG — /don-hang, /don-hang/[slug], JobMarketplace, SearchCommandBar,
 * JobCard, JobCardSang, JobRow, JobGallery, chuoiLuong()/tenNhaTuyenDung().
 *
 * Nhãn các trường dạng MÃ của đơn (hình thức, chương trình, kỳ lương) nằm ở
 * NHAN_DON_HANG trong data/i18n/jobs.ts. Tên ngành: tenNganh().
 * Bộ lọc giữ GIÁ TRỊ theo dữ liệu gốc, chỉ nhãn đi qua đây.
 */

/** Mã kinh nghiệm của bộ lọc — trùng giá trị `experience` gốc trong dữ liệu */
export const MA_KINH_NGHIEM = ["Không yêu cầu", "Có kinh nghiệm"] as const;
export type MaKinhNghiem = (typeof MA_KINH_NGHIEM)[number];

export const donHang = tuDien<{
  meta: {
    tieuDe: string;
    moTa: string;
    chiTietTieuDe: (ten: string, noi: string) => string;
    /** `tieng` là nhãn ngôn ngữ ĐÃ dựng sẵn ("Tiếng Đức A2 – B1"), hoặc
        chuỗi rỗng khi chưa biết đơn cần tiếng gì — khi đó bỏ hẳn mệnh đề. */
    chiTietMoTa: (ten: string, noi: string, luong: string, suat: number, tieng: string) => string;
  };
  hero: { nhan: string; tieuDe: string; mo: string; tatCa: string };
  dangTaiLoc: string;

  // giá trị chung của một đơn
  doiTacTai: (thanhPho: string) => string;
  theoThoaThuan: string;
  soNguoi: (n: number) => string;
  soSuat: (n: number) => string;
  /** nhãn trên thẻ khi đơn cần tiếng ĐỨC — "Tiếng Đức A2 – B1" */
  tiengDuc: (trinhDo: string) => string;
  /** nhãn trên thẻ khi đơn cần tiếng ANH */
  tiengAnh: (trinhDo: string) => string;
  xemChiTiet: string;
  tai: (ten: string, thanhPho: string) => string;
  mau: string;
  noiBat: string;
  soLuong: string;
  thuNhap: string;
  anh: (i: number) => string;

  // sàn đơn hàng
  loc: {
    nganh: string;
    thanhPho: string;
    quocGia: string;
    luong: string;
    tieng: string;
    kinhNghiem: string;
    chuongTrinh: string;
    tatCaNganh: string;
    soNganhChon: (n: number) => string;
    tatCaThanhPho: string;
    tatCaQuocGia: string;
    tatCaLuong: string;
    tatCaTrinhDo: string;
    tatCaKinhNghiem: string;
    tatCaChuongTrinh: string;
    tatCa: string;
    tuMuc: (n: number) => string;
    kinhNghiemNhan: Record<MaKinhNghiem, string>;
  };
  timGoiY: string;
  timAria: string;
  boLoc: string;
  boLocTimKiem: string;
  boLocAria: string;
  xoa: (n: number) => string;
  xoaHetSo: (n: number) => string;
  dongBoLoc: string;
  donMoiNhat: string;
  hienThi: (da: number, tong: number) => string;
  luoi: string;
  danhSach: string;
  sapXepTheo: string;
  sapXep: string;
  sx: { moi: string; luongCao: string; suatNhieu: string };
  dangLoc: string;
  boLocChip: (nhan: string) => string;
  xoaTatCa: string;
  khongKhop: string;
  thuBoBot: string;
  xoaBoLoc: string;
  daXem: (da: number, tong: number) => string;
  xemThem: (n: number) => string;
  xemSoDon: (n: number) => string;

  // thanh 5 ô
  thanh: {
    aria: string;
    timNganh: string;
    nganhAria: string;
    thanhPhoBang: string;
    thanhPhoAria: string;
    tatCaDiaDiem: string;
    mucLuong: string;
    luongAria: string;
    loaiChuongTrinh: string;
    trinhDo: string;
    timKiem: string;
  };

  // trang chi tiết
  ct: {
    duongDan: string;
    donHang: string;
    duLieuMau: string;
    noiLamViec: string;
    soLuong: string;
    tiengDuc: string;
    tiengAnh: string;
    /** nhãn ô thông tin khi chưa biết đơn cần tiếng gì */
    ngoaiNgu: string;
    chuongTrinh: string;
    gioLam: string;
    gioTuan: (h: number) => string;
    theoHopDong: string;
    hinhThuc: string;
    moTa: string;
    viTri: string;
    yeuCau: string;
    quyenLoi: string;
    quyTrinh: string;
    buoc: [string, string, string, string];
    soSuat: string;
    kinhNghiem: string;
    ungTuyen: string;
    goi: (sdt: string) => string;
    ghiChu: string;
    cungNganh: string;
  };
}>({
  vi: {
    meta: {
      tieuDe: "Đơn hàng — Cơ hội nghề nghiệp tại Đức",
      moTa: "Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn. Lọc theo ngành, thành phố, mức lương và trình độ ngoại ngữ.",
      chiTietTieuDe: (ten, noi) => `${ten} — ${noi}`,
      chiTietMoTa: (ten, noi, luong, suat, tieng) =>
        `${ten} tại ${noi}. ${luong}, ${suat} suất${tieng ? `, ${tieng}` : ""}.`,
    },
    hero: {
      nhan: "Sàn đơn hàng",
      tieuDe: "Cơ hội nghề nghiệp tại Đức",
      mo: "Tìm kiếm đơn hàng phù hợp với ngành nghề, khu vực và kinh nghiệm của bạn.",
      tatCa: "Tất cả đơn hàng",
    },
    dangTaiLoc: "Đang tải bộ lọc…",

    doiTacTai: (tp) => `Đối tác tại ${tp}`,
    theoThoaThuan: "Theo thoả thuận",
    soNguoi: (n) => `${n} người`,
    soSuat: (n) => `${n} suất`,
    tiengDuc: (td) => `Tiếng Đức ${td}`,
    tiengAnh: (td) => `Tiếng Anh ${td}`,
    xemChiTiet: "Xem chi tiết",
    tai: (ten, tp) => `${ten} tại ${tp}`,
    mau: "MẪU",
    noiBat: "NỔI BẬT",
    soLuong: "Số lượng",
    thuNhap: "Thu nhập",
    anh: (i) => `Ảnh ${i}`,

    loc: {
      nganh: "Ngành nghề",
      thanhPho: "Thành phố",
      quocGia: "Quốc gia / Bang",
      luong: "Mức lương tối thiểu",
      tieng: "Trình độ ngoại ngữ",
      kinhNghiem: "Kinh nghiệm",
      chuongTrinh: "Chương trình",
      tatCaNganh: "Tất cả ngành nghề",
      soNganhChon: (n) => `${n} ngành đã chọn`,
      tatCaThanhPho: "Tất cả thành phố",
      tatCaQuocGia: "Tất cả quốc gia",
      tatCaLuong: "Tất cả mức lương",
      tatCaTrinhDo: "Tất cả trình độ",
      tatCaKinhNghiem: "Tất cả kinh nghiệm",
      tatCaChuongTrinh: "Tất cả chương trình",
      tatCa: "Tất cả",
      tuMuc: (n) => `Từ ${tien(n, "vi")}`,
      kinhNghiemNhan: { "Không yêu cầu": "Không yêu cầu", "Có kinh nghiệm": "Có kinh nghiệm" },
    },
    timGoiY: "Tìm đơn hàng…",
    timAria: "Tìm đơn hàng",
    boLoc: "Bộ lọc",
    boLocTimKiem: "Bộ lọc tìm kiếm",
    boLocAria: "Bộ lọc đơn hàng",
    xoa: (n) => `Xoá (${n})`,
    xoaHetSo: (n) => `Xoá hết (${n})`,
    dongBoLoc: "Đóng bộ lọc",
    donMoiNhat: "Đơn hàng mới nhất",
    hienThi: (da, tong) => `Hiển thị ${da} trong ${tong} đơn hàng`,
    luoi: "Lưới",
    danhSach: "Danh sách",
    sapXepTheo: "Sắp xếp theo",
    sapXep: "Sắp xếp",
    sx: { moi: "Mới nhất", luongCao: "Lương cao nhất", suatNhieu: "Nhiều suất nhất" },
    dangLoc: "Đang lọc:",
    boLocChip: (nhan) => `Bỏ lọc ${nhan}`,
    xoaTatCa: "Xoá tất cả",
    khongKhop: "Không có đơn hàng nào khớp bộ lọc",
    thuBoBot: "Thử bỏ bớt điều kiện hoặc mở rộng mức lương.",
    xoaBoLoc: "Xoá bộ lọc",
    daXem: (da, tong) => `Đã xem ${da} / ${tong} đơn hàng`,
    xemThem: (n) => `Xem thêm ${n} đơn hàng`,
    xemSoDon: (n) => `Xem ${n} đơn hàng`,

    thanh: {
      aria: "Tìm đơn hàng",
      timNganh: "Tìm ngành nghề",
      nganhAria: "Ngành nghề",
      thanhPhoBang: "Thành phố / Bang",
      thanhPhoAria: "Thành phố",
      tatCaDiaDiem: "Tất cả địa điểm",
      mucLuong: "Mức lương",
      luongAria: "Mức lương tối thiểu",
      loaiChuongTrinh: "Loại chương trình",
      trinhDo: "Trình độ ngoại ngữ",
      timKiem: "Tìm kiếm",
    },

    ct: {
      duongDan: "Đường dẫn",
      donHang: "Đơn hàng",
      duLieuMau: "DỮ LIỆU MẪU",
      noiLamViec: "Nơi làm việc",
      soLuong: "Số lượng",
      tiengDuc: "Tiếng Đức",
      tiengAnh: "Tiếng Anh",
      ngoaiNgu: "Ngoại ngữ",
      chuongTrinh: "Chương trình",
      gioLam: "Giờ làm",
      gioTuan: (h) => `${h} giờ / tuần`,
      theoHopDong: "Theo hợp đồng",
      hinhThuc: "Hình thức",
      moTa: "Mô tả công việc",
      viTri: "Vị trí tuyển dụng",
      yeuCau: "Yêu cầu",
      quyenLoi: "Quyền lợi",
      quyTrinh: "Quy trình tham gia",
      buoc: [
        "Gửi hồ sơ và được chuyên viên đánh giá",
        "Học ngoại ngữ tới trình độ đơn hàng yêu cầu",
        "Phỏng vấn với chủ sử dụng lao động",
        "Ký hợp đồng, nộp hồ sơ visa và xuất cảnh",
      ],
      soSuat: "Số suất",
      kinhNghiem: "Kinh nghiệm",
      ungTuyen: "ỨNG TUYỂN NGAY",
      goi: (sdt) => `Gọi ${sdt}`,
      ghiChu:
        "Thông tin trong trang lấy theo thông báo tuyển dụng của đơn hàng. Điều kiện cuối cùng nằm trong hợp đồng lao động bạn ký với chủ sử dụng.",
      cungNganh: "Đơn hàng cùng ngành",
    },
  },

  en: {
    meta: {
      tieuDe: "Vacancies — Career opportunities in Germany",
      moTa: "Find vacancies that match your occupation, preferred region and experience. Filter by sector, city, salary and level of German.",
      chiTietTieuDe: (ten, noi) => `${ten} — ${noi}`,
      chiTietMoTa: (ten, noi, luong, suat, tieng) =>
        `${ten} in ${noi}. ${luong}, ${suat} ${suat === 1 ? "position" : "positions"}${tieng ? `, ${tieng}` : ""}.`,
    },
    hero: {
      nhan: "Vacancy board",
      tieuDe: "Career opportunities in Germany",
      mo: "Find vacancies that match your occupation, preferred region and experience.",
      tatCa: "All vacancies",
    },
    dangTaiLoc: "Loading filters…",

    doiTacTai: (tp) => `Partner employer in ${tp}`,
    theoThoaThuan: "Negotiable",
    soNguoi: (n) => `${n} ${n === 1 ? "person" : "people"}`,
    soSuat: (n) => `${n} ${n === 1 ? "position" : "positions"}`,
    tiengDuc: (td) => `German ${td}`,
    tiengAnh: (td) => `English ${td}`,
    xemChiTiet: "View details",
    tai: (ten, tp) => `${ten} in ${tp}`,
    mau: "SAMPLE",
    noiBat: "FEATURED",
    soLuong: "Openings",
    thuNhap: "Pay",
    anh: (i) => `Photo ${i}`,

    loc: {
      nganh: "Sector",
      thanhPho: "City",
      quocGia: "Country / State",
      luong: "Minimum salary",
      tieng: "Language level",
      kinhNghiem: "Experience",
      chuongTrinh: "Programme",
      tatCaNganh: "All sectors",
      soNganhChon: (n) => `${n} ${n === 1 ? "sector" : "sectors"} selected`,
      tatCaThanhPho: "All cities",
      tatCaQuocGia: "All countries",
      tatCaLuong: "Any salary",
      tatCaTrinhDo: "All levels",
      tatCaKinhNghiem: "Any experience",
      tatCaChuongTrinh: "All programmes",
      tatCa: "All",
      tuMuc: (n) => `From ${tien(n, "en")}`,
      kinhNghiemNhan: { "Không yêu cầu": "No experience required", "Có kinh nghiệm": "Experience required" },
    },
    timGoiY: "Search vacancies…",
    timAria: "Search vacancies",
    boLoc: "Filters",
    boLocTimKiem: "Search filters",
    boLocAria: "Vacancy filters",
    xoa: (n) => `Clear (${n})`,
    xoaHetSo: (n) => `Clear all (${n})`,
    dongBoLoc: "Close filters",
    donMoiNhat: "Latest vacancies",
    hienThi: (da, tong) => `Showing ${da} of ${tong} vacancies`,
    luoi: "Grid",
    danhSach: "List",
    sapXepTheo: "Sort by",
    sapXep: "Sort",
    sx: { moi: "Newest", luongCao: "Highest salary", suatNhieu: "Most openings" },
    dangLoc: "Active filters:",
    boLocChip: (nhan) => `Remove filter ${nhan}`,
    xoaTatCa: "Clear all",
    khongKhop: "No vacancies match your filters",
    thuBoBot: "Try removing some filters or widening the salary range.",
    xoaBoLoc: "Clear filters",
    daXem: (da, tong) => `Viewed ${da} of ${tong} vacancies`,
    xemThem: (n) => `Show ${n} more ${n === 1 ? "vacancy" : "vacancies"}`,
    xemSoDon: (n) => `Show ${n} ${n === 1 ? "vacancy" : "vacancies"}`,

    thanh: {
      aria: "Search vacancies",
      timNganh: "Sector",
      nganhAria: "Sector",
      thanhPhoBang: "City / State",
      thanhPhoAria: "City",
      tatCaDiaDiem: "All locations",
      mucLuong: "Salary",
      luongAria: "Minimum salary",
      loaiChuongTrinh: "Programme type",
      trinhDo: "Language level",
      timKiem: "Search",
    },

    ct: {
      duongDan: "Breadcrumb",
      donHang: "Vacancies",
      duLieuMau: "SAMPLE DATA",
      noiLamViec: "Location",
      soLuong: "Openings",
      tiengDuc: "German",
      tiengAnh: "English",
      ngoaiNgu: "Language",
      chuongTrinh: "Programme",
      gioLam: "Working hours",
      gioTuan: (h) => `${h} hours / week`,
      theoHopDong: "As per contract",
      hinhThuc: "Employment type",
      moTa: "Job description",
      viTri: "Positions",
      yeuCau: "Requirements",
      quyenLoi: "Benefits",
      quyTrinh: "How it works",
      buoc: [
        "Submit your application and have it assessed by an adviser",
        "Learn the language to the level this vacancy requires",
        "Interview with the employer",
        "Sign the contract, apply for your visa and travel",
      ],
      soSuat: "Openings",
      kinhNghiem: "Experience",
      ungTuyen: "APPLY NOW",
      goi: (sdt) => `Call ${sdt}`,
      ghiChu:
        "The information on this page is taken from the job notice for this vacancy. The final terms are set out in the employment contract you sign with the employer.",
      cungNganh: "Vacancies in the same sector",
    },
  },

  de: {
    meta: {
      tieuDe: "Stellenangebote – Berufliche Chancen in Deutschland",
      moTa: "Finden Sie Stellenangebote passend zu Ihrem Beruf, Ihrer Wunschregion und Ihrer Erfahrung. Filtern Sie nach Branche, Stadt, Gehalt und Sprachniveau.",
      chiTietTieuDe: (ten, noi) => `${ten} – ${noi}`,
      chiTietMoTa: (ten, noi, luong, suat, tieng) =>
        `${ten} in ${noi}. ${luong}, ${suat} ${suat === 1 ? "Stelle" : "Stellen"}${tieng ? `, ${tieng}` : ""}.`,
    },
    hero: {
      nhan: "Stellenbörse",
      tieuDe: "Berufliche Chancen in Deutschland",
      mo: "Finden Sie Stellenangebote passend zu Ihrem Beruf, Ihrer Wunschregion und Ihrer Erfahrung.",
      tatCa: "Alle Stellenangebote",
    },
    dangTaiLoc: "Filter werden geladen …",

    doiTacTai: (tp) => `Partnerunternehmen in ${tp}`,
    theoThoaThuan: "Nach Vereinbarung",
    soNguoi: (n) => `${n} ${n === 1 ? "Person" : "Personen"}`,
    soSuat: (n) => `${n} ${n === 1 ? "Stelle" : "Stellen"}`,
    tiengDuc: (td) => `Deutsch ${td}`,
    tiengAnh: (td) => `Englisch ${td}`,
    xemChiTiet: "Zur Stelle",
    tai: (ten, tp) => `${ten} in ${tp}`,
    mau: "MUSTER",
    noiBat: "TOP-ANGEBOT",
    soLuong: "Anzahl",
    thuNhap: "Vergütung",
    anh: (i) => `Bild ${i}`,

    loc: {
      nganh: "Branche",
      thanhPho: "Stadt",
      quocGia: "Land / Bundesland",
      luong: "Mindestgehalt",
      tieng: "Sprachniveau",
      kinhNghiem: "Berufserfahrung",
      chuongTrinh: "Programm",
      tatCaNganh: "Alle Branchen",
      soNganhChon: (n) => `${n} ${n === 1 ? "Branche" : "Branchen"} ausgewählt`,
      tatCaThanhPho: "Alle Städte",
      tatCaQuocGia: "Alle Länder",
      tatCaLuong: "Jedes Gehalt",
      tatCaTrinhDo: "Alle Niveaus",
      tatCaKinhNghiem: "Alle",
      tatCaChuongTrinh: "Alle Programme",
      tatCa: "Alle",
      tuMuc: (n) => `Ab ${tien(n, "de")}`,
      kinhNghiemNhan: { "Không yêu cầu": "Keine erforderlich", "Có kinh nghiệm": "Erforderlich" },
    },
    timGoiY: "Stellen suchen…",
    timAria: "Stellenangebote suchen",
    boLoc: "Filter",
    boLocTimKiem: "Suchfilter",
    boLocAria: "Filter für Stellenangebote",
    xoa: (n) => `Zurücksetzen (${n})`,
    xoaHetSo: (n) => `Alle zurücksetzen (${n})`,
    dongBoLoc: "Filter schließen",
    donMoiNhat: "Neueste Stellenangebote",
    hienThi: (da, tong) => `${da} von ${tong} Stellenangeboten`,
    luoi: "Raster",
    danhSach: "Liste",
    sapXepTheo: "Sortieren nach",
    sapXep: "Sortierung",
    sx: { moi: "Neueste", luongCao: "Höchstes Gehalt", suatNhieu: "Meiste Stellen" },
    dangLoc: "Aktive Filter:",
    boLocChip: (nhan) => `Filter ${nhan} entfernen`,
    xoaTatCa: "Alle zurücksetzen",
    khongKhop: "Keine Stellenangebote entsprechen Ihren Filtern",
    thuBoBot: "Entfernen Sie einzelne Filter oder erweitern Sie den Gehaltsbereich.",
    xoaBoLoc: "Filter zurücksetzen",
    daXem: (da, tong) => `${da} von ${tong} Stellenangeboten angesehen`,
    xemThem: (n) => `${n} weitere ${n === 1 ? "Stelle" : "Stellen"} anzeigen`,
    xemSoDon: (n) => `${n} ${n === 1 ? "Stellenangebot" : "Stellenangebote"} anzeigen`,

    thanh: {
      aria: "Stellenangebote suchen",
      timNganh: "Branche",
      nganhAria: "Branche",
      thanhPhoBang: "Stadt / Bundesland",
      thanhPhoAria: "Stadt",
      tatCaDiaDiem: "Alle Orte",
      mucLuong: "Gehalt",
      luongAria: "Mindestgehalt",
      loaiChuongTrinh: "Programmart",
      trinhDo: "Sprachniveau",
      timKiem: "Suchen",
    },

    ct: {
      duongDan: "Brotkrumennavigation",
      donHang: "Stellenangebote",
      duLieuMau: "MUSTERDATEN",
      noiLamViec: "Arbeitsort",
      soLuong: "Anzahl",
      tiengDuc: "Deutsch",
      tiengAnh: "Englisch",
      ngoaiNgu: "Sprache",
      chuongTrinh: "Programm",
      gioLam: "Arbeitszeit",
      gioTuan: (h) => `${h} Std. / Woche`,
      theoHopDong: "Laut Vertrag",
      hinhThuc: "Beschäftigungsart",
      moTa: "Stellenbeschreibung",
      viTri: "Offene Positionen",
      yeuCau: "Anforderungen",
      quyenLoi: "Leistungen",
      quyTrinh: "Ablauf",
      buoc: [
        "Unterlagen einreichen und von unseren Beratern prüfen lassen",
        "Die Sprache bis zum geforderten Niveau lernen",
        "Vorstellungsgespräch mit dem Arbeitgeber",
        "Vertrag unterschreiben, Visum beantragen und die Reise antreten",
      ],
      soSuat: "Anzahl Stellen",
      kinhNghiem: "Berufserfahrung",
      ungTuyen: "JETZT BEWERBEN",
      goi: (sdt) => `Anrufen: ${sdt}`,
      ghiChu:
        "Die Angaben auf dieser Seite stammen aus der Stellenausschreibung. Maßgeblich sind die Bedingungen im Arbeitsvertrag, den Sie mit dem Arbeitgeber schließen.",
      cungNganh: "Stellenangebote derselben Branche",
    },
  },
});
