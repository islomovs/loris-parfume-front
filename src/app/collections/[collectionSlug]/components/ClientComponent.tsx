'use client';
import { useQuery, useInfiniteQuery } from 'react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchProductsData } from '@/services/products';
import { CollectionsAndCategoriesData } from '@/services/collections';
import { ProductsGrid } from '@/app/components/ProductsGrid';
import SortingDropdown from '@/app/components/SortingDropdown';
import i18n from '@/utils/i18n';
type Props = {
  params: { collectionSlug: string };
};
const ClientComponent = ({ params }: Props) => {
  const [sortOption, setSortOption] = useState<string | undefined>(undefined);
  const { collectionSlug: slug } = params;
  const { t } = useTranslation('common');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ['productsByCollection', slug, sortOption],
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
        const nextPage = lastPage.page.number + 2; // API might return 0-based index
        return nextPage <= lastPage.page.totalPages ? nextPage : undefined;
      },
      keepPreviousData: true, // Ensures previous data remains while new data is loading
    }
  );

  const products = data?.pages.flatMap((page) => page.content) || [];
  const totalElements = data?.pages[0]?.page.totalElements || 0;

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const { data: collectionsData } = useQuery<CollectionsAndCategoriesData>(
    ['collectionsAndCategories', 1],
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

  const bannerImage = matchedCollection?.bannerImage || '';
  const title =
    i18n.language == 'ru'
      ? matchedCollection?.nameRu
      : matchedCollection?.nameUz;

  const description =
    i18n.language == 'ru'
      ? matchedCollection?.descriptionRu
      : matchedCollection?.descriptionUz;

  return (
    <div>
      <div>
        {bannerImage ? (
          <div
            className={`relative parallax h-[90vh] flex justify-center items-end tracking-[.2em] transition-all duration-500 ease-in-out`}
            style={{
              backgroundImage: `url(${bannerImage})`,
            }}
          >
            <p className='text-xl text-white font-semibold mb-[30vh]'>
              {title}
            </p>
          </div>
        ) : (
          <div className='flex justify-center items-center'>
            <div className='p-14 text-center'>
              <h1 className='py-4 font-semibold tracking-[.2em]'>{title}</h1>
              <p className='text-center text-base text-[#454545]'>
                {description}
              </p>
            </div>
          </div>
        )}
        <div className='md:mx-16 mx-5'>
          <div className='flex flex-row justify-between items-center my-8'>
            <p className='text-[15px] text-[#454545] font-normal'>
              {totalElements} {t('products')}
            </p>
            <SortingDropdown onSortChange={handleSortChange} />
          </div>
          <hr className='border-t border-solid border-t-[#f0f0f0] mb-8' />
          {isError ? (
            <div className='text-center text-red-500'>
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
    </div>
  );
};

export default ClientComponent;
