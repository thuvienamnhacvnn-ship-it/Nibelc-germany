// Nội dung nghiệp vụ mang sang từ dự án nibel-de — cùng một công ty, cùng
// một bộ quy tắc biên tập (không nêu tuổi/giới tính, không nêu phí).
/**
 * CẨM NANG — bài viết hướng dẫn cho người chuẩn bị sang Đức.
 *
 * Nội dung là kiến thức chung và quy định công khai của Đức. Không nêu phí
 * dịch vụ, không nêu tên khách hàng, không hứa kết quả.
 */

export interface Khoi {
  tieuDe: string;
  doan?: string[];
  gach?: string[];
  /** Khối nhấn mạnh, hiện thành hộp màu */
  luuY?: string;
}

export interface Bai {
  id: string;
  nhom: string;
  icon: string;
  tieuDe: string;
  tomTat: string;
  phut: number;
  khoi: Khoi[];
}

export const NHOM_BAI = ["Chuẩn bị", "Sống ở Đức", "Tiền bạc", "Lâu dài"] as const;

export const CAM_NANG: Bai[] = [
  {
    id: "hoc-tieng-duc-bao-lau",
    nhom: "Chuẩn bị",
    icon: "chat",
    tieuDe: "Học tiếng Đức bao lâu thì đi được?",
    tomTat:
      "Từ con số không lên B1 thường mất 10 – 14 tháng nếu học đều. Bài này nói rõ mỗi trình độ cần bao nhiêu giờ và vì sao học ngắt quãng lại tốn thời gian gấp đôi.",
    phut: 6,
    khoi: [
      {
        tieuDe: "Mỗi trình độ cần bao nhiêu giờ",
        doan: [
          "Khung tham chiếu châu Âu chia sáu bậc từ A1 tới C2. Người đi làm việc hoặc học nghề tại Đức thường cần tới B1, một số ngành như điều dưỡng và công nghệ thông tin cần B2.",
          "Mỗi bậc thường cần khoảng 180 – 240 giờ học trên lớp, cộng thêm chừng ấy thời gian tự học. Học 4 buổi một tuần, mỗi buổi 3 giờ, thì mỗi bậc mất khoảng 3 – 4 tháng.",
        ],
        gach: [
          "A1: chào hỏi, giới thiệu bản thân, mua bán đơn giản",
          "A2: kể được việc hằng ngày, hiểu thông báo ngắn",
          "B1: xử lý được hầu hết tình huống ở nơi làm việc, kể lại sự việc, nêu ý kiến",
          "B2: hiểu nội dung phức tạp, trao đổi chuyên môn trôi chảy",
        ],
      },
      {
        tieuDe: "Vì sao học ngắt quãng lại tốn gấp đôi",
        doan: [
          "Tiếng Đức có hệ thống chia đuôi theo giống, cách và số. Phần này chỉ vào đầu khi được lặp lại liên tục. Nghỉ hai tuần là phải học lại gần như từ đầu một phần ngữ pháp.",
          "Người học đều 4 buổi một tuần trong 12 tháng thường thi đỗ B1. Người học ngắt quãng trong 20 tháng thường vẫn ở A2. Cùng số giờ, khác kết quả.",
        ],
        luuY: "Trong giai đoạn chuẩn bị, hãy coi lớp tiếng là công việc chính. Đây là khoản đầu tư quyết định bạn đi được đơn nào và thu nhập ra sao.",
      },
      {
        tieuDe: "Học từ vựng chuyên ngành từ sớm",
        doan: [
          "Chứng chỉ B1 giúp bạn qua cửa hồ sơ, nhưng thứ giúp bạn sống sót tuần đầu tiên ở nơi làm việc là từ vựng của đúng nghề bạn làm: tên dụng cụ, tên thao tác, câu lệnh của quản đốc.",
          "Hãy xin trước danh sách từ vựng chuyên ngành và học song song với chương trình chính, đừng đợi thi xong B1 mới bắt đầu.",
        ],
      },
    ],
  },
  {
    id: "thang-dau-tien-o-duc",
    nhom: "Sống ở Đức",
    icon: "home",
    tieuDe: "Tháng đầu tiên ở Đức phải làm những gì",
    tomTat:
      "Anmeldung, bảo hiểm y tế, tài khoản ngân hàng, mã số thuế — bốn thủ tục phải xong sớm, và chúng phụ thuộc lẫn nhau theo một thứ tự nhất định.",
    phut: 7,
    khoi: [
      {
        tieuDe: "Thứ tự đúng của bốn thủ tục",
        doan: [
          "Bốn thủ tục này móc nối vào nhau: làm sai thứ tự là phải quay lại từ đầu. Thứ tự chạy được là đăng ký cư trú trước, rồi mới tới những thứ còn lại.",
        ],
        gach: [
          "1. Anmeldung — đăng ký cư trú tại Bürgeramt, cần giấy xác nhận của chủ nhà (Wohnungsgeberbestätigung)",
          "2. Bảo hiểm y tế — chọn một quỹ bảo hiểm công, họ cấp số bảo hiểm cho doanh nghiệp trả lương",
          "3. Tài khoản ngân hàng — cần giấy Anmeldung và hộ chiếu",
          "4. Mã số thuế (Steuer-ID) — tự gửi về theo đường bưu điện sau khi Anmeldung xong",
        ],
        luuY: "Chưa có Anmeldung thì gần như không mở được tài khoản ngân hàng, và chưa có tài khoản thì doanh nghiệp không trả lương được. Làm Anmeldung trong hai tuần đầu.",
      },
      {
        tieuDe: "Giấy tờ luôn phải mang theo",
        gach: [
          "Hộ chiếu có thị thực",
          "Bản in hợp đồng lao động hoặc hợp đồng học nghề",
          "Giấy xác nhận Anmeldung",
          "Thẻ bảo hiểm y tế",
          "Số tài khoản ngân hàng",
        ],
      },
      {
        tieuDe: "Thư gửi tới là phải mở",
        doan: [
          "Ở Đức, mọi việc quan trọng đều đi bằng thư giấy: cơ quan cư trú, sở thuế, bảo hiểm, ngân hàng. Rất nhiều thư có thời hạn phản hồi.",
          "Hãy chắc chắn tên bạn có trên hộp thư, và mở mọi phong bì ngay khi nhận. Không hiểu nội dung thì chụp lại và hỏi chuyên viên hoặc người hướng dẫn tại nơi làm việc.",
        ],
      },
    ],
  },
  {
    id: "doc-bang-luong-duc",
    nhom: "Tiền bạc",
    icon: "chart",
    tieuDe: "Đọc bảng lương Đức: vì sao nhận ít hơn trong hợp đồng",
    tomTat:
      "Hợp đồng ghi lương gộp. Sau thuế thu nhập và bốn khoản bảo hiểm bắt buộc, số về tài khoản thường thấp hơn 20 – 40%. Bài này giải thích từng dòng.",
    phut: 8,
    khoi: [
      {
        tieuDe: "Gộp và thực nhận",
        doan: [
          "Brutto là lương gộp — con số ghi trong hợp đồng. Netto là thực nhận — con số vào tài khoản. Khoảng cách giữa hai con số là thuế và bảo hiểm xã hội, đều bị trừ tự động trước khi trả.",
          "Đây không phải khoản mất đi. Bảo hiểm hưu trí, y tế, thất nghiệp và chăm sóc dài hạn là thứ bảo vệ bạn khi ốm, khi mất việc và khi về già.",
        ],
      },
      {
        tieuDe: "Bốn khoản bảo hiểm bắt buộc",
        gach: [
          "Rentenversicherung — hưu trí, khoảng 9,3% phần người lao động",
          "Krankenversicherung — y tế, khoảng 8,5% tuỳ quỹ bảo hiểm",
          "Pflegeversicherung — chăm sóc dài hạn, khoảng 1,8%, chưa có con thì cộng thêm",
          "Arbeitslosenversicherung — thất nghiệp, khoảng 1,3%",
        ],
        doan: ["Doanh nghiệp đóng thêm một phần tương đương, phần đó không hiện trên bảng lương thực nhận của bạn."],
      },
      {
        tieuDe: "Bậc thuế thay đổi con số rất nhiều",
        doan: [
          "Người độc thân xếp bậc I. Người đã kết hôn mà vợ hoặc chồng thu nhập thấp có thể xếp bậc III và nộp thuế ít hơn hẳn. Đây là thứ đáng hỏi ngay khi sang, vì khai muộn thì phải chờ quyết toán cuối năm mới lấy lại được.",
        ],
        luuY: "Cuối năm nên làm quyết toán thuế (Steuererklärung). Rất nhiều người lao động được hoàn lại một khoản đáng kể từ chi phí đi lại, chi phí học nghề và chi phí nuôi người phụ thuộc.",
      },
    ],
  },
  {
    id: "van-hoa-lam-viec-duc",
    nhom: "Sống ở Đức",
    icon: "handshake",
    tieuDe: "Văn hoá làm việc Đức: năm điều gây sốc nhất",
    tomTat:
      "Đúng giờ tuyệt đối, nói thẳng không vòng vo, báo ốm đúng quy trình, hết giờ là về, và nghỉ phép là quyền chứ không phải xin xỏ.",
    phut: 6,
    khoi: [
      {
        tieuDe: "Đúng giờ nghĩa là sớm năm phút",
        doan: [
          "Ở Đức, đến đúng giờ bắt đầu ca đã bị coi là muộn: giờ đó là giờ bạn phải sẵn sàng làm việc, không phải giờ bước vào cổng. Đi muộn nhiều lần là lý do chấm dứt hợp đồng hoàn toàn hợp pháp.",
        ],
      },
      {
        tieuDe: "Nói thẳng không phải là thô lỗ",
        doan: [
          "Người Đức góp ý trực diện và cụ thể. Nghe có thể chối tai với người quen cách nói giảm nói tránh, nhưng đó là cách họ làm việc với mọi người, không nhằm vào cá nhân bạn.",
          "Ngược lại, khi bạn không hiểu việc thì phải nói ngay. Im lặng gật đầu rồi làm sai bị đánh giá nặng hơn nhiều so với việc hỏi lại.",
        ],
      },
      {
        tieuDe: "Ốm thì báo, đúng cách",
        doan: [
          "Ốm phải báo cho nơi làm việc trước giờ bắt đầu ca, ngay trong ngày đầu tiên. Nghỉ quá số ngày quy định thì cần giấy của bác sĩ (Arbeitsunfähigkeitsbescheinigung).",
          "Báo ốm đúng quy trình thì vẫn được trả lương theo luật. Tự ý nghỉ không báo thì bị coi là bỏ việc.",
        ],
        luuY: "Hỏi ngay trong tuần đầu tiên: báo ốm cho ai, bằng số điện thoại nào, và từ ngày thứ mấy thì cần giấy bác sĩ.",
      },
      {
        tieuDe: "Hết giờ là về, và nghỉ phép là quyền",
        doan: [
          "Luật Đức giới hạn giờ làm và bắt buộc có thời gian nghỉ giữa hai ca. Ở lại thêm không được coi là chăm chỉ mà bị coi là làm việc thiếu hiệu quả hoặc vi phạm quy định.",
          "Số ngày phép ghi trong hợp đồng là quyền của bạn. Đăng ký trước theo quy trình của doanh nghiệp, không cần xin xỏ.",
        ],
      },
    ],
  },
  {
    id: "tranh-lua-dao",
    nhom: "Chuẩn bị",
    icon: "shield",
    tieuDe: "Tám dấu hiệu của một đơn hàng không đáng tin",
    tomTat:
      "Cam kết chắc chắn đậu visa, giục đặt cọc gấp, không cho xem hợp đồng trước khi ký — đây là những dấu hiệu bạn nên dừng lại và kiểm tra.",
    phut: 7,
    khoi: [
      {
        tieuDe: "Tám dấu hiệu cần dừng lại",
        gach: [
          "Cam kết chắc chắn đậu visa. Không ai cam kết được điều này, vì quyết định thuộc về cơ quan lãnh sự Đức.",
          "Giục chuyển tiền gấp trong ngày, kèm lý do sắp hết suất.",
          "Không cho xem toàn văn hợp đồng lao động trước khi ký.",
          "Con số thu nhập cao vượt xa mặt bằng của nghề đó mà không giải thích được vì sao.",
          "Không nói rõ tên doanh nghiệp sử dụng lao động và nơi làm việc.",
          "Yêu cầu chuyển tiền vào tài khoản cá nhân thay vì tài khoản công ty.",
          "Không xuất hoá đơn, không có giấy biên nhận cho bất kỳ khoản nào.",
          "Liên hệ chỉ qua tài khoản mạng xã hội, không có địa chỉ văn phòng để tới tận nơi.",
        ],
      },
      {
        tieuDe: "Ba việc nên làm trước khi ký bất cứ thứ gì",
        gach: [
          "Yêu cầu bản dịch tiếng Việt của hợp đồng và đọc từng điều khoản về lương, giờ làm, chỗ ở, thời hạn.",
          "Tới tận văn phòng công ty một lần. Địa chỉ thật, người thật, bàn làm việc thật.",
          "Hỏi thẳng: nếu hồ sơ trượt visa thì khoản nào được hoàn, hoàn trong bao lâu, ghi ở điều nào trong hợp đồng.",
        ],
        luuY: "Mọi cam kết chỉ có giá trị khi được viết vào hợp đồng. Lời hứa qua điện thoại hay tin nhắn không phải là căn cứ pháp lý.",
      },
    ],
  },
  {
    id: "dinh-cu-va-gia-dinh",
    nhom: "Lâu dài",
    icon: "users",
    tieuDe: "Từ giấy phép lao động tới định cư và đón gia đình",
    tomTat:
      "Con đường từ thị thực làm việc tới giấy phép định cư lâu dài, và điều kiện để bảo lãnh vợ chồng con cái sang Đức.",
    phut: 6,
    khoi: [
      {
        tieuDe: "Ba nấc của giấy tờ cư trú",
        gach: [
          "Thị thực (Visum) — cấp tại Đại sứ quán, có thời hạn ngắn để nhập cảnh.",
          "Giấy phép cư trú (Aufenthaltserlaubnis) — cấp tại Sở Ngoại kiều sau khi sang, gắn với công việc hoặc chương trình đào tạo.",
          "Giấy phép định cư (Niederlassungserlaubnis) — không thời hạn, cấp khi đủ số năm cư trú, đủ số năm đóng bảo hiểm hưu trí, đủ trình độ tiếng và tự nuôi được bản thân.",
        ],
      },
      {
        tieuDe: "Đón gia đình sang",
        doan: [
          "Bảo lãnh vợ hoặc chồng và con chưa thành niên là quyền được luật Đức quy định, nhưng kèm điều kiện: có chỗ ở đủ diện tích, thu nhập đủ nuôi cả gia đình mà không cần trợ cấp, và người được bảo lãnh thường phải có tiếng Đức ở mức cơ bản.",
          "Vì vậy, thu nhập và tình trạng nhà ở trong những năm đầu ảnh hưởng trực tiếp tới việc bao giờ bạn đón được gia đình.",
        ],
        luuY: "Mỗi năm đóng bảo hiểm hưu trí đều được tính. Đây là lý do nên làm đúng hợp đồng và tránh làm chui.",
      },
    ],
  },
  {
    id: "gui-tien-ve-nha",
    nhom: "Tiền bạc",
    icon: "send",
    tieuDe: "Gửi tiền về nhà: làm sao để không mất oan",
    tomTat:
      "Phí chuyển tiền và tỉ giá ăn vào khoản tiền của bạn nhiều hơn bạn tưởng. Bài này nói về cách so sánh chi phí thật và những thứ cần tránh.",
    phut: 5,
    khoi: [
      {
        tieuDe: "Chi phí thật gồm hai phần",
        doan: [
          "Phí chuyển ghi trên màn hình chỉ là một phần. Phần còn lại nằm trong tỉ giá quy đổi: nơi nhận có thể không thu phí nhưng áp tỉ giá thấp hơn thị trường vài phần trăm.",
          "Cách so sánh đúng là xem người nhà nhận được bao nhiêu đồng cho cùng một số euro, chứ không xem dòng phí.",
        ],
      },
      {
        tieuDe: "Những thứ nên tránh",
        gach: [
          "Gửi tiền mặt qua người quen mang về, không có giấy tờ gì.",
          "Dùng dịch vụ không có giấy phép, hứa tỉ giá cao bất thường.",
          "Chuyển hết thu nhập về nhà ngay tháng đầu, không giữ khoản dự phòng.",
        ],
        luuY: "Luôn giữ lại một khoản dự phòng bằng ít nhất một tháng chi phí sinh hoạt tại Đức. Tiền đặt cọc nhà, tiền thuốc men hay một tháng chậm lương đều là chuyện có thể xảy ra.",
      },
    ],
  },
  {
    id: "chuan-bi-hanh-ly",
    nhom: "Chuẩn bị",
    icon: "box",
    tieuDe: "Mang gì sang Đức, và đừng mang gì",
    tomTat:
      "Hành lý ký gửi có hạn mức. Danh sách dưới đây ưu tiên thứ khó mua hoặc đắt ở Đức, và loại bỏ những thứ mang sang chỉ tốn cân.",
    phut: 5,
    khoi: [
      {
        tieuDe: "Nên mang",
        gach: [
          "Toàn bộ hồ sơ gốc và bản dịch, để trong hành lý xách tay",
          "Thuốc đang dùng kèm đơn thuốc dịch sang tiếng Anh hoặc tiếng Đức",
          "Kính, giày bảo hộ hoặc dụng cụ nghề quen tay, nếu nhẹ",
          "Quần áo giữ nhiệt lớp trong — mùa đông Đức dài hơn bạn nghĩ",
          "Vài món gia vị khô đặc trưng, gọn nhẹ",
        ],
      },
      {
        tieuDe: "Đừng mang",
        gach: [
          "Thực phẩm tươi, thịt, sữa — quy định nhập cảnh EU cấm và sẽ bị tịch thu",
          "Nồi niêu, chăn màn cồng kềnh — bên Đức mua đồ cũ rất rẻ",
          "Áo khoác mùa đông dày cộp — nên mua tại chỗ cho đúng khí hậu",
          "Số tiền mặt lớn không khai báo — trên ngưỡng quy định là phải khai hải quan",
        ],
        luuY: "Chụp ảnh toàn bộ giấy tờ quan trọng và lưu vào email của chính bạn. Mất hành lý thì vẫn còn bản chụp để làm lại.",
      },
    ],
  },
];

export function baiTheoId(id: string): Bai | undefined {
  return CAM_NANG.find((b) => b.id === id);
}
