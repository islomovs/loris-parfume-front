import Link from "next/link";
import { useState, useEffect } from "react";
import { Image } from "antd";
import { UnderlinedButton } from "../components/UnderlinedButton";
import useCartStore from "@/services/store";
import { BiMinus, BiPlus } from "react-icons/bi";
import { removeFromCart, getCartItems } from "../../services/cart";
import { ICartItem } from "@/services/cart"; // Import your ICartItem type if needed
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/priceUtils";

interface ICartItemProps {
  id: number;
  slug: string;
  title?: string;
  price: number;
  image: string;
  qty: number;
  sizeId?: number;
  collectionSlug?: string;
  discountedTotal: number;
}

export const CartItem: React.FC<ICartItemProps> = ({
  id,
  slug,
  title,
  price,
  image,
  qty,
  sizeId,
  discountedTotal,
}) => {
  const [quantity, setQuantity] = useState(qty);
  const { setCartItems, updateCartItemQuantity, removeCartItem, cart } =
    useCartStore((state) => state);
  const { t } = useTranslation("common");

  useEffect(() => {
    updateCartItemQuantity(id, quantity, sizeId);
  }, [quantity, id, sizeId, updateCartItemQuantity]);

  const handleRemove = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      // User is logged in, proceed with API call
      try {
        if (sizeId !== null) {
          await removeFromCart(slug, sizeId);
        } else {
          await removeFromCart(slug);
        }
        const updatedCart = await getCartItems();
        setCartItems(updatedCart?.data);
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    } else {
      // User is not logged in, remove from local storage only
      removeCartItem(id, sizeId);
      const updatedCart = cart.filter(
        (item) => !(item.id === id && item.sizeId === sizeId)
      );
      setCartItems(updatedCart);
      console.info(t("cart.removedItem"));
    }
  };

  const originalTotal = price * quantity;
  const isDiscountApplied = originalTotal !== discountedTotal;

  return (
    <div className="my-[30px]">
      <div className="flex flex-row">
        <div className="flex flex-row flex-[12]">
          <Image
            src={`${image}`}
            alt="cart item"
            preview={false}
            className="object-cover max-w-[120px] max-h-[120px]"
          />
          <div className="flex flex-col items-start justify-center pl-[25px] flex-1">
            <Link href="/">
              <h2 className="text-xs text-[#454545] tracking-[.2em] uppercase font-normal">
                {title}
              </h2>
            </Link>
            <div className="mb-5 my-3 text-[11px] tracking-[.2em] uppercase text-[#9d9d9d]">
              {formatPrice(price)}
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-[4] justify-center items-center w-full">
          <div className="flex flex-row border-solid border border-[#e3e3e3] w-[106px] h-[40px]">
            <button
              className="my-auto flex-1 py-2 px-[14px] text-[#9D9D9D] hover:text-black"
              onClick={() => setQuantity(Math.max(quantity - 1, 1))}
            >
              <BiMinus />
            </button>
            <input
              className="text-[#9D9D9D] w-5 text-center focus:outline-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(parseInt(e.target.value, 10), 1))
              }
              type="number"
              min="1"
            />
            <button
              className="my-auto flex-1 py-2 px-[14px] text-[#9D9D9D] hover:text-black"
              onClick={() => setQuantity(quantity + 1)}
            >
              <BiPlus />
            </button>
          </div>
          <div className="flex justify-center">
            <UnderlinedButton
              title={t("cartDetails.remove")}
              onClick={handleRemove}
            />
          </div>
        </div>
        <div className="flex flex-col items-end justify-center flex-[4] text-end text-[11px] tracking-[.2em] uppercase text-[#9d9d9d]">
          {isDiscountApplied ? (
            <>
              <span className="line-through text-[#9d9d9d]">
                {formatPrice(originalTotal)} {t("productDetails.sum")}
              </span>
              <span className="text-red-500 font-bold">
                {formatPrice(discountedTotal)} {t("productDetails.sum")}
              </span>
            </>
          ) : (
            <span>
              {formatPrice(discountedTotal)} {t("productDetails.sum")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
