"use client";

import { ProductsGrid } from "@/app/components/ProductsGrid";
import { fetchProductsData, IProduct } from "@/services/products";
import { useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

export default function SearchResultsPage({
  params,
}: {
  params: { searchSlug: string };
}) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    remove,
  } = useInfiniteQuery(
    ["productsByCollection", params.searchSlug],
    async ({ pageParam = 1 }) => {
      const res = await fetchProductsData(
        pageParam,
        "",
        "",
        "",
        params.searchSlug
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
        if (products)
          if (newProducts.length > products.length) {
            setProducts(newProducts);
          }

        if (data.pages.length === 1) {
          setTotalElements(data.pages[0].totalElements);
        }
      },
    }
  );

  return (
    <div className="flex flex-col mb-6 mx-16">
      <div className="my-8">
        <h1 className="uppercase font-normal text-center text-xl tracking-[.2em] text-[#454545] mb-4">
          search results
        </h1>
        <p className="flex justify-center items-center text-[14px] text-[#454545] font-normal">
          {totalElements} results for "{params.searchSlug}"
        </p>
      </div>
      <hr className="border-t border-solid border-t-[#f0f0f0] mb-8" />
      <ProductsGrid
        products={products}
        isLoading={isFetchingNextPage}
        loadMore={() => fetchNextPage()}
        totalProducts={totalElements}
        hasMore={hasNextPage}
      />
    </div>
  );
}
