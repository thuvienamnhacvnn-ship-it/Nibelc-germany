"use client";

import { useCallback, useMemo, useState } from "react";
import type { JobFull } from "@/data/jobs";

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
 *
 * `donTheoNganh`: đơn hiện trên thẻ của từng ngành, server đã chọn (theo
 * featuredJobOf) và dịch sẵn theo ngôn ngữ trang — xem components/home/du-lieu.ts.
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
  /** true khi đang có thẻ mở sẵn mà bấm sang ngành khác: thẻ chuyển thẳng
      sang đơn mới chứ không bay về tệp rồi bay lên lại */
  doiTiep: boolean;
  /** đơn mới nằm bên phải (1) hay bên trái (-1) đơn đang xem, để thẻ trượt
      đúng hướng của tệp vừa bấm */
  huong: 1 | -1;
  chonNganh: (id: string, tep: ViTriTep) => void;
  boChon: () => void;
  /** giữ lại cho rail, nay không còn tạm dừng gì vì đã bỏ tự chạy */
  tamDung: (v: boolean) => void;
}

export function useHeroJobRotation(donTheoNganh: Record<string, JobFull>): HeroState {
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [oTep, setOTep] = useState<ViTriTep | null>(null);
  const [doiTiep, setDoiTiep] = useState(false);
  const [huong, setHuong] = useState<1 | -1>(1);

  const chonNganh = useCallback((id: string, tep: ViTriTep) => {
    setIndustryId((truoc) => {
      if (truoc === id) return null; // bấm lại đúng tệp đang mở thì đóng
      // Đang mở sẵn một đơn: đây là ĐỔI đơn, thẻ chuyển thẳng tại chỗ.
      setDoiTiep(truoc !== null);
      setOTep((tepCu) => {
        if (tepCu) setHuong(tep.x >= tepCu.x ? 1 : -1);
        return tep;
      });
      return id;
    });
  }, []);

  const boChon = useCallback(() => {
    setDoiTiep(false);
    setIndustryId(null);
  }, []);
  const tamDung = useCallback(() => {}, []);

  const job = useMemo(
    () => (industryId ? (donTheoNganh[industryId] ?? null) : null),
    [industryId, donTheoNganh],
  );

  return {
    industryId,
    job,
    dangHienJob: job !== null,
    oTep,
    doiTiep,
    huong,
    chonNganh,
    boChon,
    tamDung,
  };
}
