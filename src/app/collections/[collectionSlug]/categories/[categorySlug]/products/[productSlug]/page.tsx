import { fetchProductBySlug } from '@/services/products';
import CategoryProduct from './components/CategoryProduct';
import { Metadata } from 'next';

type Props = {
  params: { productSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { productSlug: slug } = params;

    const product: any = await fetchProductBySlug(slug);

    return {
      title: 'Loris - ' + product?.data?.nameRu,
      description: product?.data?.descriptionRu,
      openGraph: {
        images: [product?.data?.imagesList[0]],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/ru/collections`,
        languages: {
          en: `${process.env.NEXT_PUBLIC_DOMAIN}/collections/${slug}`,
          ru: `${process.env.NEXT_PUBLIC_DOMAIN}/collections/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Loris parfume',
      description: 'Description',
    };
  }
}
export default function CategoryProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return (
    <>
      <CategoryProduct params={params} />
    </>
  );
}
