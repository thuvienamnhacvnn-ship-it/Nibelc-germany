// Nội dung nghiệp vụ mang sang từ dự án nibel-de — cùng một công ty, cùng
// một bộ quy tắc biên tập (không nêu tuổi/giới tính, không nêu phí).
/**
 * DU HỌC NGHỀ (Ausbildung) — nửa còn lại của chuyên môn NIBELC.
 *
 * Quy tắc nội dung ở file này:
 *  - Chỉ nêu thông tin quy định công khai của Đức (BBiG, AufenthG, BA).
 *  - Mọi con số thu nhập đều là KHOẢNG THAM KHẢO theo ngành, kèm ghi chú;
 *    không gán số cho một doanh nghiệp cụ thể nào.
 *  - Không nêu tuổi / giới tính (AGG), không nêu phí dịch vụ.
 */

export interface NganhHoc {
  id: string;
  ten: string;
  tenDuc: string;
  icon: string;
  /** Số năm đào tạo kép */
  nam: string;
  /** Yêu cầu tiếng Đức tối thiểu thường gặp */
  tieng: string;
  /** Trợ cấp học nghề tham khảo, EUR/tháng gộp, theo từng năm */
  troCap: [number, number, number];
  /** Thu nhập khởi điểm sau khi ra nghề, EUR/tháng gộp */
  sauNghe: [number, number];
  tomTat: string;
  hocGi: string[];
  lamGi: string[];
  hopVoi: string[];
  trienVong: string;
}

export const NGANH_HOC: NganhHoc[] = [
  {
    id: "dieu-duong",
    ten: "Điều dưỡng",
    tenDuc: "Pflegefachmann / Pflegefachfrau",
    icon: "heart",
    nam: "3 năm",
    tieng: "B1, một số bang yêu cầu B2",
    troCap: [1250, 1310, 1420],
    sauNghe: [3000, 3600],
    tomTat:
      "Nghề thiếu nhân lực nhất nước Đức. Bằng điều dưỡng Đức được công nhận trong toàn khối EU và là con đường ngắn nhất tới cư trú dài hạn.",
    hocGi: [
      "Chăm sóc người bệnh và người cao tuổi",
      "Kiến thức y học cơ sở, dược, vệ sinh",
      "Giao tiếp với bệnh nhân và thân nhân",
      "Ghi chép hồ sơ chăm sóc theo chuẩn Đức",
    ],
    lamGi: [
      "Bệnh viện, phòng khám chuyên khoa",
      "Viện dưỡng lão (Pflegeheim)",
      "Dịch vụ chăm sóc tại nhà (ambulante Pflege)",
    ],
    hopVoi: ["Kiên nhẫn, chịu được ca kíp", "Thích chăm sóc người khác", "Học tiếng tốt"],
    trienVong:
      "Sau khi ra nghề có thể học tiếp chuyên sâu (gây mê, hồi sức, quản lý điều dưỡng) hoặc học lên đại học ngành điều dưỡng.",
  },
  {
    id: "nha-hang-khach-san",
    ten: "Nhà hàng – khách sạn",
    tenDuc: "Koch / Hotelfachmann / Restaurantfachmann",
    icon: "utensils",
    nam: "3 năm",
    tieng: "B1",
    troCap: [1000, 1100, 1200],
    sauNghe: [2400, 3000],
    tomTat:
      "Ngành dễ vào nhất với người Việt: tay nghề bếp tốt, môi trường quốc tế, nhiều khách sạn lớn nhận học viên nước ngoài.",
    hocGi: [
      "Kỹ thuật bếp Âu, bếp lạnh, bếp nóng",
      "Vệ sinh an toàn thực phẩm HACCP",
      "Phục vụ, lễ tân, đặt phòng",
      "Tính giá, quản lý kho hàng",
    ],
    lamGi: ["Khách sạn 3–5 sao", "Nhà hàng, quán ăn, hệ thống chuỗi", "Bộ phận tiệc và sự kiện"],
    hopVoi: ["Nhanh tay, chịu được áp lực giờ cao điểm", "Thích nấu ăn, thích giao tiếp"],
    trienVong:
      "Lên bếp phó, bếp trưởng, hoặc học tiếp Meister để tự mở nhà hàng tại Đức.",
  },
  {
    id: "co-khi",
    ten: "Cơ khí – cơ điện tử",
    tenDuc: "Industriemechaniker / Mechatroniker",
    icon: "gear",
    nam: "3,5 năm",
    tieng: "B1, ưu tiên B2",
    troCap: [1100, 1180, 1280],
    sauNghe: [2900, 3600],
    tomTat:
      "Xương sống của công nghiệp Đức. Lương khởi điểm cao, hợp đồng ổn định, nhiều tập đoàn nhận thẳng sau khi ra nghề.",
    hocGi: [
      "Đọc bản vẽ kỹ thuật, dung sai",
      "Gia công cơ khí, tiện – phay – hàn",
      "Lắp đặt và bảo trì máy sản xuất",
      "Điều khiển khí nén, thuỷ lực, PLC",
    ],
    lamGi: ["Nhà máy cơ khí, ô tô, thiết bị", "Bộ phận bảo trì dây chuyền", "Công ty lắp đặt máy"],
    hopVoi: ["Khéo tay, tư duy kỹ thuật", "Học tốt toán – lý"],
    trienVong: "Học tiếp Techniker hoặc Meister, hoặc học đại học ứng dụng ngành kỹ thuật.",
  },
  {
    id: "dien",
    ten: "Điện – tự động hoá",
    tenDuc: "Elektroniker für Betriebstechnik",
    icon: "bolt",
    nam: "3,5 năm",
    tieng: "B1, ưu tiên B2",
    troCap: [1120, 1200, 1300],
    sauNghe: [3000, 3800],
    tomTat:
      "Nghề được trả cao và luôn thiếu người: điện công trình, điện nhà máy, năng lượng tái tạo đều cần.",
    hocGi: [
      "Điện cơ bản, đo lường, an toàn điện",
      "Lắp đặt tủ điện và hệ thống điều khiển",
      "Lập trình PLC, cảm biến, truyền động",
      "Bảo trì hệ thống tự động",
    ],
    lamGi: ["Nhà máy sản xuất", "Công ty lắp đặt điện", "Điện mặt trời, điện gió, trạm sạc"],
    hopVoi: ["Cẩn thận, tuân thủ quy trình an toàn", "Thích điện tử, lập trình"],
    trienVong: "Meister điện mở công ty riêng, hoặc chuyên sâu tự động hoá công nghiệp.",
  },
  {
    id: "xay-dung",
    ten: "Xây dựng – kỹ thuật toà nhà",
    tenDuc: "Anlagenmechaniker SHK / Bauberufe",
    icon: "helmet",
    nam: "3 – 3,5 năm",
    tieng: "B1",
    troCap: [1080, 1180, 1300],
    sauNghe: [2800, 3500],
    tomTat:
      "Nước Đức đang thiếu thợ nước – sưởi – điều hoà trầm trọng. Nghề có tay nghề càng lâu càng đắt giá.",
    hocGi: [
      "Hệ thống cấp thoát nước",
      "Sưởi, bơm nhiệt, điều hoà thông gió",
      "Hàn ống, lắp đặt thiết bị vệ sinh",
      "Đọc bản vẽ công trình",
    ],
    lamGi: ["Công ty lắp đặt kỹ thuật toà nhà", "Doanh nghiệp xây dựng", "Dịch vụ bảo trì"],
    hopVoi: ["Sức khoẻ tốt, làm việc ngoài công trường", "Thích lắp ráp, sửa chữa"],
    trienVong: "Meister SHK — một trong những bằng nghề có thu nhập cao nhất nước Đức.",
  },
  {
    id: "logistics",
    ten: "Kho vận – logistics",
    tenDuc: "Fachkraft für Lagerlogistik",
    icon: "box",
    nam: "3 năm",
    tieng: "B1",
    troCap: [1000, 1080, 1160],
    sauNghe: [2500, 3100],
    tomTat:
      "Đức là trung tâm trung chuyển của châu Âu. Kho vận là nghề dễ học, vào nhanh, cơ hội lên tổ trưởng sớm.",
    hocGi: [
      "Quy trình nhập – xuất – kiểm kho",
      "Phần mềm quản lý kho, mã vạch",
      "Xếp dỡ an toàn, lái xe nâng",
      "Chứng từ vận chuyển",
    ],
    lamGi: ["Trung tâm phân phối", "Kho nhà máy", "Công ty giao nhận, chuyển phát"],
    hopVoi: ["Nhanh nhẹn, có tổ chức", "Thích công việc rõ quy trình"],
    trienVong: "Lên tổ trưởng ca, quản lý kho, hoặc học tiếp Logistikmeister.",
  },
  {
    id: "thuc-pham",
    ten: "Chế biến thực phẩm – làm bánh",
    tenDuc: "Fachkraft für Lebensmitteltechnik / Bäcker",
    icon: "bread",
    nam: "3 năm",
    tieng: "B1",
    troCap: [980, 1060, 1150],
    sauNghe: [2400, 2900],
    tomTat:
      "Ngành sản xuất ổn định quanh năm, không phụ thuộc mùa vụ, nhiều nhà máy nhận học viên nước ngoài.",
    hocGi: [
      "Quy trình sản xuất và đóng gói",
      "Kiểm soát chất lượng, vệ sinh HACCP",
      "Vận hành máy chế biến",
      "Kỹ thuật làm bánh Đức",
    ],
    lamGi: ["Nhà máy thực phẩm", "Lò bánh công nghiệp và thủ công", "Xưởng chế biến thịt, sữa"],
    hopVoi: ["Chịu được ca sớm", "Cẩn thận, sạch sẽ"],
    trienVong: "Lên vận hành trưởng dây chuyền, hoặc Meister nghề bánh.",
  },
  {
    id: "cntt",
    ten: "Công nghệ thông tin",
    tenDuc: "Fachinformatiker",
    icon: "laptop",
    nam: "3 năm",
    tieng: "B2",
    troCap: [1100, 1190, 1290],
    sauNghe: [3200, 4000],
    tomTat:
      "Yêu cầu tiếng cao hơn nhưng bù lại thu nhập tốt nhất nhóm học nghề và môi trường làm việc văn phòng.",
    hocGi: [
      "Lập trình ứng dụng hoặc quản trị hệ thống",
      "Cơ sở dữ liệu, mạng máy tính",
      "An toàn thông tin",
      "Hỗ trợ người dùng",
    ],
    lamGi: ["Công ty phần mềm", "Bộ phận IT của doanh nghiệp", "Nhà cung cấp dịch vụ hạ tầng"],
    hopVoi: ["Tiếng Đức tốt", "Tư duy logic, tự học nhanh"],
    trienVong: "Chuyển sang lập trình viên, quản trị hệ thống, hoặc học đại học ứng dụng.",
  },
];

export function nganhTheoId(id: string): NganhHoc | undefined {
  return NGANH_HOC.find((n) => n.id === id);
}

/** Các bước của một hồ sơ du học nghề, từ lúc đăng ký tới lúc nhập học */
export const BUOC_AUSBILDUNG: { so: string; ten: string; thoiGian: string; mo: string; y: string[] }[] = [
  {
    so: "01",
    ten: "Tư vấn & chọn ngành",
    thoiGian: "1 – 2 tuần",
    mo: "Xem năng lực, học lực và nguyện vọng để chốt ngành học nghề phù hợp.",
    y: ["Đối chiếu bằng cấp Việt Nam", "Thử bài trắc nghiệm chọn nghề", "Chốt ngành và nhóm doanh nghiệp mục tiêu"],
  },
  {
    so: "02",
    ten: "Học tiếng Đức",
    thoiGian: "10 – 16 tháng",
    mo: "Học từ A1 lên B1 hoặc B2 tuỳ ngành, thi chứng chỉ tại trung tâm được công nhận.",
    y: ["A1 – A2 nền tảng", "B1 giao tiếp và phỏng vấn", "B2 cho ngành yêu cầu cao", "Học thêm từ vựng chuyên ngành"],
  },
  {
    so: "03",
    ten: "Hồ sơ & công nhận bằng cấp",
    thoiGian: "4 – 8 tuần",
    mo: "Dịch thuật công chứng, hợp pháp hoá lãnh sự, chuẩn bị bộ hồ sơ theo mẫu Đức.",
    y: ["Bằng tốt nghiệp, học bạ", "Lý lịch tư pháp", "CV và thư động lực bằng tiếng Đức", "Khám sức khoẻ"],
  },
  {
    so: "04",
    ten: "Phỏng vấn với doanh nghiệp",
    thoiGian: "2 – 6 tuần",
    mo: "Phỏng vấn trực tuyến với cơ sở đào tạo hoặc doanh nghiệp Đức, ký hợp đồng học nghề.",
    y: ["Luyện phỏng vấn trước", "Nhận Ausbildungsvertrag", "Xác nhận chỗ học nghề"],
  },
  {
    so: "05",
    ten: "Xin visa §16a",
    thoiGian: "6 – 12 tuần",
    mo: "Nộp hồ sơ tại Đại sứ quán / Tổng lãnh sự quán Đức, chờ xét duyệt.",
    y: [
      "Hợp đồng học nghề",
      "Chứng chỉ tiếng",
      "Chứng minh tài chính theo mức Bộ Ngoại giao Đức công bố, nếu trợ cấp học nghề chưa đủ mức sống",
      "Bảo hiểm y tế",
    ],
  },
  {
    so: "06",
    ten: "Sang Đức & nhập học",
    thoiGian: "Ngay sau khi có visa",
    mo: "Đón sân bay, đăng ký cư trú, mở tài khoản, bắt đầu chương trình đào tạo kép.",
    y: ["Anmeldung tại Bürgeramt", "Bảo hiểm y tế Đức", "Tài khoản ngân hàng", "Nhận lịch học và lịch làm"],
  },
];

/** So sánh hai con đường — đây là thứ người đọc luôn hỏi đầu tiên */
export const SO_SANH_HAI_DUONG: { muc: string; lamViec: string; hocNghe: string }[] = [
  { muc: "Mục tiêu", lamViec: "Đi làm có thu nhập ngay", hocNghe: "Có bằng nghề Đức rồi mới đi làm chính thức" },
  { muc: "Thời gian chuẩn bị", lamViec: "4 – 8 tháng", hocNghe: "12 – 18 tháng (chủ yếu là học tiếng)" },
  { muc: "Yêu cầu tiếng", lamViec: "A2 – B1 tuỳ đơn", hocNghe: "B1 – B2 bắt buộc" },
  { muc: "Thu nhập giai đoạn đầu", lamViec: "Lương công nhân theo hợp đồng", hocNghe: "Trợ cấp học nghề, thấp hơn lương" },
  { muc: "Thu nhập lâu dài", lamViec: "Tăng theo thâm niên", hocNghe: "Cao hơn rõ rệt vì có bằng nghề Đức" },
  { muc: "Bằng cấp", lamViec: "Không có bằng Đức", hocNghe: "Bằng nghề được công nhận toàn EU" },
  { muc: "Cư trú lâu dài", lamViec: "Theo hợp đồng lao động", hocNghe: "Thuận lợi hơn, dễ chuyển sang định cư" },
  { muc: "Phù hợp với", lamViec: "Người cần thu nhập sớm, đã có tay nghề", hocNghe: "Người còn trẻ, muốn phát triển lâu dài" },
];

export const CAU_HOI: { hoi: string; dap: string }[] = [
  {
    hoi: "Du học nghề Đức có phải đóng học phí không?",
    dap: "Chương trình đào tạo kép (duale Ausbildung) do doanh nghiệp và trường nghề công lập phối hợp, người học không đóng học phí mà còn được trả trợ cấp hằng tháng trong suốt thời gian học.",
  },
  {
    hoi: "Trợ cấp học nghề có đủ sống không?",
    dap: "Tuỳ ngành và tuỳ vùng. Ở thành phố lớn, trợ cấp năm nhất thường đủ chi phí cơ bản nếu ở ký túc hoặc ở ghép; nhiều doanh nghiệp hỗ trợ thêm chỗ ở hoặc vé tàu. Khi trợ cấp chưa đạt mức sống tối thiểu, hồ sơ visa cần chứng minh tài chính bổ sung.",
  },
  {
    hoi: "Vừa học vừa làm thêm được không?",
    dap: "Được, nhưng giới hạn theo quy định của giấy phép cư trú và không được ảnh hưởng tới chương trình đào tạo. Ưu tiên hoàn thành tốt chương trình chính vì đó mới là thứ quyết định thu nhập về sau.",
  },
  {
    hoi: "Trượt kỳ thi tốt nghiệp nghề thì sao?",
    dap: "Luật Đức cho thi lại. Thời gian đào tạo có thể được gia hạn để thi lại, và giấy phép cư trú thường được gia hạn tương ứng.",
  },
  {
    hoi: "Học xong có được ở lại Đức không?",
    dap: "Sau khi tốt nghiệp, người học được phép ở lại một khoảng thời gian để tìm việc đúng nghề; có hợp đồng lao động thì chuyển sang giấy phép cư trú làm việc, và sau vài năm có thể xin cư trú dài hạn.",
  },
  {
    hoi: "Không có bằng cấp 3 thì có đi được không?",
    dap: "Một số ngành nhận người tốt nghiệp trung học cơ sở kèm kinh nghiệm nghề. Cần đối chiếu từng trường hợp với yêu cầu của doanh nghiệp đào tạo.",
  },
];
