// Nội dung nghiệp vụ mang sang từ dự án nibel-de — cùng một công ty, cùng
// một bộ quy tắc biên tập (không nêu tuổi/giới tính, không nêu phí).
/**
 * LỘ TRÌNH ĐI LÀM VIỆC — luồng song song với du học nghề.
 * Nội dung là quy trình nghiệp vụ, không chứa phí, không chứa dữ liệu khách.
 */

export interface BuocLam {
  so: string;
  ten: string;
  thoiGian: string;
  mo: string;
  viec: string[];
  /** Những gì bạn cần chuẩn bị ở bước này */
  canCo: string[];
}

export const BUOC_LAM_VIEC: BuocLam[] = [
  {
    so: "01",
    ten: "Tư vấn & chọn đơn hàng",
    thoiGian: "3 – 7 ngày",
    mo: "Đối chiếu tay nghề, kinh nghiệm và nguyện vọng của bạn với các đơn hàng đang tuyển, chốt một hoặc hai đơn để theo.",
    viec: [
      "Nghe nguyện vọng: nước, ngành, mức thu nhập mong muốn",
      "Xem hồ sơ nghề: bằng cấp, số năm kinh nghiệm",
      "Giải thích rõ công việc thật, giờ làm và điều kiện của đơn",
      "Chốt đơn hàng và thời điểm dự kiến xuất cảnh",
    ],
    canCo: ["Căn cước công dân", "Bằng cấp hoặc chứng chỉ nghề (nếu có)", "Ảnh chân dung nền trắng"],
  },
  {
    so: "02",
    ten: "Chuẩn bị hồ sơ",
    thoiGian: "2 – 4 tuần",
    mo: "Hoàn thiện bộ hồ sơ theo yêu cầu của chủ sử dụng và của cơ quan lãnh sự.",
    viec: [
      "Làm hộ chiếu nếu chưa có",
      "Dịch thuật công chứng bằng cấp, học bạ",
      "Xin lý lịch tư pháp",
      "Khám sức khoẻ ở cơ sở được chỉ định",
      "Viết CV theo mẫu châu Âu",
    ],
    canCo: ["Hộ chiếu còn hạn trên 12 tháng", "Sổ hộ khẩu / giấy xác nhận cư trú", "Giấy khám sức khoẻ"],
  },
  {
    so: "03",
    ten: "Đào tạo trước khi đi",
    thoiGian: "3 – 8 tháng",
    mo: "Học tiếng theo yêu cầu của đơn và bổ túc tay nghề để vào việc là làm được ngay.",
    viec: [
      "Học tiếng Đức tới trình độ đơn hàng yêu cầu",
      "Từ vựng chuyên ngành của đúng công việc sẽ làm",
      "Bổ túc kỹ năng nghề nếu chủ sử dụng yêu cầu",
      "Học về văn hoá làm việc và luật lao động Đức",
    ],
    canCo: ["Cam kết học đủ buổi", "Thi lấy chứng chỉ tiếng tại trung tâm được công nhận"],
  },
  {
    so: "04",
    ten: "Phỏng vấn với chủ sử dụng",
    thoiGian: "1 – 4 tuần",
    mo: "Phỏng vấn trực tuyến hoặc trực tiếp. Đạt là ký hợp đồng lao động.",
    viec: [
      "Luyện phỏng vấn thử với chuyên viên",
      "Phỏng vấn cùng đại diện doanh nghiệp",
      "Nhận kết quả và hợp đồng lao động",
      "Đọc kỹ hợp đồng: lương, giờ làm, chỗ ở, thời hạn",
    ],
    canCo: ["Chứng chỉ tiếng", "Hồ sơ nghề đầy đủ", "Máy tính có camera cho buổi phỏng vấn trực tuyến"],
  },
  {
    so: "05",
    ten: "Thủ tục visa",
    thoiGian: "6 – 12 tuần",
    mo: "Nộp hồ sơ xin thị thực lao động, chờ cơ quan lãnh sự và Sở Ngoại kiều Đức xét duyệt.",
    viec: [
      "Đặt lịch hẹn nộp hồ sơ",
      "Nộp hồ sơ và lấy dấu vân tay",
      "Theo dõi tiến độ xét duyệt",
      "Nhận visa và kiểm tra thông tin trên visa",
    ],
    canCo: ["Hợp đồng lao động", "Chứng chỉ tiếng", "Bảo hiểm y tế", "Hộ chiếu gốc"],
  },
  {
    so: "06",
    ten: "Xuất cảnh & hoà nhập",
    thoiGian: "Từ ngày bay trở đi",
    mo: "Không phải bay là xong. Tháng đầu tiên mới là lúc cần người đồng hành nhất.",
    viec: [
      "Hướng dẫn thủ tục sân bay và nhập cảnh",
      "Đón tại sân bay, đưa về chỗ ở",
      "Đăng ký cư trú, bảo hiểm, tài khoản ngân hàng",
      "Theo dõi ba tháng đầu tại nơi làm việc",
    ],
    canCo: ["Hộ chiếu có visa", "Bản in hợp đồng lao động", "Địa chỉ nơi ở và số điện thoại người đón"],
  },
];

/** Giấy tờ cần có — gộp chung, dùng cho trang điều kiện hồ sơ */
export const HO_SO: { nhom: string; icon: string; giay: { ten: string; ghiChu?: string }[] }[] = [
  {
    nhom: "Giấy tờ tuỳ thân",
    icon: "user",
    giay: [
      { ten: "Hộ chiếu", ghiChu: "Còn hạn tối thiểu 12 tháng tính từ ngày dự kiến xuất cảnh" },
      { ten: "Căn cước công dân", ghiChu: "Bản sao công chứng" },
      { ten: "Ảnh chân dung nền trắng", ghiChu: "Ảnh sinh trắc học theo chuẩn hộ chiếu, chụp trong 6 tháng gần nhất" },
      { ten: "Giấy xác nhận cư trú" },
    ],
  },
  {
    nhom: "Học vấn & tay nghề",
    icon: "cap",
    giay: [
      { ten: "Bằng tốt nghiệp cao nhất", ghiChu: "Dịch thuật công chứng sang tiếng Đức" },
      { ten: "Học bạ / bảng điểm" },
      { ten: "Chứng chỉ nghề", ghiChu: "Nếu đơn hàng yêu cầu tay nghề" },
      { ten: "Xác nhận kinh nghiệm làm việc", ghiChu: "Do nơi từng làm việc cấp" },
      { ten: "Chứng chỉ tiếng Đức", ghiChu: "Trình độ theo yêu cầu của từng đơn hoặc từng ngành đào tạo" },
    ],
  },
  {
    nhom: "Sức khoẻ & nhân thân",
    icon: "heart",
    giay: [
      { ten: "Giấy khám sức khoẻ", ghiChu: "Khám tại cơ sở được chỉ định, theo mẫu dành cho người đi nước ngoài" },
      { ten: "Lý lịch tư pháp số 1 hoặc số 2", ghiChu: "Tuỳ yêu cầu của cơ quan lãnh sự" },
      { ten: "Giấy đăng ký kết hôn / khai sinh con", ghiChu: "Khi có nhu cầu bảo lãnh gia đình về sau" },
    ],
  },
  {
    nhom: "Hồ sơ nộp lãnh sự",
    icon: "doc",
    giay: [
      { ten: "Hợp đồng lao động hoặc hợp đồng học nghề" },
      { ten: "Tờ khai xin thị thực" },
      { ten: "Bảo hiểm y tế có hiệu lực từ ngày nhập cảnh" },
      { ten: "Xác nhận chỗ ở tại Đức" },
      { ten: "CV và thư động lực bằng tiếng Đức" },
    ],
  },
];

/** Những lỗi làm chậm hồ sơ — phần này giúp người đọc thật sự */
export const LOI_THUONG_GAP: { loi: string; hau: string; tranh: string }[] = [
  {
    loi: "Hộ chiếu sắp hết hạn",
    hau: "Visa chỉ được cấp trong thời hạn còn lại của hộ chiếu, có khi phải làm lại toàn bộ hồ sơ.",
    tranh: "Làm hộ chiếu mới ngay từ bước 01 nếu hạn còn dưới 18 tháng.",
  },
  {
    loi: "Bỏ buổi học tiếng",
    hau: "Không kịp trình độ thì lỡ đợt phỏng vấn, phải chờ đơn hàng sau.",
    tranh: "Coi lớp tiếng là công việc chính trong giai đoạn chuẩn bị, không học ngắt quãng.",
  },
  {
    loi: "Khai không đúng kinh nghiệm nghề",
    hau: "Chủ sử dụng phát hiện khi làm thật, có thể chấm dứt hợp đồng trong thời gian thử việc.",
    tranh: "Khai đúng những gì làm được. Thiếu chỗ nào thì bổ túc tay nghề trước khi đi.",
  },
  {
    loi: "Dịch thuật không đúng chuẩn",
    hau: "Cơ quan lãnh sự trả hồ sơ, mất thêm vài tuần.",
    tranh: "Chỉ dịch ở đơn vị được công nhận và hợp pháp hoá lãnh sự đầy đủ.",
  },
  {
    loi: "Không đọc kỹ hợp đồng",
    hau: "Sang tới nơi mới biết giờ làm, ca kíp hoặc chỗ ở khác với hình dung.",
    tranh: "Yêu cầu bản dịch hợp đồng và hỏi lại từng điều khoản chưa rõ trước khi ký.",
  },
];
