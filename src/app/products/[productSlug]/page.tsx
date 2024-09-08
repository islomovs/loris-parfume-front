"use client";

import ProductDetailsPage from "@/app/components/ProductDetailsPage";

export default function SearchProductDetailsPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return <ProductDetailsPage productSlug={params.productSlug} />;
}
