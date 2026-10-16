import { AnimatedNumber } from "@/components/ui/TechText";
import "./cong-nghe.css";

export function TheDuLieu({ nhan, so, chuThich }: { nhan: string; so: number | string; chuThich: string }) {
  return <div data-reveal className="nb-du-lieu">
    <p className="nb-ma">{nhan}</p>
    <p className="nb-du-lieu-so">{typeof so === "number" ? <AnimatedNumber value={so} demMotLan /> : so}</p>
    <p className="text-sm text-[var(--nb-text-dim)]">{chuThich}</p>
  </div>;
}
