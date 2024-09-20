/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { IBanner } from "@/services/collectionBanners";
import Image from "next/image";
import i18n from "@/utils/i18n";

interface IMainCarouselProps {
  bannersData?: IBanner[];
}

export const MainCarousel: React.FC<IMainCarouselProps> = ({ bannersData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]); // State to track image load status
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to check if the screen is mobile size
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    // Set initial value
    handleResize();

    // Add event listener to handle resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Initialize loadedImages array with false values
    setLoadedImages(new Array(bannersData?.length || 0).fill(false));
  }, [bannersData]);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const newLoadedImages = [...prev];
      newLoadedImages[index] = true;
      return newLoadedImages;
    });
  };

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className}">` + "</span>";
    },
  };

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
      className="w-full h-screen sm:h-[500px] md:h-[600px] lg:h-[751px]"
    >
      {bannersData?.map((banner, index) => {
        const desktopImageName =
          i18n.language == "ru"
            ? banner.desktopImageNameRu
            : banner.desktopImageNameUz;
        const mobileImageName =
          i18n.language == "ru"
            ? banner.mobileImageNameRu
            : banner.mobileImageNameUz;
        return (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={`${
                  isMobile ? mobileImageName : desktopImageName
                }`}
                alt="carousel image"
                className={`w-full h-full object-cover transition-all duration-500 ease-in-out`}
                onLoad={() => handleImageLoad(index)}
                fill
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
