import { Image } from "antd";

interface ProductCardProps {
  title: string;
  discountPrice?: string;
  image: string;
  hasDiscount: boolean;
  originalPrice?: string;
}

export const ProductCard = ({
  title,
  discountPrice,
  image,
  hasDiscount,
  originalPrice,
}: ProductCardProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <div className="relative flex flex-col items-start h-fit border-[1px] border-[#f0f0f0] border-solid">
      {/* SALE badge */}
      <div
        className={`absolute top-1 right-1 px-2 py-1 tracking-[.1em] text-white text-xs font-semibold z-10 ${
          hasDiscount ? "bg-black" : ""
        }`}
      >
        {hasDiscount ? "SALE" : ""}
      </div>

      {/* Product Image */}
      <Image
        height={360}
        preview={false}
        src={`${baseUrl}/${image}` || ""}
        alt="img"
        className="object-cover transition-transform duration-500 ease-in-out z-0 mb-[10px]"
      />

      <div className="px-[15px] py-[10px]">
        {/* Product Title */}
        <p className="text-[15px] font-normal break-words">{title}</p>

        {/* Pricing */}
        <div className="mt-2">
          {hasDiscount && originalPrice ? (
            <div className="flex flex-row">
              <p className="text-[15px] font-normal text-[#454545] line-through mr-1">
                {originalPrice} сум
              </p>
              <p className="text-[15px] font-normal text-[#454545]">
                {discountPrice} сум
              </p>
            </div>
          ) : (
            <p className="text-[15px] font-normal text-[#454545]">
              {originalPrice} сум
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
