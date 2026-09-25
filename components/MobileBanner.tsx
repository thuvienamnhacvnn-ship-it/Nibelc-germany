import Image from "next/image";

/**
 * Băng ảnh đầu trang cho điện thoại — dùng chung để mọi trang có cùng một
 * phong cách banner: ảnh nằm trên, chữ nằm dưới.
 *
 * Trước đây ảnh hero của các trang 02, 03, 04 và 08 chỉ hiện từ 1024px
 * (`hidden lg:block`), nên trên điện thoại các trang đó mở ra chỉ toàn chữ,
 * lạc hẳn so với trang chủ và hai trang 05, 06.
 */
export function MobileBanner({
  src,
  alt = "",
  focus = "50% 40%",
  priority,
}: {
  src: string;
  alt?: string;
  focus?: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[390/230] w-full overflow-hidden lg:hidden">
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" style={{ objectPosition: focus }} />
      {/* phủ nhẹ ở đáy để nối liền với khối chữ bên dưới */}
      <span
        className="absolute inset-x-0 bottom-0 h-1/4"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,.55))" }}
        aria-hidden="true"
      />
    </div>
  );
}
