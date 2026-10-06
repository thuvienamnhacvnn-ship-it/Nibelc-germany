import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { hoi, hoiMot } from "@/lib/db";

/**
 * ĐĂNG NHẬP TRANG QUẢN TRỊ
 *
 * Sếp chốt 05/10/2026: MỘT tài khoản chung cho cả đội, không phân vai, không
 * có bước duyệt. Nên ở đây không có bảng người dùng — chỉ một mật khẩu.
 *
 * MẬT KHẨU DO SẾP TỰ ĐẶT, TÔI KHÔNG BIẾT NÓ.
 * Lần đầu vào /admin, chưa có mật khẩu thì trang hiện form "đặt mật khẩu".
 * Tôi không sinh sẵn rồi nhắn cho Sếp — mật khẩu đi qua chat là coi như lộ.
 *
 * Lưu bằng scrypt + muối ngẫu nhiên, KHÔNG lưu mật khẩu thô. CSDL có bị đọc
 * trộm cũng không suy ngược ra được.
 */

const scryptAsync = promisify(scrypt);
const TEN_COOKIE = "nb_qt";
const HAN_NGAY = 14;

/** băm mật khẩu: "muối:băm", đều dạng hex */
async function bam(matKhau: string, muoi?: Buffer): Promise<string> {
  const m = muoi ?? randomBytes(16);
  const b = (await scryptAsync(matKhau.normalize("NFKC"), m, 64)) as Buffer;
  return `${m.toString("hex")}:${b.toString("hex")}`;
}

async function khop(matKhau: string, luu: string): Promise<boolean> {
  const [muoiHex, bamHex] = luu.split(":");
  if (!muoiHex || !bamHex) return false;
  const thu = await bam(matKhau, Buffer.from(muoiHex, "hex"));
  const phanBam = thu.split(":")[1] ?? "";
  const a = Buffer.from(phanBam, "hex");
  const b = Buffer.from(bamHex, "hex");
  // so sánh theo thời gian cố định: so bằng === thì kẻ đoán mật khẩu suy ra
  // được từng ký tự đúng nhờ đo thời gian trả lời
  return a.length === b.length && timingSafeEqual(a, b);
}

const KHOA_MK = "he-thong.mat-khau";

export async function daDatMatKhau(): Promise<boolean> {
  const r = await hoiMot<{ co: boolean }>("select true as co from noi_dung where khoa = $1", [KHOA_MK]);
  return !!r;
}

/** Đặt mật khẩu lần đầu. Từ chối nếu đã có — tránh người lạ ghi đè. */
export async function datMatKhauLanDau(matKhau: string): Promise<{ ok: boolean; loi?: string }> {
  if (matKhau.length < 10) return { ok: false, loi: "Mật khẩu phải từ 10 ký tự trở lên." };
  if (await daDatMatKhau()) return { ok: false, loi: "Mật khẩu đã được đặt trước đó." };
  await hoi("insert into noi_dung (khoa, gia_tri) values ($1, $2) on conflict (khoa) do nothing", [
    KHOA_MK,
    JSON.stringify({ bam: await bam(matKhau) }),
  ]);
  return { ok: true };
}

export async function doiMatKhau(cu: string, moi: string): Promise<{ ok: boolean; loi?: string }> {
  if (moi.length < 10) return { ok: false, loi: "Mật khẩu mới phải từ 10 ký tự trở lên." };
  const r = await hoiMot<{ gia_tri: { bam: string } }>("select gia_tri from noi_dung where khoa = $1", [KHOA_MK]);
  if (!r || !(await khop(cu, r.gia_tri.bam))) return { ok: false, loi: "Mật khẩu hiện tại không đúng." };
  await hoi("update noi_dung set gia_tri = $2 where khoa = $1", [KHOA_MK, JSON.stringify({ bam: await bam(moi) })]);
  // đổi mật khẩu thì đá mọi phiên đang mở ra ngoài
  await hoi("delete from phien");
  return { ok: true };
}

/** Kiểm mật khẩu, tạo phiên, đặt cookie. */
export async function vao(matKhau: string): Promise<{ ok: boolean; loi?: string }> {
  const r = await hoiMot<{ gia_tri: { bam: string } }>("select gia_tri from noi_dung where khoa = $1", [KHOA_MK]);
  if (!r) return { ok: false, loi: "Chưa đặt mật khẩu." };
  if (!(await khop(matKhau, r.gia_tri.bam))) return { ok: false, loi: "Mật khẩu không đúng." };

  const ma = randomBytes(32).toString("hex");
  const hetHan = new Date(Date.now() + HAN_NGAY * 864e5);
  await hoi("insert into phien (ma, het_han) values ($1, $2)", [ma, hetHan]);
  await hoi("delete from phien where het_han < now()");

  /* `secure` đặt theo CHÍNH KẾT NỐI đang dùng, KHÔNG theo NODE_ENV.
     Đặt theo NODE_ENV thì bản dựng production mở qua http trần (vào thẳng IP,
     hay thử trên máy trong mạng nội bộ) sẽ không nhận cookie nào cả — trang
     im lặng không đăng nhập được mà chẳng báo lỗi gì. Đã dính đúng lỗi này ở
     xigon1987. */
  const h = await headers();
  const https = ((h.get("x-forwarded-proto") ?? "").split(",")[0] ?? "").trim() === "https";

  (await cookies()).set(TEN_COOKIE, ma, {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    expires: hetHan,
  });
  return { ok: true };
}

export async function ra() {
  const c = await cookies();
  const ma = c.get(TEN_COOKIE)?.value;
  if (ma) await hoi("delete from phien where ma = $1", [ma]);
  c.delete(TEN_COOKIE);
}

/** true khi phiên còn hiệu lực. Dùng ở mọi trang và mọi API của /admin. */
export async function daVao(): Promise<boolean> {
  const ma = (await cookies()).get(TEN_COOKIE)?.value;
  if (!ma) return false;
  const r = await hoiMot("select 1 from phien where ma = $1 and het_han > now()", [ma]);
  return !!r;
}
