"use client";

import { useState } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { BriefcaseBusiness } from "lucide-react";
import { TamKinh } from "@/components/ui/TamKinh";
import { TechText } from "@/components/ui/TechText";
import "@/components/ui/page-hero.css";
import "./cum-tieu-de.css";

const font = Be_Vietnam_Pro({ subsets: ["vietnamese", "latin"], weight: ["700", "800"], display: "swap" });

export interface ChuTieuDe {
  dong1a: string;
  dong1b: string;
  dong2: string;
  dong3: string;
  dong4: string;
  dong5: string;
}

export const CHU_VI: ChuTieuDe = {
  dong1a: "Arbeiten in",
  dong1b: "Deutschland",
  dong2: "mit Nibelc Germany GmbH",
  dong3: "ĐỐI TÁC UY TÍN",
  dong4: "LỰA CHỌN TỐT NHẤT CỦA BẠN",
  dong5: "CHO VIỆC LÀM VÀ HỌC NGHỀ TẠI ĐỨC, CHÂU ÂU",
};

/** Giữ chữ quản trị; chỉ tách chip khi có dấu phân cách rõ ràng. */
export function CumTieuDe({ chu = CHU_VI, deDong1 = false, className = "" }: {
  chu?: ChuTieuDe;
  deDong1?: boolean;
  className?: string;
}) {
  const [daGiaiMa, datDaGiaiMa] = useState(false);
  const chips = chu.dong5.split(/\s*[·|;]\s*/).filter(Boolean);
  return <div className={`nb-cum-tieu-de ${className}`}>
    <TamKinh className={`nb-home-sign ${daGiaiMa ? "nb-title-decoded" : ""}`}>
      <p className="nb-title-kicker" lang={deDong1 ? "de" : undefined}>
        <i aria-hidden="true" /><span>[ {chu.dong1a} {chu.dong1b} · {chu.dong2} ]<b aria-hidden="true">_</b></span>
      </p>
      <h1 className={`nb-title-main ${font.className}`}>
        <TechText duration={900} onComplete={() => datDaGiaiMa(true)}>{chu.dong3}</TechText>
      </h1>
      <span className="nb-title-scan" aria-hidden="true" />
      <p className="nb-title-sub">{chu.dong4}</p>
      <ul className="nb-title-chips">{chips.map((chip, i) => <li key={`${i}-${chip}`}><BriefcaseBusiness size={13} aria-hidden="true" /><span>{chip}</span></li>)}</ul>
    </TamKinh>
  </div>;
}
