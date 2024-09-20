import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ProductCard } from "./ProductCard";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import Link from "next/link";
import i18n from "@/utils/i18n";
import { IProduct } from "@/services/products";

// Custom Arrow Components
const CustomNextArrow: React.FC<{
  className?: string;
  onClick?: () => void;
}> = ({ className, onClick }) => (
  <button
    className={`${className} absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white text-[#454545] rounded-full w-[35px] h-[35px] md:w-[45px] md:h-[45px] flex justify-center items-center shadow-[0_2px_10px_#36363626]`}
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
    className={`${className} absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white text-[#454545] rounded-full w-[35px] h-[35px] md:w-[45px] md:h-[45px] flex justify-center items-center shadow-[0_2px_10px_#36363626]`}
    onClick={onClick}
  >
    <SlArrowLeft className="text-primary" />
  </button>
);

type RecommendedSliderProps = {
  items: {
    id: number;
    text: string;
    slug: string;
    price: string;
    imagesList: string[];
    discountPercent: number;
    nameRu: string;
    nameUz: string;
  }[];
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
    <div className="w-full my-12 px-5 md:px-10 lg:px-20 relative">
      <Swiper
        spaceBetween={10}
        breakpoints={{
          // Configure slides per view for different screen sizes
          320: {
            slidesPerView: 2, // Slightly more than 1 to show part of the next slide
          },
          480: {
            slidesPerView: 2,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2.5,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        navigation={{
          nextEl: shouldShowArrows ? ".custom-next" : null,
          prevEl: shouldShowArrows ? ".custom-prev" : null,
        }}
        modules={[Navigation]}
        loop={false}
        grabCursor={true}
      >
        {items?.map((product: any) => {
          return (
            <SwiperSlide key={product.id}>
              <Link
                href={
                  categorySlug
                    ? `/collections/${collectionSlug}/categories/${categorySlug}/products/${product.slug}`
                    : collectionSlug
                    ? `/collections/${collectionSlug}/products/${product.slug}`
                    : `/products/${product.slug}`
                }
                className="w-fit"
              >
                <ProductCard product={product} />
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
