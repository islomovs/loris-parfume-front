"use client";

import React, { useState } from "react";
import { Col, Row } from "antd";
import {
  fetchCollectionBannersData,
  fetchMainBannersData,
  IBanner,
  ICollectionBanner,
} from "../services/collectionBanners";
import { CollectionCard } from "./components/CollectionCard";
import { MainCarousel } from "./components/MainCarousel";
import { useQuery } from "react-query";
import { Center, Spinner } from "@chakra-ui/react";
import "../utils/i18n";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import {
  fetchMainRecommendedProductsData,
  fetchRecommendedProductsData,
} from "@/services/products";
import RecommendedSlider from "./components/RecommendedSlider";
import Script from "next/script";
import StaticBanners from "./components/StaticBanners";
import BlogsCarousel from "./components/Blogs";
import blogsTitle from "../../public/blogs.webp";
import Image from "next/image";

export default function Home() {
  const [collectionBanners, setCollectionBanners] = useState<
    ICollectionBanner[]
  >([]);
  const [banners, setBanners] = useState<IBanner[]>([]);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const page = 1;
  const { t } = useTranslation("common");

  // Fetch main banners data
  const { isLoading: isLoadingBanners } = useQuery("bannersData", async () => {
    const response = await fetchMainBannersData(page);
    setBanners(response);
  });

  // Fetch collection banners data
  const { isLoading: isLoadingCBanners } = useQuery(
    "collectionBannersData",
    async () => {
      const response = await fetchCollectionBannersData(page);
      setCollectionBanners(response.content);
    }
  );

  const { data: recommendedProductsData, isLoading: isLoadingRecProducts } =
    useQuery(["recommendedProductsData"], () =>
      fetchMainRecommendedProductsData()
    );

  const recommendedProducts = recommendedProductsData?.data.recommendedItems;

  const JsonId = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: "https://lorisparfume.uz",
    logo: "https://lorisparfume.uz/logo600.jpg",
    name: "LORIS Perfume",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+998 93 911 99 44",
        areaServed: "UZ",
        availableLanguage: ["Uzbek", "Russian"],
        email: "uzbekistan@lorisparfum.com",
      },
    ],
    sameAs: [
      "https://t.me/Loris_perfume",
      "https://www.instagram.com/lorisparfum_uz",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressRegion: "Tashkent Region",
      addressCountry: "UZ",
    },
  };

  const jsonID = JSON.stringify(JsonId);

  return (
    <>
      {/* Main banners section */}
      {!isLoadingBanners ? (
        <MainCarousel bannersData={banners} />
      ) : (
        <div className="h-[751px] w-full flex justify-center items-center">
          <Spinner size="xl" color="#000000" />
        </div>
      )}
      <div className="border-t border-solid border-[#e3e3e3] py-10 md:mb-20">
        <h1 className="uppercase font-normal text-center text-lg md:text-xl tracking-[.2em] text-[#454545] mb-10 md:mb-16">
          {t("home.weRecommend")}
        </h1>
        {isLoadingRecProducts ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="lg" color="#000000" />
          </div>
        ) : (
          <RecommendedSlider items={recommendedProducts} />
        )}
      </div>
      {/* Collection banners section */}
      <section className="m-5 py-10 md:mb-20">
        <Row gutter={[30, 30]} className="justify-center">
          {!isLoadingCBanners ? (
            collectionBanners?.map((banner: ICollectionBanner) => {
              const bannerTitle =
                i18n.language == "ru" ? banner.titleRu : banner.titleUz;
              const bannerImage =
                i18n.language == "ru" ? banner.imageNameRu : banner.imageNameUz;
              return (
                <Col
                  xs={24} // 1 column on extra small screens
                  sm={12} // 2 columns on small screens
                  md={8} // 3 columns on medium screens and above
                  key={banner.id}
                >
                  <CollectionCard
                    title={bannerTitle}
                    image={`${bannerImage}`}
                    link={banner.redirectTo}
                  />
                </Col>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full h-80">
              <Spinner size="lg" color="#000000" />
            </div>
          )}
        </Row>
      </section>
      <section className="m-5 py-10 md:mb-20">
        <StaticBanners />
      </section>
      <Center className="text-center">
        <Image src={blogsTitle} alt="title" />
      </Center>
      <section className="m-5 py-10 md:mb-20">
        <BlogsCarousel />
      </section>
      <section className="max-w-[1000px] mx-auto m-5 p-5 md:p-5 py-10 md:mb-20">
        <h2 className="text-center mb-5 text-[25px] font-bold">
          {t("about.main_txt_title")}
        </h2>
        <div className="border-t my-6 pt-6 border-t-[#e3e3e3] border-solid">
          <div
            className={`text-[16px] text-[#454545] leading-8 font-normal ${
              isExpanded ? "line-clamp-none" : "line-clamp-6"
            }`}
            dangerouslySetInnerHTML={{
              __html: t("about.main_text"),
            }}
          />
          <button
            onClick={toggleExpanded}
            className="mt-2 text-[#454545] text-sm font-medium hover:underline"
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        </div>
      </section>
      <Script
        id="json-id"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonID }}
      />
    </>
  );
}
