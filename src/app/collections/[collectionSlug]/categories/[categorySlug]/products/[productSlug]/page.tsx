"use client";

import ProductDetailsPage from "@/app/components/ProductDetailsPage";

export default function CategoryProductPage({
  params,
}: {
  params: { collectionSlug: string; categorySlug: string; productSlug: string };
}) {
  return <ProductDetailsPage {...params} />;
}
