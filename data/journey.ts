/**
 * CHÍN CHẶNG TỪ VIỆT NAM ĐẾN ĐỨC — đúng danh sách trong KIT (mục 22).
 *
 * Nội dung nghiệp vụ, không nêu phí dịch vụ và không nêu tuổi hay giới tính.
 */
export interface Chang {
  so: string;
  ten: string;
  thoiGian: string;
  mo: string;
  anh: string;
  viec: string[];
  giay: string[];
  hoTro: string[];
  ketQua: string[];
}

export const CHANG: Chang[] = [
  {
    so: "01",
    ten: "Tư vấn & đánh giá hồ sơ",
    thoiGian: "1 – 3 ngày",
    mo: "Trao đổi nhu cầu, đánh giá hồ sơ và dựng lộ trình phù hợp nhất cho bạn.",
    anh: "/assets/jobs/it/03-portrait-team-3x4.jpg",
    viec: ["Trao đổi nguyện vọng: nước, ngành, thu nhập", "Đánh giá bằng cấp và kinh nghiệm", "Chốt hướng đi: đi làm hay học nghề"],
    giay: ["Căn cước công dân", "Bằng cấp cao nhất", "Chứng chỉ nghề nếu có"],
    hoTro: ["Tư vấn 1:1 cùng chuyên viên", "Đánh giá hồ sơ miễn phí", "Đề xuất ngành nghề phù hợp"],
    ketQua: ["Hiểu rõ điều kiện và cơ hội của mình", "Có lộ trình cá nhân hoá", "Danh sách đơn hàng hoặc ngành phù hợp"],
  },
  {
    so: "02",
    ten: "Chọn chương trình / đơn hàng",
    thoiGian: "3 – 7 ngày",
    mo: "Đối chiếu tay nghề với các đơn đang tuyển và chốt đơn để theo.",
    anh: "/assets/jobs/logistik/03-portrait-team-3x4.jpg",
    viec: ["Xem chi tiết đơn hàng hoặc ngành đào tạo", "So sánh thu nhập, giờ làm, nơi làm việc", "Chốt một hoặc hai lựa chọn"],
    giay: ["Sơ yếu lý lịch", "Ảnh chân dung nền trắng"],
    hoTro: ["Giải thích rõ công việc thật của đơn", "Cảnh báo điểm cần cân nhắc", "Giữ suất trong thời gian chuẩn bị"],
    ketQua: ["Chốt được đơn hàng hoặc ngành học", "Biết mốc thời gian dự kiến xuất cảnh"],
  },
  {
    so: "03",
    ten: "Học tiếng Đức",
    thoiGian: "3 – 16 tháng",
    mo: "Học tới trình độ đơn hàng hoặc ngành đào tạo yêu cầu, thi lấy chứng chỉ.",
    anh: "/assets/jobs/handel/03-portrait-team-3x4.jpg",
    viec: ["Học theo lộ trình A1 → B1 hoặc B2", "Học từ vựng chuyên ngành của đúng nghề", "Luyện nghe nói cho buổi phỏng vấn"],
    giay: ["Đăng ký thi chứng chỉ", "Chứng chỉ tiếng Đức"],
    hoTro: ["Kết nối trung tâm được công nhận", "Theo dõi tiến độ từng tháng", "Ôn tập trước kỳ thi"],
    ketQua: ["Có chứng chỉ tiếng đúng yêu cầu", "Giao tiếp được trong công việc"],
  },
  {
    so: "04",
    ten: "Chuẩn bị & công nhận hồ sơ",
    thoiGian: "4 – 8 tuần",
    mo: "Dịch thuật công chứng, hợp pháp hoá lãnh sự và công nhận bằng cấp.",
    anh: "/assets/jobs/it/04-detail-closeup.jpg",
    viec: ["Dịch thuật bằng cấp, học bạ", "Hợp pháp hoá lãnh sự", "Xin lý lịch tư pháp", "Khám sức khoẻ"],
    giay: ["Hộ chiếu còn hạn trên 12 tháng", "Bằng cấp và học bạ bản dịch", "Lý lịch tư pháp", "Giấy khám sức khoẻ"],
    hoTro: ["Hướng dẫn từng loại giấy tờ", "Kiểm tra hồ sơ trước khi nộp", "Theo dõi tiến độ công nhận bằng"],
    ketQua: ["Bộ hồ sơ đạt chuẩn Đức", "Sẵn sàng cho bước phỏng vấn"],
  },
  {
    so: "05",
    ten: "Phỏng vấn doanh nghiệp",
    thoiGian: "2 – 6 tuần",
    mo: "Phỏng vấn trực tuyến hoặc trực tiếp với chủ sử dụng lao động.",
    anh: "/assets/jobs/gastronomie/03-portrait-team-3x4.jpg",
    viec: ["Luyện phỏng vấn thử", "Chuẩn bị video tay nghề nếu đơn yêu cầu", "Phỏng vấn cùng đại diện doanh nghiệp"],
    giay: ["CV tiếng Đức", "Chứng chỉ tiếng", "Video tay nghề nếu có"],
    hoTro: ["Luyện tập cùng chuyên viên", "Phiên dịch trong buổi phỏng vấn", "Thương lượng điều khoản"],
    ketQua: ["Đạt phỏng vấn", "Nhận thư mời hoặc hợp đồng"],
  },
  {
    so: "06",
    ten: "Ký hợp đồng",
    thoiGian: "1 – 2 tuần",
    mo: "Đọc kỹ và ký hợp đồng lao động hoặc hợp đồng học nghề.",
    anh: "/assets/jobs/elektro/03-portrait-team-3x4.jpg",
    viec: ["Đọc bản dịch toàn văn hợp đồng", "Hỏi lại điều khoản chưa rõ", "Ký hợp đồng"],
    giay: ["Hợp đồng lao động hoặc Ausbildungsvertrag", "Xác nhận chỗ ở tại Đức"],
    hoTro: ["Cung cấp bản dịch hợp đồng", "Giải thích từng điều khoản", "Lưu bản sao cho bạn"],
    ketQua: ["Có hợp đồng chính thức", "Đủ căn cứ nộp hồ sơ visa"],
  },
  {
    so: "07",
    ten: "Hồ sơ Visa",
    thoiGian: "6 – 12 tuần",
    mo: "Nộp hồ sơ tại cơ quan lãnh sự Đức và theo dõi tới khi có kết quả.",
    anh: "/assets/jobs/mechanik/03-portrait-team-3x4.jpg",
    viec: ["Đặt lịch hẹn nộp hồ sơ", "Nộp hồ sơ và lấy dấu vân tay", "Theo dõi tiến độ xét duyệt"],
    giay: ["Tờ khai xin thị thực", "Hợp đồng", "Bảo hiểm y tế", "Hộ chiếu gốc"],
    hoTro: ["Rà soát hồ sơ trước khi nộp", "Hướng dẫn buổi nộp", "Theo dõi và bổ sung khi lãnh sự yêu cầu"],
    ketQua: ["Nhận visa", "Kiểm tra thông tin trên visa"],
  },
  {
    so: "08",
    ten: "Bay sang Đức",
    thoiGian: "1 – 2 tuần",
    mo: "Đặt vé, chuẩn bị hành lý và hướng dẫn thủ tục nhập cảnh.",
    anh: "/assets/jobs/logistik/04-detail-closeup.jpg",
    viec: ["Đặt vé máy bay", "Chuẩn bị hành lý theo hướng dẫn", "Nắm thủ tục nhập cảnh EU"],
    giay: ["Hộ chiếu có visa", "Bản in hợp đồng", "Địa chỉ nơi ở và số người đón"],
    hoTro: ["Hướng dẫn hành lý và hải quan", "Sắp xếp người đón tại sân bay"],
    ketQua: ["Nhập cảnh thuận lợi", "Về tới chỗ ở an toàn"],
  },
  {
    so: "09",
    ten: "Onboarding tại Đức",
    thoiGian: "Liên tục 3 tháng đầu",
    mo: "Đăng ký cư trú, bảo hiểm, tài khoản và hoà nhập nơi làm việc.",
    anh: "/assets/jobs/soziales/03-portrait-team-3x4.jpg",
    viec: ["Anmeldung tại Bürgeramt", "Đăng ký bảo hiểm y tế", "Mở tài khoản ngân hàng", "Làm quen công việc"],
    giay: ["Giấy xác nhận chỗ ở", "Thẻ bảo hiểm", "Mã số thuế"],
    hoTro: ["Đi cùng làm thủ tục", "Phiên dịch khi cần", "Theo dõi ba tháng đầu tại nơi làm việc"],
    ketQua: ["Hoàn tất thủ tục cư trú", "Ổn định công việc và cuộc sống"],
  },
];
