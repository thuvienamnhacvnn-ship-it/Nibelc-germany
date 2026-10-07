import { DauXuong, VungXuong, Xuong } from "../_chung/Rong";

export default function DangTai() {
  return (
    <>
      <DauXuong />
      <VungXuong>
        <div className="qt-nd-ds">
          {Array.from({ length: 3 }, (_, i) => (
            <Xuong key={i} cao={200} bo={14} />
          ))}
        </div>
      </VungXuong>
    </>
  );
}
