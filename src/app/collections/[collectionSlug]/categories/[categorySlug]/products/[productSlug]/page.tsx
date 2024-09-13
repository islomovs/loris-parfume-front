"use client";

import ProductDetailsPage from "@/app/components/ProductDetailsPage";

export default function CategoryProductPage({
  params,
}: {
  params: { productSlug: string };
}) {
  return <ProductDetailsPage {...params} />;
}
