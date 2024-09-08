import { Image, Badge } from "antd";
import { useEffect, useState } from "react";

export const CheckoutCartItem: React.FC<{
  title?: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image: string;
}> = ({ title, subtitle, price, quantity, image }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [discountedTotal, setDiscountedTotal] = useState(0);

  useEffect(() => {
    const calculateDiscountedTotal = () => {
      const itemBasePrice = Number(price);
      if (isNaN(itemBasePrice) || itemBasePrice < 0) {
        console.error(`Invalid price: ${price}`);
        return 0;
      }

      let total = 0;
      for (let i = 0; i < quantity; i++) {
        total += i % 2 === 0 ? itemBasePrice : itemBasePrice / 2;
      }
      return total;
    };

    setDiscountedTotal(calculateDiscountedTotal());
  }, [price, quantity]);

  // Check if a discount is applied
  const isDiscountApplied = quantity > 1;

  // Calculate original total without discount for display purposes
  const originalTotal = price * quantity;

  return (
    <div className="flex flex-row items-center">
      <Badge count={quantity} color="#0000008F" offset={[-6, 0]}>
        <Image
          width={64}
          height={64}
          src={`${baseUrl}/${image}`}
          preview={false}
          alt="cart item"
          className="border border-[#DADADA] object-cover border-solid rounded-[5px]"
        />
      </Badge>
      <div className="flex-1 flex flex-col justify-center pl-[14px]">
        <h1 className="text-[14px] font-normal">{title}</h1>
        <p className="text-xs font-normal text-[#0000008F] my-1">{price}</p>
        <p className="text-xs font-normal text-[#0000008F]">{subtitle}</p>
      </div>
      <div className="flex flex-col justify-center items-center pl-[14px]">
        {isDiscountApplied ? (
          <>
            <p className="text-[12px] font-normal line-through text-[#0000008F]">
              {originalTotal.toFixed(2)} сум
            </p>
            <p className="text-[14px] font-bold text-red-500">
              {discountedTotal.toFixed(2)} сум
            </p>
          </>
        ) : (
          <p className="text-[14px] font-normal">
            {discountedTotal.toFixed(2)} сум
          </p>
        )}
      </div>
    </div>
  );
};
