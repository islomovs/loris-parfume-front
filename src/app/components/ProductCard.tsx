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
import { IoCartOutline } from "react-icons/io5";
import { formatPrice } from "@/utils/priceUtils";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

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
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    ...(product?.isFiftyPercentSaleApplied ? [t("saleInfo")] : []),
    t("productDetails.delivery_today"),
    // t("productDetails.free_delivery"),
  ];

  const colors = [
    ...(product?.isFiftyPercentSaleApplied ? ["bg-green-800"] : []),
    "bg-blue-500",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentMessage, messages.length]);

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
        sizeId: product.sizesItemsList[0]?.sizeId || 0,
        price: Number(discountPrice),
        nameEng: product?.nameEng,
        nameRu: product?.nameRu,
        nameUz: product?.nameUz,
        imagesList: product?.imagesList,
        collectionId: product?.collectionsItemsList[0]?.collectionId,
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
      // loadingBarRef.current.complete();
    },
  });

  const handleAddToCart = () => {
    const cartItem = {
      slug: product?.slug,
      quantity: 1,
      price: Number(product?.price),
      collectionId: product?.collectionsItemsList[0]?.collectionId,
      collectionSlug: product?.collectionsItemsList[0].collectionSlug,
      ...(product?.sizesItemsList[0]?.sizeId != 1 &&
        product?.sizesItemsList.length != 0 && {
          sizeId: product?.sizesItemsList[0].sizeId,
        }),
    };

    sendGAEvent("event", "buttonClicked", {
      ecommerce: {
        items: [
          {
            ...cartItem,
            item_name: product?.nameRu,
            item_id: product.id,
            price: product.price,
          },
        ],
      },
    });
    sendGTMEvent({
      event: "add_to_cart",
      ecommerce: {
        items: [
          {
            ...cartItem,
            item_name: product?.nameRu,
            item_id: product.id,
            price: product.price,
          },
        ],
      },
    });

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
    mutation.mutate(cartItem);
  };

  const name = i18n.language == "ru" ? product?.nameRu : product?.nameUz;

  const discountPrice = product?.discountPercent
    ? formatPrice(
        parseFloat(product?.price) * (1 - product?.discountPercent / 100)
      )
    : formatPrice(product?.price);

  return (
    <div className="relative flex flex-col items-start h-fit  md:w-[380px] w-full">
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

      <div className="flex flex-col justify-between w-full md:px-[15px] md:py-[10px] md:mt-[10px] px-[11px] py-[6px]">
        <h2 className="text-xs md:text-[15px] font-normal break-words h-10">
          {name}
        </h2>
        <div className="flex flex-row justify-between items-end w-full">
          <div className="mt-2">
            {product?.discountPercent > 0 && product?.price ? (
              <div className="flex flex-row">
                <p className="text-base md:text-[19px] font-semibold text-[#454545] line-through mr-1">
                  {formatPrice(product?.price)} {t("productDetails.sum")}
                </p>
                <p className="text-base md:text-[19px] font-semibold text-red-500">
                  {discountPrice} {t("productDetails.sum")}
                </p>
              </div>
            ) : (
              <p className="text-base md:text-[19px] font-semibold text-[#454545]">
                {formatPrice(product?.price)} {t("productDetails.sum")}
              </p>
            )}
          </div>
          <button onClick={handleAddToCart}>
            <IoCartOutline className="text-[22px] md:text-[30px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
