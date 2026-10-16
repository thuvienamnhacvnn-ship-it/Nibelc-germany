import "./cong-nghe.css";

export function DuongBay({ doc = false, luoi = false }: { doc?: boolean; luoi?: boolean }) {
  const net = doc ? "M10 0 V900" : luoi ? "M167 150 H833 V300 H20 V450 H833 V600 H20 V750 H833" : "M12 106 C260 -10 740 -10 988 106";
  // Dùng dấu revealed của hệ hiện có để không tạo thêm observer.
  return <svg data-reveal className={`nb-duong-bay ${doc ? "nb-duong-bay-doc" : ""} ${luoi ? "nb-duong-bay-luoi" : ""}`} viewBox={doc ? "0 0 20 900" : luoi ? "0 0 1000 900" : "0 0 1000 130"} preserveAspectRatio="none" fill="none" aria-hidden="true">
    <path className="nb-duong-nen" d={net} />
    <path className="nb-duong-ve" pathLength="1" d={net} />
    {!doc && !luoi && <><circle cx="12" cy="106" r="4" /><circle cx="988" cy="106" r="4" /></>}
  </svg>;
}
