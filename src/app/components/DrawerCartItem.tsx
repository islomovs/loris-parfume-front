/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Flex } from "antd";
import { UnderlinedButton } from "./UnderlinedButton";
import { removeFromCart, getCartItems, ICartItem } from "../../services/cart";
import { BiMinus } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import useCartStore from "@/services/store";

interface IDrawerCartItemProps {
  id: number;
  slug: string;
  title: string | undefined;
  price: number;
  qty: number;
  image: string;
  sizeName?: string;
  sizeId?: number;
}

export const DrawerCartItem: React.FC<IDrawerCartItemProps> = ({
  id,
  slug,
  title,
  price,
  qty,
  image,
  sizeName,
  sizeId,
}) => {
  const [quantity, setQuantity] = useState(qty);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { setCartItems, updateCartItemQuantity } = useCartStore(
    (state) => state
  );

  useEffect(() => {
    updateCartItemQuantity(id, quantity, sizeId);
  }, [quantity]);

  const handleRemove = async () => {
    if (sizeId !== null) {
      await removeFromCart(slug, sizeId);
    } else {
      await removeFromCart(slug);
    }
    const updatedCart = await getCartItems();
    setCartItems(updatedCart?.data);
  };

  return (
    <div className="flex flex-row gap-5 min-h-[180px]">
      <div className="w-[120px] flex items-center">
        <img src={`${baseUrl}/${image}`} alt="cart item" />
      </div>
      <div className="flex flex-col items-start justify-center flex-1">
        <h1 className="mb-[6px] text-xs text-[#454545] tracking-[.2em] uppercase font-normal">
          {title}
        </h1>
        {sizeName ? (
          <h2 className="mb-5 text-[11px] tracking-[.2em] uppercase font-normal text-[#9d9d9d]">
            {sizeName}
          </h2>
        ) : (
          " "
        )}

        <h2 className="mb-5 text-[11px] tracking-[.2em] uppercase font-normal text-[#9d9d9d]">
          {price} сум
        </h2>
        <div className="flex flex-row items-center justify-between w-full">
          <Flex className="border-solid border border-[#e3e3e3] w-[106px] h-[40px]">
            <button
              className="my-auto flex-1 py-2 px-[14px] text-[#9D9D9D] hover:text-black"
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            >
              <BiMinus />
            </button>
            <input
              className="text-[#9D9D9D] w-5 text-center focus:outline-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              type="number"
              min="1"
            />
            <button
              className="my-auto flex-1 py-2 px-[14px] text-[#9D9D9D] hover:text-black"
              onClick={() => setQuantity(quantity + 1)}
            >
              <BiPlus />
            </button>
          </Flex>
          <UnderlinedButton title="remove" onClick={handleRemove} />
        </div>
      </div>
    </div>
  );
};
