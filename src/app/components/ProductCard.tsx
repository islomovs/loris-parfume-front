/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  title: string;
  discountPrice?: string;
  image: string;
  hasDiscount: boolean;
  originalPrice?: string;
}

export const ProductCard = ({
  title,
  discountPrice,
  image,
  hasDiscount,
  originalPrice,
}: ProductCardProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { t } = useTranslation("common");

  return (
    <div className="relative flex flex-col items-start h-fit border-[1px] border-[#f0f0f0] border-solid md:w-[380px] w-full">
      {hasDiscount && (
        <div className="absolute top-1 right-1 px-2 py-1 tracking-[.1em] text-white text-xs font-semibold z-10 bg-black">
          {t("productDetails.sale")}
        </div>
      )}

      {/* Product Image with Blur-Up Effect */}
      <img
        src={`${baseUrl}/${image}` || ""}
        alt={title}
        className={`object-cover transition-all duration-500 ease-in-out z-0 h-[155px] sm:h-[360px] w-full ${
          isImageLoaded ? "blur-0" : "blur-lg" // Apply blur while loading
        }`}
        onLoad={() => setIsImageLoaded(true)} // Remove blur when loaded
      />
      <div className="text-center uppercase bg-primary w-full font-semibold p-2 md:p-4 text-[9px] md:text-base text-white mb-[10px]">
        {t("saleInfo")}
      </div>
      <div className="px-[15px] py-[10px]">
        {/* Product Title */}
        <p className="text-xs md:text-[15px] font-normal break-words">
          {title}
        </p>

        {/* Pricing */}
        <div className="mt-2">
          {hasDiscount && originalPrice ? (
            <div className="flex flex-row">
              <p className="text-base md:text-[19px] font-semibold text-[#454545] line-through mr-1">
                {originalPrice} {t("productDetails.sum")}
              </p>
              <p className="text-base md:text-[19px] font-semibold text-red-500">
                {/* Red color for discounted price */}
                {discountPrice} {t("productDetails.sum")}
              </p>
            </div>
          ) : (
            <p className="text-base md:text-[19px] font-semibold text-[#454545]">
              {originalPrice} {t("productDetails.sum")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
