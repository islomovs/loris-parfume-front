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
import { DrawerCartItem } from "../components/DrawerCartItem";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const router = useRouter();
  const { cart, apiQuantity, totalSum } = useCartStore((state) => state);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation("common");

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
        message.success(t("cart.cartUpdatedSuccess"));
      },
      onError: () => {
        message.error(t("cart.cartUpdatedError"));
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedTotal = isClient ? totalSum().toFixed(2) : "0.00";

  return (
    <div className="py-10 md:py-5 px-4 md:px-40">
      <h1 className="uppercase font-normal text-center text-lg md:text-xl tracking-[.2em] text-[#454545] my-[30px] md:my-[50px]">
        {t("cart.shoppingCart")}
      </h1>
      <div className="hidden md:flex md:flex-row border-b border-solid border-b-[#e3e3e3] pb-[10px]">
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[12]">
          {t("cart.product")}
        </h1>
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[4] text-center">
          {t("cart.number")}
        </h1>
        <h1 className="text-[#9D9D9D] text-[11px] font-light flex-[4] text-end">
          {t("cart.total")}
        </h1>
      </div>
      {cart.length > 0 ? (
        cart.map((cartItem, index) => {
          const discountPrice = cartItem.discountPercent
            ? cartItem.price - (cartItem.price * cartItem.discountPercent) / 100
            : cartItem.price;
          const name =
            i18n.language == "ru" ? cartItem.nameRu : cartItem.nameUz;
          return (
            <div
              key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
            >
              {/* Desktop: Show CartItem */}
              <div className="hidden md:block">
                <CartItem
                  id={cartItem.id}
                  slug={cartItem.slug}
                  collectionSlug={cartItem.collectionSlug}
                  title={name}
                  price={discountPrice}
                  sizeId={cartItem.sizeId}
                  image={cartItem.imagesList[0]}
                  qty={cartItem.quantity}
                />
              </div>

              {/* Mobile: Show DrawerCartItem */}
              <div className="block md:hidden">
                <DrawerCartItem
                  id={cartItem.id}
                  slug={cartItem.slug}
                  price={discountPrice}
                  qty={cartItem.quantity}
                  title={name}
                  sizeId={cartItem.sizeId}
                  image={cartItem.imagesList[0]}
                  sizeName={cartItem.sizeNameRu}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-[#9d9d9d] mt-10">
          {t("cart.cartEmpty")}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-end items-center border-t border-solid border-t-[#e3e3e3] pt-[25px]">
        <div className="flex flex-col items-end w-full">
          <div className="text-xs tracking-[.2em] text-[#454545] font-normal mb-4">
            {t("cart.total")}: {formattedTotal} {t("productDetails.sum")}
          </div>
          <AnimatedButton
            title={t("checkout.makePayment")}
            variant="dark"
            width="w-full md:w-[140px]"
            onClick={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
