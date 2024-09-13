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

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const page = 1;
  const [collectionBanners, setCollectionBanners] =
    useState<ICollectionBanner[]>();
  const [banners, setBanners] = useState<IBanner[]>();

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
            collectionBanners?.map((banner: ICollectionBanner) => (
              <Col
                xs={24} // 1 column on extra small screens
                sm={12} // 2 columns on small screens
                md={8} // 3 columns on medium screens and above
                key={banner.id}
              >
                <CollectionCard
                  title={banner.titleUz}
                  image={`${baseUrl}/${banner.imageNameUz}`}
                  link={banner.redirectTo}
                />
              </Col>
            ))
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
