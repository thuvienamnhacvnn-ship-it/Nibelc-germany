import { doHoa } from "@/lib/i18n/dict/do-hoa";
import type { Lang } from "@/lib/i18n/config";

export function BieuDoNganh({ ds, lang }: { ds: { ma: string; ten: string; so: number }[]; lang: Lang }) {
  const max = Math.max(1, ...ds.map(d => d.so));
  return <figure className="nb-bieu-do">
    <figcaption>{doHoa[lang].phanBo}</figcaption>
    <div>{ds.map(d => <div key={d.ma} className="nb-bieu-cot" title={`${d.ten}: ${d.so}`}>
      <svg viewBox="0 0 24 36" aria-hidden="true"><path d="M1 35H23" className="nb-mach-nen" /><rect x="4" y={34 - d.so / max * 30} width="16" height={d.so / max * 30} fill="currentColor" /></svg>
      <span>{d.ma} <b>{d.so}</b></span><span className="sr-only">{d.ten}</span>
    </div>)}</div>
  </figure>;
}
