import { fetchCollectionsData } from "@/services/collections";
import { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

type Props = {
  params: { collectionSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { collectionSlug: slug } = params;

    const collectionsData: any = await fetchCollectionsData(1);

    const matchedCollection = collectionsData?.data?.content?.find(
      (collection: any) => collection.slug === slug
    );

    // const title =
    //   i18n.language == 'ru'
    //     ? matchedCollection?.nameRu
    //     : matchedCollection?.nameUz;

    // const description =
    //   i18n?.language == 'ru'
    //     ? matchedCollection?.descriptionRu
    //     : matchedCollection?.descriptionUz;

    return {
      title: "Loris - " + matchedCollection?.nameRu,
      description: matchedCollection?.descriptionRu,
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
      title: "Loris parfume",
      description: "Description",
    };
  }
}

export default function CollectionsPage({
  params,
}: {
  params: { collectionSlug: string };
}) {
  return <ClientComponent params={params} />;
}
