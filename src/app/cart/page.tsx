"use client";
import { useState, useEffect, useCallback } from "react";
import { CartItem } from "../components/CartItem";
import { AnimatedButton } from "../components/AnimatedButton";
import useCartStore from "@/services/store";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useMutation } from "react-query";
import { addToCart } from "../../services/cart";
import { queryClient } from "../providers";

export default function CartPage() {
  const router = useRouter();
  const { cart, apiQuantity, totalSum } = useCartStore((state) => state);
  const [isClient, setIsClient] = useState(false);

  const mutation = useMutation(
    (cartItem: {
      slug: string;
      quantity: number;
      sizeId?: number;
      collectionSlug?: string;
    }) => addToCart(cartItem),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cartItemsData");
        message.success("Cart updated successfully!");
      },
      onError: () => {
        message.error("Failed to update cart.");
      },
    }
  );

  const handleCheckout = useCallback(() => {
    cart.forEach((cartItem) => {
      const key = `${cartItem.id}-${cartItem.sizeId}`;
      const apiQty = apiQuantity[key] || 0;
      let quantityDifference = cartItem.quantity - apiQty;

      if (quantityDifference !== 0) {
        mutation.mutate({
          ...(cartItem.sizeId ? { sizeId: cartItem.sizeId } : {}),
          slug: cartItem.slug,
          quantity: quantityDifference,
          collectionSlug: cartItem.collectionSlug,
        });
      }
    });

    router.push("/checkouts");
  }, [cart, apiQuantity, mutation, router]);

  // Set the client state when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedTotal = isClient ? totalSum().toFixed(2) : "0.00";

  return (
    <div className="py-20 px-40">
      <h1 className="uppercase font-normal text-center text-xl tracking-[.2em] text-[#454545] my-[50px]">
        shopping cart
      </h1>
      <div className="flex flex-row border-b border-solid border-b-[#e3e3e3] pb-[10px]">
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[12]">
          PRODUCT
        </h1>
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[4] text-center">
          NUMBER
        </h1>
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[4] text-end">
          TOTAL
        </h1>
      </div>
      {cart.length > 0 ? (
        cart.map((cartItem, index) => {
          const discountPrice = cartItem.discountPercent
            ? cartItem.price - (cartItem.price * cartItem.discountPercent) / 100
            : cartItem.price;

          return (
            <CartItem
              key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
              id={cartItem.id}
              slug={cartItem.slug}
              collectionSlug={cartItem.collectionSlug}
              title={cartItem.nameRu}
              price={discountPrice}
              sizeId={cartItem.sizeId}
              image={cartItem.imagesList[0]}
              qty={cartItem.quantity}
            />
          );
        })
      ) : (
        <div className="text-center text-[#9d9d9d] mt-10">
          Your cart is empty.
        </div>
      )}
      <div className="flex flex-row justify-end items-center border-t border-solid border-t-[#e3e3e3] pt-[25px]">
        <div className="flex flex-col items-end">
          <div className="text-xs tracking-[.2em] text-[#454545] font-normal mb-4">
            TOTAL: {formattedTotal} сум
          </div>
          <AnimatedButton
            title="checkout"
            variant="dark"
            width="w-[140px]"
            onClick={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
