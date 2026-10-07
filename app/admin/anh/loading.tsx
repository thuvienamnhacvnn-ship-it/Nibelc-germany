import { DauXuong, VungXuong, Xuong } from "../_chung/Rong";

export default function DangTai() {
  return (
    <>
      <DauXuong />
      <VungXuong>
        <Xuong cao={150} bo={14} />
        <div className="qt-luoi-anh qt-cach">
          {Array.from({ length: 12 }, (_, i) => (
            <Xuong key={i} tyLe="1" />
          ))}
        </div>
      </VungXuong>
    </>
  );
}
