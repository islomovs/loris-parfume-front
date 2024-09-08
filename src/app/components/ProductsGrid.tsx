import Link from "next/link";
import { Row, Col } from "antd";
import { IProduct } from "@/services/products";
import { ProductCard } from "@/app/components/ProductCard";
import { AnimatedButton } from "./AnimatedButton";

interface ProductsGridProps {
  products: IProduct[];
  collectionSlug?: string;
  categorySlug?: string;
  isLoading: boolean;
  loadMore: () => void;
  hasMore?: boolean;
  totalProducts: number; // Total number of products
}

export const ProductsGrid = ({
  products,
  collectionSlug,
  categorySlug,
  isLoading,
  loadMore,
  hasMore,
  totalProducts,
}: ProductsGridProps) => {
  const allItemsLoaded = products.length >= totalProducts;

  return (
    <>
      <Row className="px-3" gutter={[30, 30]}>
        {!isLoading
          ? products.map((product: IProduct) => {
              const discountPrice = product.discountPercent
                ? (
                    parseFloat(product.price) *
                    (1 - product.discountPercent / 100)
                  ).toFixed(2)
                : null;

              return (
                <Col key={product.id} span={8}>
                  <Link
                    href={
                      categorySlug
                        ? `/collections/${collectionSlug}/categories/${categorySlug}/products/${product.slug}`
                        : `/collections/${collectionSlug}/products/${product.slug}`
                    }
                  >
                    <ProductCard
                      image={product.imagesList[0]}
                      title={product.nameRu}
                      originalPrice={product.price}
                      discountPrice={discountPrice || product.price}
                      hasDiscount={product.discountPercent > 0}
                    />
                  </Link>
                </Col>
              );
            })
          : "Loading..."}
      </Row>
      <div className="text-center my-8">
        <p className="text-sm text-[#454545] mb-4">
          Showing items {products.length} of {totalProducts}.
        </p>
        {allItemsLoaded
          ? ""
          : hasMore && (
              <AnimatedButton
                title="Load More"
                variant="dark"
                width="w-[300px]"
                onClick={loadMore}
              />
            )}
      </div>
    </>
  );
};
