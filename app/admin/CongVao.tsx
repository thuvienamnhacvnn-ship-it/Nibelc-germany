"use client";

import { useActionState } from "react";
import { viecDatMatKhau, viecVao } from "./viec";

/**
 * CỬA VÀO TRANG QUẢN TRỊ.
 *
 * Chưa có mật khẩu → hiện form ĐẶT mật khẩu. Sếp tự gõ, tôi không sinh sẵn
 * rồi nhắn qua chat: mật khẩu đi qua chat là coi như lộ.
 * Đã có → form đăng nhập bình thường.
 */
export function CongVao({ daDat }: { daDat: boolean }) {
  return daDat ? <FormVao /> : <FormDat />;
}

function FormVao() {
  const [kq, gui, dangChay] = useActionState(viecVao, null as { loi?: string } | null);
  return (
    <div className="qt-giua">
      <div className="qt-tam">
        <h1>Quản trị NIBELC</h1>
        <p className="qt-phu">Nhập mật khẩu chung của đội để vào.</p>
        <form action={gui}>
          {kq?.loi && <p className="qt-loi">{kq.loi}</p>}
          <div className="qt-o">
            <label htmlFor="mk">Mật khẩu</label>
            <input id="mk" name="mat_khau" type="password" autoComplete="current-password" required autoFocus />
          </div>
          <button type="submit" className="qt-chinh" disabled={dangChay} style={{ width: "100%", marginTop: 16 }}>
            {dangChay ? "Đang kiểm…" : "Vào"}
          </button>
        </form>
      </div>
    </div>
  );
}

function FormDat() {
  const [kq, gui, dangChay] = useActionState(viecDatMatKhau, null as { loi?: string } | null);
  return (
    <div className="qt-giua">
      <div className="qt-tam">
        <h1>Đặt mật khẩu</h1>
        <p className="qt-phu">
          Lần đầu vào trang quản trị. Mật khẩu này cả đội dùng chung — đặt xong hãy lưu vào nơi an toàn, vì nó
          không hiện lại ở đâu nữa.
        </p>
        <form action={gui}>
          {kq?.loi && <p className="qt-loi">{kq.loi}</p>}
          <div className="qt-o">
            <label htmlFor="mk1">Mật khẩu mới (ít nhất 10 ký tự)</label>
            <input id="mk1" name="mat_khau" type="password" autoComplete="new-password" required minLength={10} autoFocus />
          </div>
          <div className="qt-o">
            <label htmlFor="mk2">Nhắc lại</label>
            <input id="mk2" name="nhac_lai" type="password" autoComplete="new-password" required minLength={10} />
          </div>
          <button type="submit" className="qt-chinh" disabled={dangChay} style={{ width: "100%", marginTop: 16 }}>
            {dangChay ? "Đang đặt…" : "Đặt mật khẩu và vào"}
          </button>
        </form>
      </div>
    </div>
  );
}
