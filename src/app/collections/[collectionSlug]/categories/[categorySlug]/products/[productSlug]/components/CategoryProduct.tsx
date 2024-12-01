import ProductDetailsPage from '@/app/components/ProductDetailsPage';

const CategoryProduct = ({ params }: { params: { productSlug: string } }) => {
  return (
    <>
      <ProductDetailsPage {...params} />;
    </>
  );
};

export default CategoryProduct;
