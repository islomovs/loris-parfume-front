import React, { useState, useEffect } from "react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import i18n from "@/utils/i18n";

interface IBanner {
  desktopImageNameRu: string;
  desktopImageNameUz: string;
  mobileImageNameRu: string;
  mobileImageNameUz: string;
}

interface IMainCarouselProps {
  bannersData?: IBanner[];
}

export const MainCarousel: React.FC<IMainCarouselProps> = ({ bannersData }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className}">` + "</span>";
    },
  };

  if (!bannersData || bannersData.length === 0) {
    return <div>No banners available</div>;
  }

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
      className="w-full h-auto md:h-[600px] lg:h-[751px]"
    >
      {bannersData.map((banner, index) => {
        const desktopImageName =
          i18n.language === "ru"
            ? banner.desktopImageNameRu
            : banner.desktopImageNameUz;
        const mobileImageName =
          i18n.language === "ru"
            ? banner.mobileImageNameRu
            : banner.mobileImageNameUz;

        return (
          <SwiperSlide key={index}>
            <div
              className={`relative w-full ${
                isMobile ? "aspect-[4/3]" : "aspect-[16/9]"
              }`}
            >
              <Image
                src={isMobile ? mobileImageName : desktopImageName}
                alt={`Carousel image ${index}`}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                fill
                priority
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
