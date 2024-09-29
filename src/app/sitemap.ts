import { fetchCollectionsData } from "@/services/collections";
import { fetchProductsData } from "@/services/products";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

  const collections = await fetchCollectionsData(1);

  const collectionData = collections?.data?.content?.map((el: any) => {
    return {
      url: `${baseUrl}/collections/${el.slug}`,
      lastModified: new Date(),
    };
  });
  const collectionDataWidthProducts = await Promise.all(
    collections?.data?.content?.map(async (collection: any) => {
      try {
        const productsData = await fetchProductsData(1, collection?.slug);
        return productsData.data?.content?.map((el: any) => ({
          url: `${baseUrl}/collections/${collection.slug}/products/${el.slug}`,
          lastModified: new Date(),
        }));
      } catch (error) {
        console.error(
          `Error fetching product data for slug: ${collection.slug}`,
          error
        );
        return null;
      }
    })
  );

  const flattenedCollectionDataWidthProducts = collectionDataWidthProducts
    .filter((data) => data !== null)
    .flat();

  const products = await fetchProductsData(1, "", "", "");
  const allProducts = products?.data?.content?.map((el: any) => {
    return {
      url: `${baseUrl}/products/${el.slug}`,
      lastModified: new Date(),
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/branches`,
      lastModified: new Date(),
    },
    ...collectionData,
    ...flattenedCollectionDataWidthProducts,
    ...allProducts,
  ];
}
