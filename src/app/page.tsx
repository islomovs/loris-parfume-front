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
import Head from "next/head";

export default function Home() {

  <Head>
        <title>Loris Parfume</title>
        <meta name="description" content="Лучшие Парфюмы От Loris Parfume" />
        <meta property="og:title" content="Loris Parfume" />
        <meta property="og:description" content="Лучшие Парфюмы От Loris Parfume" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://lorisparfume.uz" />
        <meta property="og:type" content="website" />
  </Head>

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const page = 1;
  const [collectionBanners, setCollectionBanners] =
    useState<ICollectionBanner[]>();
  const [banners, setBanners] = useState<IBanner[]>();
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
