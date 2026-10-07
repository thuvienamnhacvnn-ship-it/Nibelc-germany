import { daVao } from "@/lib/quan-tri/dang-nhap";
import { cungNguon } from "@/lib/quan-tri/chung";
import { chuanNhan, lietKeAnh, luuAnhMoi, type Anh } from "@/lib/quan-tri/kho-anh";

/**
 * KHO ẢNH — liệt kê (GET) và tải lên (POST).
 *
 * Tải lên đi qua route handler chứ KHÔNG qua server action: server action
 * giới hạn thân yêu cầu 1 MB, một tấm ảnh điện thoại đã 4–8 MB.
 * proxy.ts bỏ qua /admin nên yêu cầu không bị proxy đệm lại (trần 10 MB).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SO_FILE_TOI_DA = 20;
/** Trần cả lần gửi. nginx phải đặt client_max_body_size ≥ con số này. */
const TONG_TOI_DA = 64 * 1024 * 1024;

const loi = (ma: number, chu: string) => Response.json({ loi: chu }, { status: ma });

export async function GET(req: Request) {
  if (!(await daVao())) return loi(401, "Chưa đăng nhập.");
  const q = new URL(req.url).searchParams;
  try {
    return Response.json(
      await lietKeAnh({
        nhan: q.get("nhan") ?? undefined,
        tim: q.get("tim") ?? undefined,
        trang: Number(q.get("trang")) || undefined,
        moiTrang: Number(q.get("moiTrang")) || undefined,
      }),
    );
  } catch (e) {
    console.error("[api/anh] liệt kê lỗi:", e);
    return loi(500, "Không đọc được kho ảnh. Thử lại sau ít phút.");
  }
}

export async function POST(req: Request) {
  if (!(await daVao())) return loi(401, "Chưa đăng nhập.");
  if (!cungNguon(req.headers)) return loi(403, "Yêu cầu không đến từ trang quản trị.");
  // chặn sớm theo Content-Length, trước khi đọc cả thân yêu cầu vào bộ nhớ
  if (Number(req.headers.get("content-length") ?? 0) > TONG_TOI_DA) {
    return loi(413, "Lần gửi này nặng quá 64 MB. Chia nhỏ ra vài ảnh một lần.");
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return loi(400, "Không đọc được dữ liệu gửi lên.");
  }
  const tep = form.getAll("tep").filter((x): x is File => typeof x !== "string");
  if (tep.length === 0) return loi(400, "Chưa chọn ảnh nào.");
  if (tep.length > SO_FILE_TOI_DA) return loi(413, `Mỗi lần gửi tối đa ${SO_FILE_TOI_DA} ảnh.`);
  const nhan = chuanNhan(form.getAll("nhan").flatMap((x) => (typeof x === "string" ? x.split(",") : [])));

  const anh: Anh[] = [];
  const hong: { ten: string; loi: string }[] = [];
  // Lần lượt từng file, không chạy song song: sharp + ghi đĩa cho 20 ảnh
  // 15 MB cùng lúc là ngốn hết RAM của một VPS nhỏ.
  for (const f of tep) {
    try {
      const r = await luuAnhMoi(Buffer.from(await f.arrayBuffer()), f.name, nhan);
      if (r.ok) anh.push(r.anh);
      else hong.push({ ten: f.name, loi: r.loi });
    } catch (e) {
      console.error("[api/anh] lưu lỗi:", f.name, e);
      hong.push({ ten: f.name, loi: "Máy chủ không lưu được ảnh này. Thử lại sau ít phút." });
    }
  }
  // Không cần dựng lại trang nào: ảnh mới chưa được nơi nào dùng, còn trang
  // quản trị thì luôn đọc thẳng CSDL (force-dynamic).
  return Response.json({ anh, hong }, { status: anh.length > 0 ? 200 : 400 });
}
