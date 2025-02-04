// "use client";

import ProductDetailsPage from '@/app/components/ProductDetailsPage';
import { fetchProductBySlug } from '@/services/products';
import { Metadata } from 'next';

type Props = {
  params: { productSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { productSlug: slug } = params;

    const collectionsData: any = await fetchProductBySlug(slug);
    return {
      title: 'Loris - ' + collectionsData?.data?.nameRu,
      description: collectionsData?.data?.descriptionRu,
      openGraph: {
        images: [collectionsData?.data?.imagesList[0]],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/collections`,
        languages: {
          en: `${process.env.NEXT_PUBLIC_DOMAIN}/collections/${slug}`,
          ru: `${process.env.NEXT_PUBLIC_DOMAIN}/collections/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'LORIS Perfume',
      description: 'Description',
    };
  }
}

export default function CollectionProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return (
    <>
      <ProductDetailsPage {...params} />
    </>
  );
}
