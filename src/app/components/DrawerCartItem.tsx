/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Flex } from "antd";
import { UnderlinedButton } from "./UnderlinedButton";
import { removeFromCart, getCartItems } from "../../services/cart";
import { BiMinus, BiPlus } from "react-icons/bi";
import useCartStore from "@/services/store";
import { ICartItem } from "@/services/cart"; // Adjust the import path if needed
import { message } from "antd"; // Import message from Ant Design
import { useTranslation } from "react-i18next";

interface IDrawerCartItemProps {
  id: number;
  slug: string;
  title: string | undefined;
  price: number;
  qty?: number; // Make qty optional
  image: string;
  sizeName?: string;
  sizeId?: number;
  isSimplified?: boolean; // Prop to control simplified view
  onClick?: () => void;
}

export const DrawerCartItem: React.FC<IDrawerCartItemProps> = ({
  id,
  slug,
  title,
  price,
  qty = 1, // Default qty to 1 if not provided
  image,
  sizeName,
  sizeId,
  isSimplified = false, // Default to false if not provided
  onClick,
}) => {
  const [quantity, setQuantity] = useState(qty); // Use optional qty with default
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { setCartItems, updateCartItemQuantity, removeCartItem, cart } =
    useCartStore((state) => state);

  useEffect(() => {
    updateCartItemQuantity(id, quantity, sizeId);
  }, [quantity, id, sizeId, updateCartItemQuantity]);
  const { t } = useTranslation("common");

  const handleRemove = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in, proceed with API call
      if (sizeId !== null) {
        await removeFromCart(slug, sizeId);
      } else {
        await removeFromCart(slug);
      }
      const updatedCart = await getCartItems();
      setCartItems(updatedCart?.data);
      message.success("Item removed from cart.");
    } else {
      // User is not logged in, remove from local storage only
      removeCartItem(id, sizeId);
      // Directly filter and update the cart state
      const updatedCart = cart.filter(
        (item) => !(item.id === id && item.sizeId === sizeId)
      );
      setCartItems(updatedCart);
      message.info("Item removed from cart.");
    }
  };

  if (isSimplified) {
    // Render only image, title, and price in simplified mode
    return (
      <div className="flex flex-row gap-5 min-h-[180px]" onClick={onClick}>
        <div className="w-24 md:w-[120px] flex items-center">
          <img src={`${image}`} alt="cart item" />
        </div>
        <div className="flex flex-col items-start justify-center flex-1">
          <h1 className="mb-1 md:mb-[6px] text-xs text-[#454545] tracking-[.2em] uppercase font-normal">
            {title}
          </h1>
          <h2 className="text-[11px] tracking-[.2em] uppercase font-normal text-[#9d9d9d]">
            {price} {t("productDetails.sum")}
          </h2>
        </div>
      </div>
    );
  }

  // Render full details in detailed mode
  return (
    <div className="flex flex-row gap-5 min-h-[180px]">
      <div className="w-24 md:w-[120px] flex items-center">
        <img src={`${image}`} alt="cart item" />
      </div>
      <div className="flex flex-col items-start justify-center flex-1">
        <h1 className="mb-1 md:mb-[6px] text-xs text-[#454545] tracking-[.2em] uppercase font-normal">
          {title}
        </h1>
        {sizeName && (
          <h2 className="mb-1 md:mb-5 text-[11px] tracking-[.2em] uppercase font-normal text-[#9d9d9d]">
            {sizeName}
          </h2>
        )}
        <h2 className="mb-4 text-[11px] tracking-[.2em] uppercase font-normal text-[#9d9d9d]">
          {price} {t("productDetails.sum")}
        </h2>
        <div className="flex flex-row items-center justify-between w-full">
          <Flex className="border-solid border border-[#e3e3e3] w-fit md:w-[106px] h-[40px]">
            <button
              className="my-auto flex-1 py-2 px-2 md:px-[14px] text-[#9D9D9D] hover:text-black"
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
              className="my-auto flex-1 py-2 px-2 md:px-[14px] text-[#9D9D9D] hover:text-black"
              onClick={() => setQuantity(quantity + 1)}
            >
              <BiPlus />
            </button>
          </Flex>
          <UnderlinedButton
            title={t("cartDetails.remove")}
            onClick={handleRemove}
          />
        </div>
      </div>
    </div>
  );
};
