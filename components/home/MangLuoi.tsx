import type { JobFull } from "@/data/jobs";
import type { Lang } from "@/lib/i18n/config";
import { hieuUngHome } from "@/lib/i18n/dict/hieu-ung-home";
import { TechText } from "@/components/ui/TechText";

type Diem = [number, number];
// Đường bờ giản lược theo kinh/vĩ độ; sơ đồ trang trí, không phải bản đồ ranh giới.
const datLien: Diem[][] = [
  [[-9,36],[-10,43],[-2,44],[-5,48],[2,51],[8,54],[9,57],[13,55],[14,54],[20,55],[21,57],[24,58],[24,60],[30,60],[35,56],[39,53],[35,46],[29,41],[27,40],[24,38],[24,35],[22,37],[20,40],[18,42],[16,40],[15,37],[12,38],[13,43],[9,44],[7,43],[3,43],[0,40],[-1,37]],
  [[5,58],[8,63],[14,67],[21,70],[28,71],[31,70],[29,65],[25,60],[20,60],[18,64],[16,62],[13,56],[10,55]],
  [[-6,50],[-5,54],[-7,57],[-4,59],[-2,57],[0,53],[2,51]],
  [[-10,51],[-10,55],[-7,56],[-6,53],[-7,51]],
  [[8,40],[9,41],[10,39],[9,38]], [[12,38],[15,38],[15,37],[13,37]],
];
const vietNam: Diem[] = [[102.1,22.4],[103,22.8],[104.8,23.4],[106,22.8],[106.7,22],[108,21.5],[107,20.5],[105.7,19.3],[106.5,18],[108,16],[109.3,13],[109.2,11.5],[107,10.5],[106.7,9],[104.8,8.5],[104.5,10.3],[106,11],[107.3,12],[107.5,14.5],[106.5,16.5],[104.5,19],[104,20.5],[102.1,22.4]];
function trong([x,y]: Diem, daGiac: Diem[]) {
  let dung = false;
  for (let i=0,j=daGiac.length-1;i<daGiac.length;j=i++) {
    const [a,b]=daGiac[i]!, [c,d]=daGiac[j]!;
    if ((b>y)!==(d>y) && x<(c-a)*(y-b)/(d-b)+a) dung=!dung;
  }
  return dung;
}
const chieu = ([kinh,vi]: Diem): Diem => [36+(kinh+12)*8, 38+(72-vi)*9];
const chieuVn = ([kinh,vi]: Diem): Diem => [617+(kinh-102)*10, 135+(24-vi)*10];
const cham: Diem[] = [];
for (let vi=35;vi<=71;vi+=.85) for (let kinh=-11;kinh<=39;kinh+=1.15) if (datLien.some(vung=>trong([kinh,vi],vung))) cham.push(chieu([kinh,vi]));
for (let vi=8;vi<=24;vi+=.55) for (let kinh=102;kinh<=110;kinh+=.55) if (trong([kinh,vi],vietNam)) cham.push(chieuVn([kinh,vi]));

// Chỉ định vị các địa danh đã biết; địa danh mới vẫn được liệt kê, không đoán vị trí.
const toaDo: Record<string,Diem> = {
  tirana: [19.82,41.33], athens: [23.73,37.98], athen: [23.73,37.98],
  acharnes: [23.73,38.08], ioannina: [20.85,39.67], korinthos: [22.93,37.94], corinth: [22.93,37.94],
  thessaloniki: [22.94,40.64], sindos: [22.80,40.67], vilnius: [25.28,54.69],
  berlin: [13.40,52.52], graz: [15.44,47.07], stuttgart: [9.18,48.78],
  munchen: [11.58,48.14], munich: [11.58,48.14], hamburg: [9.99,53.55],
  albania: [20.17,41.15], albanien: [20.17,41.15],
  ao: [14.55,47.52], austria: [14.55,47.52], osterreich: [14.55,47.52],
  "hy lap": [22.9,39.1], greece: [22.9,39.1], griechenland: [22.9,39.1],
};
function dinhVi(ten: string): Diem | undefined {
  const ma = ten.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  // So khớp cụm rõ ràng, ví dụ "Berlin và các vùng lân cận", không suy thành phố từ quốc gia.
  const khoa = Object.keys(toaDo).find(k => ma === k || ma.split(/[^a-z]+/).includes(k));
  return khoa ? chieu(toaDo[khoa]!) : undefined;
}

export function MangLuoi({ ds, lang }: { ds: JobFull[]; lang: Lang }) {
  const tx = hieuUngHome[lang];
  const nhom = new Map<string,{ ten:string; nuoc:string; so:number; diem?:Diem }>();
  for (const don of ds.filter(d => !d.isSample)) {
    const ten = don.city.trim() || don.state.trim();
    if (!ten) continue;
    const ma = `${ten}\u0000${don.state}`;
    const cu = nhom.get(ma);
    if (cu) cu.so++;
    else nhom.set(ma,{ ten, nuoc:don.state, so:1, diem:dinhVi(ten) });
  }
  const danhSach = [...nhom.values()].sort((a,b)=>b.so-a.so || a.ten.localeCompare(b.ten,lang));
  const dich: Diem = chieuVn([105.85,21.03]);
  return <section data-theme-island="dark" className="nb-mang-luoi">
    <div className="nb-wrap nb-chuong">
      <div data-reveal><p className="nb-eyebrow nb-gd5-motion"><TechText>{tx.nhan}</TechText></p><h2 className="nb-display nb-tieu-de">{tx.tieuDe}</h2><p className="nb-mo">{tx.mo}</p></div>
      <div className="nb-mang-bo-cuc">
        <figure className="nb-ban-do nb-gd5-motion">
          <svg viewBox="0 0 760 405" role="img" aria-label={tx.banDo}>
            <g className="nb-ban-do-cham">{cham.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.15" />)}</g>
            <g className="nb-ban-do-cung">{danhSach.filter(n=>n.diem).map((n,i)=>{const [x,y]=n.diem!; return <path key={i} d={`M${x},${y} Q${(x+dich[0])/2},${Math.min(y,dich[1])-90} ${dich[0]},${dich[1]}`} />;})}</g>
            <g className="nb-ban-do-diem">{danhSach.filter(n=>n.diem).map((n,i)=><g key={i} style={{animationDelay:`${i*140}ms`}}><title>{`${n.ten}, ${n.nuoc}: ${n.so}`}</title><circle cx={n.diem![0]} cy={n.diem![1]} r="3" /><circle className="nb-ban-do-vong" cx={n.diem![0]} cy={n.diem![1]} r="6" /></g>)}<circle cx={dich[0]} cy={dich[1]} r="3" /></g>
            <text x="610" y="328">{tx.vietNam}</text><text x="36" y="390">VN ⇄ DE / NIBELC</text>
          </svg>
          <figcaption>{tx.ghiChu}</figcaption>
        </figure>
        <div className="nb-mang-ds" tabIndex={0} role="region" aria-label={tx.diaDiem}>{danhSach.length ? <table><thead><tr><th>{tx.diaDiem}</th><th>{tx.soDon}</th></tr></thead><tbody>{danhSach.map(n=><tr key={`${n.ten}-${n.nuoc}`}><td>{n.ten}<small>{n.nuoc !== n.ten && n.nuoc}{!n.diem && <span>{tx.chuaDinhVi}</span>}</small></td><td>{n.so}</td></tr>)}</tbody></table> : <p>{tx.rong}</p>}</div>
      </div>
    </div>
  </section>;
}
