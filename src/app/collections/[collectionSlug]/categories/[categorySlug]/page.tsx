"use client";
import { useQuery, useInfiniteQuery } from "react-query";
import { useState, useEffect } from "react";
import { ProductsGrid } from "@/app/components/ProductsGrid";
import { fetchProductsData, IProduct } from "@/services/products";
import { CollectionsAndCategoriesData } from "@/services/collections";
import SortingDropdown from "@/app/components/SortingDropdown";

export default function CategoriesPage({
  params,
}: {
  params: { categorySlug: string; collectionSlug: string };
}) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { categorySlug, collectionSlug } = params;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    remove,
  } = useInfiniteQuery(
    ["productsByCategory", collectionSlug, categorySlug, sortOption],
    async ({ pageParam = 1 }) => {
      const res = await fetchProductsData(
        pageParam,
        collectionSlug,
        categorySlug,
        sortOption
      );
      const totalElements = res.data.page.totalElements;

      return {
        products: res.data.content,
        totalElements,
      };
    },
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.products.length ? allPages.length + 1 : undefined,
      onSuccess: (data) => {
        const newProducts = data.pages.flatMap((page) => page.products);

        // Set products only if new products have been fetched
        if (newProducts.length > products.length || sortOption) {
          setProducts(newProducts);
        }

        if (data.pages.length === 1) {
          setTotalElements(data.pages[0].totalElements);
        }
      },
    }
  );

  // Handle sort change
  const handleSortChange = (option: string) => {
    setSortOption(option);
    remove(); // Clear previous data
    refetch(); // Refetch data with the new sort option
  };

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

  const matchedCategory = categoriesData?.categories.find(
    (category) => category.slug === categorySlug
  );

  const bannerImage = matchedCategory?.bannerImage || "";

  return (
    <div>
      <div
        className="bg-center bg-cover bg-no-repeat bg-fixed h-[90vh] flex justify-center items-end tracking-[.2em]"
        style={{ backgroundImage: `url(${baseUrl}/${bannerImage})` }}
      >
        <p className="text-xl text-white font-semibold mb-[30vh]">
          {matchedCategory?.nameRu}
        </p>
      </div>
      <div className="md:mx-16 mx-5">
        <div className="flex flex-row md:flex-row justify-between items-center my-8">
          <p className="text-[15px] text-[#454545] font-normal">
            {totalElements} products
          </p>
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <hr className="border-t border-solid border-t-[#f0f0f0] mb-8" />
        <ProductsGrid
          products={products}
          collectionSlug={collectionSlug}
          categorySlug={categorySlug}
          isLoading={isFetchingNextPage}
          loadMore={() => fetchNextPage()}
          hasMore={hasNextPage}
          totalProducts={totalElements}
        />
      </div>
    </div>
  );
}
