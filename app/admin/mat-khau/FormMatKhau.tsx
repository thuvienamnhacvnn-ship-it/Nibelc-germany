"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { viecDoiMatKhau } from "../viec";
import { useThongBao } from "../_chung/ThongBao";
import { chuLoi } from "../_chung/dinh-dang";

export function FormMatKhau() {
  const tb = useThongBao();
  const router = useRouter();
  const [loi, setLoi] = useState("");
  const [chay, setChay] = useState(false);

  async function gui(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Tự kiểm và báo bằng chữ của mình (form đặt noValidate): bong bóng của trình duyệt nói tiếng Anh
    // trên máy cài tiếng Anh, nhân viên không đọc được.
    if (!String(fd.get("cu") ?? "")) return setLoi("Chưa nhập mật khẩu hiện tại.");
    if (String(fd.get("moi") ?? "").length < 10) return setLoi("Mật khẩu mới phải từ 10 ký tự trở lên.");
    // kiểm hai ô giống nhau ngay ở trình duyệt: gõ lệch mà vẫn đổi là cả đội bị khoá ngoài
    if (fd.get("moi") !== fd.get("nhac_lai")) return setLoi("Hai ô mật khẩu mới không giống nhau.");
    setLoi("");
    setChay(true);
    try {
      const r = await viecDoiMatKhau(null, fd);
      if (r.loi) setLoi(r.loi);
      else {
        form.reset();
        tb.xong("Đã đổi mật khẩu. Mọi máy đang đăng nhập bị thoát ra.");
        // phiên của chính máy này cũng có thể đã bị huỷ — dựng lại để về cổng vào nếu vậy
        router.refresh();
      }
    } catch (err) {
      setLoi(chuLoi(err));
    }
    setChay(false);
  }

  return (
    <form className="qt-tam" style={{ maxWidth: 460 }} onSubmit={gui} noValidate>
      {loi && (
        <p className="qt-loi" role="alert">
          {loi}
        </p>
      )}
      <div className="qt-o">
        <label htmlFor="mk-cu">Mật khẩu hiện tại</label>
        <input id="mk-cu" name="cu" type="password" autoComplete="current-password" required />
      </div>
      <div className="qt-o">
        <label htmlFor="mk-moi">Mật khẩu mới (ít nhất 10 ký tự)</label>
        <input id="mk-moi" name="moi" type="password" autoComplete="new-password" required minLength={10} />
      </div>
      <div className="qt-o">
        <label htmlFor="mk-lai">Nhắc lại mật khẩu mới</label>
        <input id="mk-lai" name="nhac_lai" type="password" autoComplete="new-password" required minLength={10} />
      </div>
      <button type="submit" className="qt-chinh" disabled={chay} aria-busy={chay} style={{ marginTop: 16, minWidth: 150 }}>
        {chay && <LoaderCircle className="qt-quay" aria-hidden />}
        {chay ? "Đang đổi…" : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
