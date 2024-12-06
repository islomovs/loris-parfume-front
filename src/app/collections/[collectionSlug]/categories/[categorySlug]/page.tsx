"use client";
import { useQuery, useInfiniteQuery } from "react-query";
import { useEffect, useState } from "react";
import { ProductsGrid } from "@/app/components/ProductsGrid";
import { fetchProductsData, IProduct } from "@/services/products";
import { CollectionsAndCategoriesData } from "@/services/collections";
import SortingDropdown from "@/app/components/SortingDropdown";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";
import Image from "next/image";

export default function CategoriesPage({
  params,
}: {
  params: { categorySlug: string; collectionSlug: string };
}) {
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const { categorySlug, collectionSlug } = params;
  const { t } = useTranslation("common");

  // Use useInfiniteQuery to fetch products data incrementally
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["productsByCategory", collectionSlug, categorySlug, sortOption],
    async ({ pageParam = 1 }) => {
      const res = await fetchProductsData(
        pageParam,
        collectionSlug,
        categorySlug,
        sortOption
      );
      return res.data;
    },
    {
      getNextPageParam: (lastPage) => {
        // Correctly determine the next page number
        const nextPage = lastPage.page.number + 2; // Adjust for 0-indexed pages
        return nextPage <= lastPage.page.totalPages ? nextPage : undefined;
      },
      keepPreviousData: true, // Maintain the previous data while fetching new
    }
  );

  // Combine products from all fetched pages
  const products = data?.pages.flatMap((page) => page.content) || [];
  const totalElements = data?.pages[0]?.page.totalElements || 0;

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Fetch collections and categories data
  const { data: categoriesData } = useQuery<CollectionsAndCategoriesData>(
    ["collectionsAndCategories", 1],
    async () => ({
      collections: [],
      categories: [],
    }),
    {
      enabled: false,
      staleTime: 1000 * 60 * 5,
    }
  );

  // Match the current category to display its banner
  const matchedCategory = categoriesData?.categories.find(
    (category) => category.slug === categorySlug
  );

  const bannerImage = matchedCategory?.bannerImage || "";
  const title =
    i18n.language == "ru" ? matchedCategory?.nameRu : matchedCategory?.nameUz;
  const description =
    i18n.language == "ru"
      ? matchedCategory?.descriptionRu
      : matchedCategory?.descriptionUz;

  return (
    <div>
      {bannerImage ? (
        <div
          className={`w-full aspect-auto flex justify-center items-end tracking-[.2em] transition-all duration-500 ease-in-out`}
        >
          <Image
            src={bannerImage}
            alt="Banner Image"
            className={`w-full object-contain transition-all duration-500 ease-in-out`}
            fill
            priority
          />
          <p className="text-xl text-white font-semibold mb-[30vh]">{title}</p>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="p-14 text-center">
            <h1 className="py-4 font-semibold tracking-[.2em]">{title}</h1>
            <p className="text-center text-base text-[#454545]">
              {description}
            </p>
          </div>
        </div>
      )}
      <div className="md:mx-16 mx-5">
        <div className="flex flex-row md:flex-row justify-between items-center my-8">
          <p className="text-[15px] text-[#454545] font-normal">
            {totalElements} {t("products")}
          </p>
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <hr className="border-t border-solid border-t-[#f0f0f0] mb-8" />
        {isError ? (
          <div className="text-center text-red-500">
            Error loading products.
          </div>
        ) : (
          <ProductsGrid
            products={products}
            collectionSlug={collectionSlug}
            categorySlug={categorySlug}
            isLoading={isFetchingNextPage || isLoading}
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            totalProducts={totalElements}
          />
        )}
      </div>
    </div>
  );
}
