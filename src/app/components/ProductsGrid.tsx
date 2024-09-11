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
      <Row
        className="md:px-3"
        gutter={[20, 20]} // Adjusted gutter for spacing
      >
        {!isLoading ? (
          products.map((product: IProduct) => {
            const discountPrice = product.discountPercent
              ? (
                  parseFloat(product.price) *
                  (1 - product.discountPercent / 100)
                ).toFixed(2)
              : null;

            return (
              <Col
                key={product.id}
                xs={12} // 2 columns on mobile (≤576px)
                sm={12} // 2 columns on small screens (≥576px)
                md={8} // 3 columns on medium screens (≥768px)
                lg={8} // 3 columns on large screens (≥992px)
                xl={8} // 3 columns on extra large screens (≥1200px)
              >
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
        ) : (
          <div className="w-full text-center py-6">Loading...</div>
        )}
      </Row>

      <div className="text-center my-8">
        <p className="text-sm text-[#454545] mb-4">
          Showing items {products.length} of {totalProducts}.
        </p>
        {allItemsLoaded ? (
          <p className="text-xs text-[#454545]">All items are loaded.</p>
        ) : (
          hasMore && (
            <AnimatedButton
              title="Load More"
              variant="dark"
              width="w-full sm:w-[300px]" // Full width on mobile, 300px on larger screens
              onClick={loadMore}
            />
          )
        )}
      </div>
    </>
  );
};
