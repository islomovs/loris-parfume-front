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
import { Spinner } from "@chakra-ui/react";
import "../utils/i18n";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import {
  fetchMainRecommendedProductsData,
  fetchRecommendedProductsData,
} from "@/services/products";
import RecommendedSlider from "./components/RecommendedSlider";

export default function Home() {
  const [collectionId, setCollectionId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [collectionBanners, setCollectionBanners] = useState<
    ICollectionBanner[]
  >([]);
  const [banners, setBanners] = useState<IBanner[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  return (
    <>
      {/* Main banners section */}
      {!isLoadingBanners ? (
        <MainCarousel bannersData={banners} />
      ) : (
        <div className="h-[751px] w-full flex justify-center items-center">
          <Spinner size="xl" color="#87754f" />
        </div>
      )}
      <div className="border-t border-solid border-[#e3e3e3] py-10 md:mb-20">
        <h1 className="uppercase font-normal text-center text-lg md:text-xl tracking-[.2em] text-[#454545] mb-10 md:mb-16">
          {t("home.weRecommend")}
        </h1>
        {isLoadingRecProducts ? (
          <div className="flex justify-center items-center py-10">
            <Spinner size="lg" color="#87754f" />
          </div>
        ) : (
          <RecommendedSlider items={recommendedProducts} />
        )}
      </div>
      {/* Collection banners section */}
      <section className="m-5">
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
                    image={`${baseUrl}/${bannerImage}`}
                    link={banner.redirectTo}
                  />
                </Col>
              );
            })
          ) : (
            <div className="flex justify-center items-center w-full h-80">
              <Spinner size="lg" color="#87754f" />
            </div>
          )}
        </Row>
      </section>
    </>
  );
}
