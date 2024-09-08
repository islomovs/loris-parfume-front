import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ProductCard } from "./ProductCard";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import Link from "next/link";

// Custom Arrow Components
const CustomNextArrow: React.FC<{
  className?: string;
  onClick?: () => void;
}> = ({ className, onClick }) => (
  <button
    className={`${className} absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white text-[#454545] rounded-full w-[45px] h-[45px] flex justify-center items-center shadow-[0_2px_10px_#36363626]`}
    onClick={onClick}
  >
    <SlArrowRight className="text-primary" />
  </button>
);

const CustomPrevArrow: React.FC<{
  className?: string;
  onClick?: () => void;
}> = ({ className, onClick }) => (
  <button
    className={`${className} absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white text-[#454545] rounded-full w-[45px] h-[45px] flex justify-center items-center shadow-[0_2px_10px_#36363626]`}
    onClick={onClick}
  >
    <SlArrowLeft className="text-primary" />
  </button>
);

type RecommendedSliderProps = {
  items: { id: number; text: string }[];
  collectionSlug?: string;
  categorySlug?: string;
};

const RecommendedSlider: React.FC<RecommendedSliderProps> = ({
  items,
  categorySlug,
  collectionSlug,
}) => {
  const shouldShowArrows = items?.length > 4;

  return (
    <div className="w-full my-12 px-20 relative">
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation={{
          nextEl: shouldShowArrows ? ".custom-next" : null,
          prevEl: shouldShowArrows ? ".custom-prev" : null,
        }}
        modules={[Navigation]}
        draggable={true}
        loop={false}
        grabCursor={true}
      >
        {items?.map((product: any) => {
          const discountPrice = product.discountPercent
            ? (
                parseFloat(product.price) *
                (1 - product.discountPercent / 100)
              ).toFixed(2)
            : null;
          return (
            <SwiperSlide key={product.id}>
              <Link
                href={
                  categorySlug
                    ? `/collections/${collectionSlug}/categories/${categorySlug}/products/${product.slug}`
                    : `/collections/${collectionSlug}/products/${product.slug}`
                }
              >
                <ProductCard
                  image={product.imagesList[0]}
                  title={product.nameRu}
                  originalPrice={product.price}
                  discountPrice={discountPrice || product.price}
                  hasDiscount={product.discountPercent > 0}
                />
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {shouldShowArrows && (
        <>
          <CustomNextArrow className="custom-next" />
          <CustomPrevArrow className="custom-prev" />
        </>
      )}
    </div>
  );
};

export default RecommendedSlider;
