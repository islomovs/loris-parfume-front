/* eslint-disable @next/next/no-img-element */
import { IProduct } from "@/services/products";
import i18n from "@/utils/i18n";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingBar from "react-top-loading-bar";
import { CustomDrawer } from "./CustomDrawer";
import useCartStore from "@/services/store";
import { queryClient } from "../providers";
import { useMutation } from "react-query";
import { addToCart, ICartItem } from "@/services/cart";
import { message } from "antd";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: IProduct;
  collectionSlug?: string;
  categorySlug?: string;
}

export const ProductCard = ({
  product,
  collectionSlug,
  categorySlug,
}: ProductCardProps) => {
  const { addOrUpdateCartItem } = useCartStore((state) => state);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const loadingBarRef = useRef<any>(null);
  const { t } = useTranslation("common");
  const messages = [
    product?.isFiftyPercentSaleApplied && t("saleInfo"),
    t("productDetails.delivery_today"),
    t("productDetails.free_delivery"),
  ];
  const [currentMessage, setCurrentMessage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentMessage, messages.length]);

  const colors = ["bg-green-800", "bg-blue-500", "bg-red-500"];

  const token = localStorage.getItem("token");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const mutation = useMutation(addToCart, {
    onSuccess: (data, variables) => {
      const { slug, quantity, sizeId, price } = variables;
      const newItem: ICartItem = {
        id: product?.id,
        slug,
        quantity,
        sizeId,
        price: Number(discountPrice),
        nameEng: product?.nameEng,
        nameRu: product?.nameRu,
        nameUz: product?.nameUz,
        imagesList: product?.imagesList,
        collectionSlug: product?.collectionsItemsList[0].collectionSlug,
      };

      addOrUpdateCartItem(newItem);
      queryClient.invalidateQueries("cartItemsData").then(() => {
        showDrawer();
      });
      loadingBarRef.current.complete();
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
      message.error("Failed to add item to cart.");
      loadingBarRef.current.complete();
    },
  });

  const handleAddToCart = () => {
    const cartItem = {
      slug: product?.slug,
      quantity: 1,
      price: Number(product?.price),
      collectionSlug: product?.collectionsItemsList[0].collectionSlug,
      ...(product?.sizesItemsList.length > 0 && {
        size: product?.sizesItemsList[0],
      }),
    };

    if (!token) {
      addOrUpdateCartItem({
        id: product?.id,
        ...cartItem,
        nameEng: product?.nameEng,
        nameRu: product?.nameRu,
        nameUz: product?.nameUz,
        imagesList: product?.imagesList,
      });
      showDrawer();
      return;
    }

    loadingBarRef.current.continuousStart();
    mutation.mutate(cartItem);
  };

  const name = i18n.language == "ru" ? product?.nameRu : product?.nameUz;

  const discountPrice = product?.discountPercent
    ? (
        parseFloat(product?.price) *
        (1 - product?.discountPercent / 100)
      ).toFixed(2)
    : product?.price;

  return (
    <div className="relative flex flex-col items-start h-fit border-[1px] border-[#f0f0f0] border-solid md:w-[380px] w-full">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      {open && <CustomDrawer onClose={onClose} isOpen={open} />}

      {/* Product Image */}
      <div className="relative group w-full">
        <Link
          href={
            categorySlug
              ? `/collections/${collectionSlug}/categories/${categorySlug}/products/${product?.slug}`
              : collectionSlug
              ? `/collections/${collectionSlug}/products/${product?.slug}`
              : `/products/${product?.slug}`
          }
          className="block"
        >
          <img
            src={`${product?.imagesList[0]}` || ""}
            alt={name}
            className={`object-cover transition-all duration-500 ease-in-out z-0 h-[155px] sm:h-[360px] w-full ${
              isImageLoaded ? "blur-0" : "blur-lg"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent default navigation behavior
            e.stopPropagation(); // Stop the event from propagating to the Link
            handleAddToCart(); // Custom logic for adding to cart
          }}
          className="absolute bottom-0 left-0 right-0 bg-primary w-full transition-all ease-in-out duration-500 md:opacity-0 opacity-100 md:group-hover:opacity-100 font-semibold md:p-2 text-[9px] md:text-base h-6 sm:h-0 sm:group-hover:h-10"
        >
          <div className="uppercase flex justify-center items-center h-full text-white">
            {t("productDetails.add_to_cart")}
          </div>
        </button>
      </div>

      <div className="relative w-full overflow-hidden h-10">
        <AnimatePresence>
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className={`absolute text-center w-full text-[9px] md:text-sm font-semibold p-2 text-white ${colors[currentMessage]}`}
          >
            {messages[currentMessage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="md:px-[15px] md:py-[10px] md:mt-[10px] px-[11px] py-[6px]">
        <p className="text-xs md:text-[15px] font-normal break-words">{name}</p>

        <div className="mt-2">
          {product?.discountPercent > 0 && product?.price ? (
            <div className="flex flex-row">
              <p className="text-base md:text-[19px] font-semibold text-[#454545] line-through mr-1">
                {product?.price} {t("productDetails.sum")}
              </p>
              <p className="text-base md:text-[19px] font-semibold text-red-500">
                {discountPrice} {t("productDetails.sum")}
              </p>
            </div>
          ) : (
            <p className="text-base md:text-[19px] font-semibold text-[#454545]">
              {product?.price} {t("productDetails.sum")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
