"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { INDUSTRIES } from "@/data/industries";
import { featuredJobOf, type JobFull } from "@/data/jobs";

/**
 * MÁY TRẠNG THÁI CỦA HERO TRANG CHỦ
 *
 * IDLE_BRAND      hero thương hiệu, chưa chọn ngành nào
 * AUTO_PREVIEW    tự chọn một ngành, job đang bay lên
 * FEATURED_JOB    hero đang giới thiệu một đơn hàng
 * RETURNING       job bay về phong bì
 *
 * Viết bằng MỘT đồng hồ duy nhất chạy theo `pha`, không rải setTimeout lồng
 * nhau — kiểu đó rất dễ thành mớ bòng bong và rò bộ đếm khi người dùng bấm
 * giữa chừng.
 */

export type Pha = "IDLE_BRAND" | "AUTO_PREVIEW" | "FEATURED_JOB" | "RETURNING";

/** Chỉ xoay vòng những ngành thật sự có phong bì trên rail */
const NGANH_XOAY = INDUSTRIES.filter((i) => i.envelope !== null);

const THOI_GIAN: Record<Pha, number> = {
  IDLE_BRAND: 5200, // đứng yên bao lâu rồi mới tự chọn ngành
  AUTO_PREVIEW: 850, // job bay lên
  FEATURED_JOB: 6000, // hero giới thiệu đơn
  RETURNING: 700, // job bay về
};

/** Người dùng bấm thì tạm dừng tự chạy bấy nhiêu mili giây */
const NGHI_SAU_KHI_BAM = 25_000;

export interface HeroState {
  pha: Pha;
  industryId: string | null;
  job: JobFull | null;
  /** true khi hero đang ở chế độ giới thiệu đơn hàng */
  dangHienJob: boolean;
  chonNganh: (id: string) => void;
  boChon: () => void;
  tamDung: (v: boolean) => void;
}

export function useHeroJobRotation(): HeroState {
  const [pha, setPha] = useState<Pha>("IDLE_BRAND");
  const [industryId, setIndustryId] = useState<string | null>(null);

  const treoChuot = useRef(false);
  const nghiToi = useRef(0);
  const viTri = useRef(-1);
  const giamChuyenDong = useRef(false);

  useEffect(() => {
    giamChuyenDong.current =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /** Ngành kế tiếp, không lặp lại ngành vừa chạy */
  const nganhKeTiep = useCallback(() => {
    if (!NGANH_XOAY.length) return null;
    viTri.current = (viTri.current + 1) % NGANH_XOAY.length;
    return NGANH_XOAY[viTri.current]!.id;
  }, []);

  useEffect(() => {
    // Tôn trọng cài đặt giảm chuyển động: đứng yên ở hero thương hiệu
    if (giamChuyenDong.current) return;

    const t = setTimeout(() => {
      if (treoChuot.current || Date.now() < nghiToi.current) return;

      if (pha === "IDLE_BRAND") {
        const id = nganhKeTiep();
        if (!id) return;
        setIndustryId(id);
        setPha("AUTO_PREVIEW");
      } else if (pha === "AUTO_PREVIEW") {
        setPha("FEATURED_JOB");
      } else if (pha === "FEATURED_JOB") {
        setPha("RETURNING");
      } else {
        setIndustryId(null);
        setPha("IDLE_BRAND");
      }
    }, THOI_GIAN[pha]);

    return () => clearTimeout(t);
  }, [pha, nganhKeTiep]);

  const chonNganh = useCallback((id: string) => {
    nghiToi.current = Date.now() + NGHI_SAU_KHI_BAM;
    setIndustryId((truoc) => {
      // bấm lại đúng ngành đang mở thì đóng lại
      if (truoc === id) {
        setPha("RETURNING");
        return truoc;
      }
      setPha("AUTO_PREVIEW");
      return id;
    });
    // đưa con trỏ vòng xoay về đúng chỗ để lần tự chạy sau đi tiếp từ đây
    const i = NGANH_XOAY.findIndex((x) => x.id === id);
    if (i >= 0) viTri.current = i;
  }, []);

  const boChon = useCallback(() => {
    nghiToi.current = Date.now() + NGHI_SAU_KHI_BAM;
    setPha("RETURNING");
  }, []);

  const tamDung = useCallback((v: boolean) => {
    treoChuot.current = v;
  }, []);

  // AUTO_PREVIEW chỉ là chặng bay lên; sau đó tự sang FEATURED_JOB
  useEffect(() => {
    if (pha !== "AUTO_PREVIEW" || !giamChuyenDong.current) return;
    setPha("FEATURED_JOB");
  }, [pha]);

  const job = useMemo(() => (industryId ? (featuredJobOf(industryId) ?? null) : null), [industryId]);

  return {
    pha,
    industryId,
    job,
    dangHienJob: (pha === "AUTO_PREVIEW" || pha === "FEATURED_JOB") && job !== null,
    chonNganh,
    boChon,
    tamDung,
  };
}
