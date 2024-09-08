export function ProductDetailsHeader({
  category,
  name,
  price,
  originalPrice,
}: {
  category: string;
  name: string;
  price: number;
  originalPrice?: number; // Optional original price if there's a discount
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-[#454545] tracking-[.2em] font-light">
        {category}
      </p>
      <h1 className="text-lg text-[#454545] tracking-[.2em] font-normal">
        {name}
      </h1>
      {originalPrice && originalPrice > price ? (
        <div className="flex items-center gap-2">
          <p className="text-[14px] text-[#9D9D9D] tracking-[.2em] font-normal line-through">
            {originalPrice} сум
          </p>
          <p className="text-[14px] text-red-500 tracking-[.2em] font-normal">
            {price} сум
          </p>
        </div>
      ) : (
        <p className="text-[14px] text-[#9D9D9D] tracking-[.2em] font-normal">
          {price} сум
        </p>
      )}
    </div>
  );
}
