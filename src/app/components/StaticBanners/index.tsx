import Image from "next/image";
import React from "react";
import banner1 from "../../../../public/staticBannerImg1.webp";
import banner2 from "../../../../public/staticBannerImg2.png";
import banner3 from "../../../../public/staticBannerImg3.png";
import banner4 from "../../../../public/staticBannerImg4.webp";
import Link from "next/link";

const StaticBanners = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
        <div className="grid md:gap-8 gap-4">
          <div className="grid md:grid-cols-1 grid-cols-2 md:gap-8 gap-4 h-full">
            <div className="relative overflow-hidden h-full w-full">
              <Link href={"https://lorisparfume.uz/collections/creation/products/creation-angel-wings"}>
                <Image
                  src={banner1}
                  alt="banner_image1"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>
            </div>
            <div className="block md:hidden relative overflow-hidden h-full w-full">
              <Link href={"https://lorisparfume.uz/products/r-001"}>
                <Image
                  src={banner4}
                  alt="banner_image4"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:gap-8 gap-4 h-full">
            <div className="relative overflow-hidden h-full w-full">
              <Link href={"https://lorisparfume.uz/products/r-231"}>
                <Image
                  src={banner2}
                  alt="banner_image2"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>
            </div>
            <div className="relative overflow-hidden h-full w-full">
              <Link href={"https://lorisparfume.uz/collections/elegant/products/elegant-elegant"}>
                <Image
                  src={banner3}
                  alt="banner_image3"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block relative overflow-hidden h-full w-full">
          <Link href={"https://lorisparfume.uz/collections/niche"}>
            <Image
              src={banner4}
              alt="banner_image4"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaticBanners;
