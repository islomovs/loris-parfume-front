import React from "react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { IBanner } from "@/services/collectionBanners";

interface IMainCarouselProps {
  bannersData?: IBanner[];
}

export const MainCarousel: React.FC<IMainCarouselProps> = ({ bannersData }) => {
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className}">` + "</span>";
    },
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      effect="fade"
      speed={600}
      fadeEffect={{ crossFade: true }}
      pagination={pagination}
      className="w-full h-[300px] sm:h-[500px] md:h-[600px] lg:h-[751px]" // Responsive height adjustments
    >
      {bannersData?.map((banner, index) => (
        <SwiperSlide key={index}>
          <img
            src={`${baseUrl}/${banner.imageNameUz}`}
            alt="carousel image"
            className="w-full h-full object-cover block"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
