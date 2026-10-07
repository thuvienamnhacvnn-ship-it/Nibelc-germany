import { docTepKho } from "@/lib/quan-tri/kho-anh";

/**
 * PHỤC VỤ ẢNH TRONG KHO — công khai: GET /kho/<tep>
 *
 * Ảnh nằm NGOÀI thư mục app nên Next không tự phục vụ như public/, phải có
 * route này. proxy.ts bỏ qua mọi đường dẫn có đuôi file, nên /kho/x.webp
 * không bị đẩy qua bộ định tuyến ngôn ngữ.
 *
 * CHỐNG ĐI LẠC THƯ MỤC: chỉ nhận tên khớp đúng khuôn "<24 hex>.<đuôi>" (kiểm
 * trong docTepKho). Tên có "..", gạch chéo hay bất cứ thứ gì khác đều 404
 * trước khi chạm tới ổ đĩa.
 *
 * Cache một năm + immutable: tên file sinh ngẫu nhiên và không bao giờ được
 * ghi đè (thay ảnh là ra tên mới), nên trình duyệt giữ mãi cũng không sai.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ tep: string }> }) {
  const { tep } = await params;
  const f = await docTepKho(tep);
  if (!f) return new Response("Không có ảnh này", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(new Uint8Array(f.duLieu), {
    headers: {
      "Content-Type": f.loai,
      "Content-Length": String(f.duLieu.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      // không cho trình duyệt tự đoán lại kiểu file — thứ trong kho luôn là ảnh
      "X-Content-Type-Options": "nosniff",
    },
  });
}
