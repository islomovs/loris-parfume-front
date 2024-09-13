"use client";

import ProductDetailsPage from "@/app/components/ProductDetailsPage";

export default function CollectionProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return <ProductDetailsPage {...params} />;
}
