import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import {
  fetchProductBySlug,
  fetchRecommendedProductsData,
} from "@/services/products";
import { addToCart, ICartItem } from "@/services/cart";
import useCartStore from "@/services/store";
import { queryClient } from "@/app/providers";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { CustomDrawer } from "@/app/components/CustomDrawer";
import { ImagePagination } from "@/app/components/ImagePagination";
import { ProductDetailsHeader } from "@/app/components/ProductDetailsHeader";
import { QuantitySelector } from "@/app/components/QuantitySelector";
import { SizeSelector } from "@/app/components/SizeSelector";
import RecommendedSlider from "@/app/components/RecommendedSlider";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsBoxSeam } from "react-icons/bs";
import LoadingBar from "react-top-loading-bar"; // Import the LoadingBar component

export default function ProductDetailsPage({
  collectionSlug,
  categorySlug,
  productSlug,
}: {
  collectionSlug?: string;
  categorySlug?: string;
  productSlug: string;
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState<number | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const { addOrUpdateCartItem } = useCartStore((state) => state);
  const [open, setOpen] = useState(false);
  const loadingBarRef = useRef<any>(null); // Reference for the loading bar

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { data: product, isLoading: isLoadingProduct } = useQuery(
    ["productData", productSlug],
    () => fetchProductBySlug(productSlug),
    { enabled: !!productSlug }
  );

  const { data: recommendedProductsData, isLoading: isLoadingRecProducts } =
    useQuery(
      ["recommendedProductsData", productId],
      () => fetchRecommendedProductsData(productId),
      { enabled: !!productId }
    );

  const recommendedProducts = recommendedProductsData?.data.recommendedItems;

  useEffect(() => {
    if (product?.data) {
      const discountPercent = product?.data.discountPercent || 0;
      const initialPrice = product?.data.price || 0;
      const discountedPrice = discountPercent
        ? initialPrice * (1 - discountPercent / 100)
        : initialPrice;

      setProductPrice(discountedPrice);
      setOriginalPrice(initialPrice);
      setProductId(product.data.id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product?.data.sizesItemsList?.length && !selectedOption) {
      alert("Please select a size option.");
      return;
    }

    const cartItem = {
      slug: product?.data.slug,
      quantity,
      sizeId: selectedSizeId,
      price: productPrice,
      collectionSlug: collectionSlug,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      addOrUpdateCartItem({
        id: product?.data.id,
        ...cartItem,
        nameEng: product?.data?.nameEng,
        nameRu: product?.data.nameRu,
        nameUz: product?.data.nameUz,
        imagesList: product?.data?.imagesList,
      });
      showDrawer();
      return;
    }

    loadingBarRef.current.continuousStart(); // Start the loading bar
    mutation.mutate(cartItem);
  };

  const mutation = useMutation(addToCart, {
    onSuccess: (data, variables) => {
      const { slug, quantity, sizeId, price } = variables;
      const newItem: ICartItem = {
        id: product?.data.id,
        slug,
        quantity,
        sizeId,
        price: productPrice,
        nameEng: product?.data?.nameEng,
        nameRu: product?.data.nameRu,
        nameUz: product?.data.nameUz,
        imagesList: product?.data?.imagesList,
        collectionSlug: collectionSlug,
      };

      addOrUpdateCartItem(newItem);
      queryClient.invalidateQueries("cartItemsData").then(() => {
        showDrawer();
      });
      loadingBarRef.current.complete(); // Complete the loading bar
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
      loadingBarRef.current.complete(); // Complete the loading bar on error
    },
  });

  if (isLoadingProduct) {
    return <div>Loading...</div>;
  }

  if (!product?.data) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex flex-col">
      <LoadingBar color="#87754f" ref={loadingBarRef} />{" "}
      {/* Loading bar component */}
      <div className="flex flex-row py-16">
        {open && <CustomDrawer onClose={onClose} isOpen={open} />}
        <div className="flex flex-row flex-[2] pl-16">
          <ImagePagination images={product?.data?.imagesList} />
        </div>
        <div className="flex-1 mr-[100px] ml-[50px] sticky top-0 h-[400px]">
          <ProductDetailsHeader
            category={product?.data.categoryNameRu}
            name={product?.data.nameRu}
            price={productPrice}
            originalPrice={originalPrice}
          />
          <div className="border-t my-6 pt-6 border-t-[#e3e3e3] border-solid">
            <p className="text-[#454545] text-[14px] leading-[1.65] font-normal">
              {product?.data.descriptionRu}
            </p>
          </div>
          <div>
            {product?.data.sizesItemsList?.length && (
              <SizeSelector
                options={product?.data.sizesItemsList}
                selectedOption={selectedOption}
                onSelect={(option, price, sizeId) => {
                  const sizeDiscountPercent = product?.data.sizesItemsList.find(
                    (size: any) => size.sizeId === sizeId
                  )?.discountPercent;
                  const finalPrice = sizeDiscountPercent
                    ? price * (1 - sizeDiscountPercent / 100)
                    : price;

                  setSelectedOption(option);
                  setProductPrice(finalPrice);
                  setOriginalPrice(price);
                  setSelectedSizeId(sizeId);
                }}
              />
            )}
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <AnimatedButton
              title="add to shopping cart"
              variant="dark"
              width="w-full"
              onClick={handleAddToCart}
            />
            <div className="flex flex-row justify-between items-center my-7">
              <div className="flex flex-row justify-between items-center">
                <LiaShippingFastSolid className="w-[35px] h-[35px] mr-[15px]" />
                <p className="text-[#454545] text-xs leading-[1.65] font-normal">
                  Free Shipping Over 500000 soum
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <BsBoxSeam className="w-[30px] h-[30px] mr-[15px]" />
                <p className="text-[#454545] text-xs leading-[1.65] font-normal">
                  Estimated Delivery Within 3 Days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-solid border-[#e3e3e3] py-20">
        <h1 className="uppercase font-normal text-center text-xl tracking-[.2em] text-[#454545] mb-16">
          You may also like
        </h1>
        <RecommendedSlider
          items={recommendedProducts}
          collectionSlug={collectionSlug}
          categorySlug={categorySlug}
        />
      </div>
    </div>
  );
}
