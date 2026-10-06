"use client";

import { useTransition } from "react";
import { viecKhoiPhuc } from "../viec";

export function NutKhoiPhuc({ id, ten }: { id: number; ten: string }) {
  const [dangChay, batDau] = useTransition();
  return (
    <button
      type="button"
      disabled={dangChay}
      style={{ minHeight: 34, padding: "0 11px", fontSize: 13 }}
      onClick={() => {
        if (!window.confirm(`Khôi phục "${ten}" về bản trước thay đổi này?`)) return;
        batDau(() => void viecKhoiPhuc(id));
      }}
    >
      {dangChay ? "Đang…" : "Khôi phục"}
    </button>
  );
}
