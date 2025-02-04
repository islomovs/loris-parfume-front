import ProductDetailsPage from '@/app/components/ProductDetailsPage';
import { fetchProductBySlug } from '@/services/products';
import { Metadata } from 'next';

type Props = {
  params: { productSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { productSlug: slug } = params;

    const collectionsData: any = await fetchProductBySlug(slug);
    return {
      title: collectionsData.data?.nameUz + ' mahsuloti',
      description: collectionsData.data?.descriptionRu,
      openGraph: {
        images: [collectionsData.data?.imagesList[0]],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
        languages: {
          en: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
          ru: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'LORIS Perfume',
      description: 'Default Description',
    };
  }
}

export default function SearchProductDetailsPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return <ProductDetailsPage productSlug={params.productSlug} />;
}
