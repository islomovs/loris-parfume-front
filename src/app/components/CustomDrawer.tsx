import { useState, useCallback, useEffect } from "react";
import { AnimatedButton } from "./AnimatedButton";
import { DrawerCartItem } from "./DrawerCartItem";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Button, message } from "antd";
import useCartStore from "../../services/store";
import { useMutation } from "react-query";
import { addToCart } from "../../services/cart";
import { queryClient } from "../providers";
import { useRouter } from "next/navigation";

interface ICustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDrawer: React.FC<ICustomDrawerProps> = ({
  onClose,
  isOpen,
}) => {
  const { cart, apiQuantity, totalSum } = useCartStore((state) => state);
  const router = useRouter();

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

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

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

    handleClose();
    router.push("/checkouts");
  }, [cart, apiQuantity, mutation, handleClose, router]);

  const totalPrice = totalSum();
  const formattedTotal =
    typeof totalPrice === "number" ? totalPrice.toFixed(2) : "0.00";

  return (
    <Drawer
      title={
        <div className="flex flex-row items-center justify-between">
          <div className="text-base uppercase font-normal tracking-[.2em]">
            Shopping Cart
          </div>
          <Button
            type="text"
            className="hover:bg-white"
            icon={<CloseOutlined className="text-black" />}
            onClick={handleClose}
          />
        </div>
      }
      footer={
        <footer>
          <div className="flex flex-col items-start">
            <div className="mt-1 mb-2 text-[#9d9d9d]">
              Shipping & taxes calculated at checkout
            </div>
            <div className="w-full">
              <AnimatedButton
                width="w-full"
                title={`Checkout - ${formattedTotal}`}
                variant="dark"
                onClick={handleCheckout}
              />
            </div>
          </div>
        </footer>
      }
      placement="right"
      onClose={handleClose}
      open={isOpen}
      closable={false}
    >
      <div>
        {cart.length > 0 ? (
          cart.map((cartItem, index) => {
            const discountPrice = cartItem.discountPercent
              ? cartItem.price -
                (cartItem.price * cartItem.discountPercent) / 100
              : cartItem.price;

            return (
              <DrawerCartItem
                key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
                id={cartItem.id}
                slug={cartItem.slug}
                price={discountPrice}
                qty={cartItem.quantity}
                title={cartItem.nameRu}
                sizeId={cartItem.sizeId}
                image={cartItem.imagesList[0]}
                sizeName={cartItem.sizeNameRu}
              />
            );
          })
        ) : (
          <div className="text-center text-[#9d9d9d] mt-10">
            Your cart is empty.
          </div>
        )}
      </div>
    </Drawer>
  );
};
