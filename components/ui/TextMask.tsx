"use client";
import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";
/** Giữ chữ đầy đủ trong HTML server; observer chung chỉ thêm nhịp khi vào màn. */
function tach(chu: ReactNode): ReactNode {
  return Children.map(chu, (con) => {
    if (typeof con === "string" || typeof con === "number") return String(con).split(/(\s+)/).map((tu,i) => /\s+/.test(tu) ? tu : <span className="nb-mask-word" key={i}><span>{tu}</span></span>);
    if (isValidElement(con) && typeof con.type === "string") {
      const el = con as ReactElement<{ children?: ReactNode }>;
      return cloneElement(el, {}, tach(el.props.children));
    }
    return con;
  });
}
export function TextMask({ children }: { children: ReactNode }) { return <span className="nb-text-mask" data-mask-title>{tach(children)}</span>; }
