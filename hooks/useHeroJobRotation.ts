"use client";

import { useCallback, useMemo, useState } from "react";
import { featuredJobOf, type JobFull } from "@/data/jobs";

/**
 * TRẠNG THÁI THẺ ĐƠN HÀNG TRÊN HERO
 *
 * KHÔNG tự chạy. Thẻ đơn hàng chỉ hiện khi người dùng bấm một tệp ngành, và
 * chỉ tắt khi họ bấm lại tệp đó, bấm nút đóng, hoặc bấm mục menu của chính
 * trang đang xem. Bản trước có vòng xoay tự động 5–7 giây một ngành; Sếp bỏ
 * vì nó tự nhảy khi người xem chưa đụng gì.
 *
 * `oTep` giữ vị trí tệp vừa bấm (toạ độ trên màn hình) để thẻ đơn hàng biết
 * phải bay ra từ đâu.
 */

export interface ViTriTep {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HeroState {
  industryId: string | null;
  job: JobFull | null;
  dangHienJob: boolean;
  oTep: ViTriTep | null;
  chonNganh: (id: string, tep: ViTriTep) => void;
  boChon: () => void;
  /** giữ lại cho rail, nay không còn tạm dừng gì vì đã bỏ tự chạy */
  tamDung: (v: boolean) => void;
}

export function useHeroJobRotation(): HeroState {
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [oTep, setOTep] = useState<ViTriTep | null>(null);

  const chonNganh = useCallback((id: string, tep: ViTriTep) => {
    setIndustryId((truoc) => {
      if (truoc === id) return null; // bấm lại đúng tệp đang mở thì đóng
      setOTep(tep);
      return id;
    });
  }, []);

  const boChon = useCallback(() => setIndustryId(null), []);
  const tamDung = useCallback(() => {}, []);

  const job = useMemo(() => (industryId ? (featuredJobOf(industryId) ?? null) : null), [industryId]);

  return {
    industryId,
    job,
    dangHienJob: job !== null,
    oTep,
    chonNganh,
    boChon,
    tamDung,
  };
}
