"use client"

import ProductDetailsPage from "@/app/components/ProductDetailsPage";

export default function CollectionProductPage({
  params,
}: {
  params: { collectionSlug: string; productSlug: string };
}) {
  return <ProductDetailsPage {...params} />;
}
