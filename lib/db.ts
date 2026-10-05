import { Pool } from "pg";

/**
 * KẾT NỐI CSDL — chỉ dùng được ở phía MÁY CHỦ.
 *
 * Chuỗi kết nối nằm trong `/opt/nibelc/.env.production.local` trên VPS, quyền
 * 600, KHÔNG nằm trong git. Mật khẩu sinh ngẫu nhiên ngay trên máy chủ nên
 * chưa từng đi qua chat hay qua máy trạm.
 *
 * Giữ MỘT pool dùng chung qua globalThis: `next dev` nạp lại module mỗi lần
 * sửa file, không giữ thì mỗi lần sửa lại mở thêm một pool và Postgres hết
 * chỗ kết nối sau vài chục lần lưu.
 */
const g = globalThis as unknown as { __nbPool?: Pool };

export function db(): Pool {
  if (!g.__nbPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Thiếu DATABASE_URL — xem /opt/nibelc/.env.production.local");
    g.__nbPool = new Pool({
      connectionString: url,
      max: 8,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return g.__nbPool;
}

/** Truy vấn trả về danh sách dòng. */
export async function hoi<T = Record<string, unknown>>(sql: string, tham: unknown[] = []): Promise<T[]> {
  const r = await db().query(sql, tham);
  return r.rows as T[];
}

/** Truy vấn trả về đúng một dòng, hoặc null. */
export async function hoiMot<T = Record<string, unknown>>(sql: string, tham: unknown[] = []): Promise<T | null> {
  const r = await hoi<T>(sql, tham);
  return r[0] ?? null;
}

/**
 * Chạy nhiều lệnh trong MỘT giao dịch. Dùng khi vừa ghi dữ liệu vừa ghi nhật
 * ký — hai thứ phải cùng thành công hoặc cùng không, chứ không được ghi dữ
 * liệu xong rồi mất nhật ký.
 */
export async function giaoDich<T>(viec: (q: (sql: string, tham?: unknown[]) => Promise<unknown[]>) => Promise<T>): Promise<T> {
  const con = await db().connect();
  try {
    await con.query("begin");
    const ra = await viec(async (sql, tham = []) => (await con.query(sql, tham)).rows);
    await con.query("commit");
    return ra;
  } catch (e) {
    await con.query("rollback");
    throw e;
  } finally {
    con.release();
  }
}

/**
 * Ghi nhật ký thay đổi.
 *
 * Cả đội dùng CHUNG một tài khoản (Sếp chốt 05/10/2026) nên không biết được
 * ai sửa. Bù lại phải giữ bản TRƯỚC khi sửa, để còn hoàn tác khi có người
 * xoá nhầm hay gõ sai giá.
 */
export async function ghiNhatKy(
  q: (sql: string, tham?: unknown[]) => Promise<unknown[]>,
  viec: "them" | "sua" | "xoa" | "hien" | "an",
  bang: string,
  banGhi: string | null,
  truoc: unknown,
  sau: unknown,
) {
  await q("insert into nhat_ky (viec, bang, ban_ghi, truoc, sau) values ($1,$2,$3,$4,$5)", [
    viec,
    bang,
    banGhi,
    truoc === undefined ? null : JSON.stringify(truoc),
    sau === undefined ? null : JSON.stringify(sau),
  ]);
}
