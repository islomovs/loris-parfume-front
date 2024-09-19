"use client";

import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import {
  fetchCollectionBannersData,
  fetchMainBannersData,
  IBanner,
  ICollectionBanner,
} from "../services/collectionBanners";
import { CollectionCard } from "./components/CollectionCard";
import { MainCarousel } from "./components/MainCarousel";
import { useQueries, useQuery } from "react-query";
import { Spinner } from "@chakra-ui/react";
import "../utils/i18n";
import { useTranslation } from "react-i18next";
import i18n from "../utils/i18n";
import { fetchMainRecommendedProductsData } from "@/services/products";
import RecommendedSlider from "./components/RecommendedSlider";
import { useCollectionStore } from "@/services/useCollectionStore";

export default function Home() {
  const [collectionBanners, setCollectionBanners] = useState<
    ICollectionBanner[]
  >([]); // Collection banners
  const [banners, setBanners] = useState<IBanner[]>([]); // Other banners

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const page = 1;
  const { t } = useTranslation("common");

  const [collectionIds, setCollectionIds] = useState<number[]>([]); // Multiple collection IDs
  const [queries, setQueries] = useState<any[]>([]); // To handle multiple queries

  const { collections } = useCollectionStore(); // Access collections from Zustand store

  useEffect(() => {
    if (collections.length > 0) {
      // Get all collections where isRecommendedInMainPage is true
      const recommendedCollections = collections.filter(
        (collection) => collection.isRecommendedInMainPage === true
      );

      const collectionCategoryPairs: {
        collectionId: number;
        categoryId: number | null;
      }[] = [];

      recommendedCollections.forEach((collection) => {
        // Add the collection and its recommended categories (if any)
        const recommendedCategories = collection.categoriesList.filter(
          (category) => category.categoryIsRecommendedInMainPage === true
        );

        if (recommendedCategories.length > 0) {
          recommendedCategories.forEach((category) => {
            collectionCategoryPairs.push({
              collectionId: collection.id,
              categoryId: category.categoryId,
            });
          });
        } else {
          // If no recommended categories, push just the collectionId
          collectionCategoryPairs.push({
            collectionId: collection.id,
            categoryId: null,
          });
        }
      });

      setCollectionIds(recommendedCollections.map((c) => c.id));

      // Set up queries for each collection-category pair
      const queryList = collectionCategoryPairs.map((pair) => ({
        queryKey: [
          "recommendedProductsData",
          pair.collectionId,
          pair.categoryId,
        ],
        queryFn: () =>
          fetchMainRecommendedProductsData(pair.collectionId, pair.categoryId),
      }));

      setQueries(queryList);
    }
  }, [collections]);

  // Fetch recommended products data for each collection-category pair
  const recommendedQueries = useQueries(queries);

  const { isLoading: isLoadingBanners } = useQuery("bannersData", async () => {
    const response = await fetchMainBannersData(page);
    setBanners(response);
  });

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
      <div className="border-t border-solid border-[#e3e3e3] py-10 md:my-20">
        <h1 className="uppercase font-normal text-center text-lg md:text-xl tracking-[.2em] text-[#454545] mb-10 md:mb-16">
          {t("productDetails.youMayAlsoLike")}
        </h1>
        {recommendedQueries.map((query: any, index) => {
          if (query.isLoading) {
            return (
              <div
                key={index}
                className="flex justify-center items-center py-10"
              >
                <Spinner size="lg" color="#87754f" />
              </div>
            );
          }
          if (query.isError) {
            return (
              <p key={index}>
                Error fetching data for collection {queries[index].queryKey[1]}
              </p>
            );
          }
          const recommendedProducts = query.data?.data?.recommendedItems;
          // Extract collectionName from the first item in the recommendedProducts
          const collectionName =
            i18n.language == "ru"
              ? recommendedProducts?.[0]?.collectionsItemsList?.[0]
                  ?.collectionNameRu
              : recommendedProducts?.[0]?.collectionsItemsList?.[0]
                  ?.collectionNameUz;

          return (
            <div key={index}>
              <h3 className="font-normal text-center text-lg md:text-base tracking-[.2em] text-[#454545] mb-2 md:mb-2">
                Рекомендации {collectionName}
              </h3>{" "}
              {/* Display collection name */}
              {recommendedProducts && recommendedProducts.length > 0 ? (
                <RecommendedSlider items={recommendedProducts} />
              ) : (
                <p>No recommended products</p>
              )}
            </div>
          );
        })}
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
