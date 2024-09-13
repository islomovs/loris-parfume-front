"use client";
import { useQuery, useInfiniteQuery } from "react-query";
import { useState } from "react";
import { ProductsGrid } from "@/app/components/ProductsGrid";
import { fetchProductsData, IProduct } from "@/services/products";
import { CollectionsAndCategoriesData } from "@/services/collections";
import SortingDropdown from "@/app/components/SortingDropdown";

export default function CollectionsPage({
  params,
}: {
  params: { collectionSlug: string };
}) {
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { collectionSlug: slug } = params;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["productsByCollection", slug, sortOption],
    async ({ pageParam = 1 }) => {
      const res = await fetchProductsData(
        pageParam,
        slug,
        undefined,
        sortOption
      );
      return res.data; // Return the entire response including pages info
    },
    {
      getNextPageParam: (lastPage) => {
        // Ensure correct calculation of the next page number
        const nextPage = lastPage.page.number + 2; // API might return 0-based index
        return nextPage <= lastPage.page.totalPages ? nextPage : undefined;
      },
      keepPreviousData: true, // Ensures previous data remains while new data is loading
    }
  );

  // Combine all products from fetched pages
  const products = data?.pages.flatMap((page) => page.content) || [];
  const totalElements = data?.pages[0]?.page.totalElements || 0;

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const { data: collectionsData } = useQuery<CollectionsAndCategoriesData>(
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

  const matchedCollection = collectionsData?.collections.find(
    (collection) => collection.slug === slug
  );

  const bannerImage = matchedCollection?.bannerImage || "";

  return (
    <div>
      <div
        className={`relative parallax h-[90vh] flex justify-center items-end tracking-[.2em] transition-all duration-500 ease-in-out`}
        style={{
          backgroundImage: `url(${baseUrl}/${bannerImage})`,
        }}
      >
        <p className="text-xl text-white font-semibold mb-[30vh]">
          {matchedCollection?.nameRu}
        </p>
      </div>
      <div className="md:mx-16 mx-5">
        <div className="flex flex-row justify-between items-center my-8">
          <p className="text-[15px] text-[#454545] font-normal">
            {totalElements} products
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
            collectionSlug={slug}
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
