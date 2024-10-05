"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules"; // To'g'ri import qiling
import IMG from "../../../../public/staticBannerImg2.webp";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import { useQuery } from "react-query";
import { getAllBlogs, IBlog } from "@/services/blogs";
import i18n from "@/utils/i18n";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const BlogCarousel = () => {
  const router = useRouter();
  const { data } = useQuery("allBlogs", getAllBlogs);

  return (
    <Box className="relative">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation={{
          nextEl: ".arrow-right",
          prevEl: ".arrow-left",
        }}
        spaceBetween={30}
        slidesPerView={4}
        loop={true}
        breakpoints={{
          1400: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 3,
          },
          900: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 2,
          },
          500: {
            slidesPerView: 1,
          },
          200: {
            slidesPerView: 1,
          },
        }}
      >
        {data?.map((blog: IBlog) => {
          let title = i18n.language === "uz" ? blog?.titleUz : blog?.titleRu;
          let description =
            i18n.language === "uz" ? blog?.descriptionUz : blog?.descriptionRu;
          return (
            <SwiperSlide key={blog.id}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div
                  className="cursor-pointer "
                  onClick={() => router.push(`/blogs/${blog.id}`)}
                >
                  <Box className="relative w-full h-[160px]">
                    <Image
                      src={blog.mainImage}
                      alt="banner-img"
                      fill
                      className="object-cover"
                    />
                  </Box>

                  <h2 className="font-semibold h-[50px] text-[18px] md:text-[20px] mt-2 cursor-pointer">
                    {title}
                  </h2>

                  <p className=" mt-4 ">
                    {description?.substring(0, 140) +
                      (description?.length > 140 ? "..." : "")}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute top-[43.3%] transform -translate-y-1/2 z-10 flex justify-between w-full">
        <button className="arrow-left arrow p-3 bg-black rounded-md">
          <FaChevronLeft color="white" />
        </button>
        <button className="arrow-right arrow p-3 bg-black rounded-md ">
          <FaChevronRight color="white" />
        </button>
      </div>
    </Box>
  );
};

export default BlogCarousel;
