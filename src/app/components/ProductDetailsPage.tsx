"use client";
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
import LoadingBar from "react-top-loading-bar";
import { Spinner } from "@chakra-ui/react";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import Script from "next/script";

export default function ProductDetailsPage({
  productSlug,
}: {
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
  const loadingBarRef = useRef<any>(null);
  const { t } = useTranslation("common");

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
    if (product?.data.sizesItemsList?.length >= 2 && !selectedOption) {
      message.warning(t("productDetails.selectSize"));
      return;
    }

    const cartItem = {
      slug: product?.data.slug,
      quantity,
      sizeId: selectedSizeId,
      price: productPrice,
      collectionSlug: product?.data.collectionsItemsList[0].collectionSlug,
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

    loadingBarRef.current.continuousStart();
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
        collectionId: product?.data?.collectionsItemsList[0]?.collectionId,
        collectionSlug: product?.data.collectionsItemsList[0].collectionSlug,
      };

      addOrUpdateCartItem(newItem);
      queryClient.invalidateQueries("cartItemsData").then(() => {
        showDrawer();
      });
      loadingBarRef.current.complete();
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
      message.error("Failed to add item to cart.");
      loadingBarRef.current.complete();
    },
  });

  // Spinner for loading states
  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="#87754f" />
      </div>
    );
  }

  if (!product?.data) {
    return <div>Product not found.</div>;
  }

  const name =
    i18n.language == "ru" ? product?.data.nameRu : product?.data.nameUz;
  const category =
    i18n.language == "ru"
      ? product?.data.categoryNameRu
      : product?.data.categoryNameUz;
  const description =
    i18n.language == "ru"
      ? product?.data.descriptionRu
      : product?.data.descriptionUz;

  const microdata = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: name,
    image: product?.data?.imagesList[0],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "23",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${product?.data?.slug}`,
      priceCurrency: "UZS",
      price: product?.data?.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Loris Parfume",
      },
    },
  };

  const microdataJson = JSON.stringify(microdata);

  return (
    <>
      <div className="flex flex-col px-4">
        <LoadingBar color="#87754f" ref={loadingBarRef} />
        <div className="flex flex-col lg:flex-row py-8 md:py-16">
          {open && <CustomDrawer onClose={onClose} isOpen={open} />}
          <div className="flex flex-col lg:flex-row lg:flex-[2] lg:pl-16 mb-6 lg:mb-0">
            <ImagePagination images={product?.data?.imagesList} />
          </div>
          <div className="flex-1 lg:mr-[100px] lg:ml-[50px] mt-6 lg:mt-0 sticky top-0 lg:h-[400px]">
            <ProductDetailsHeader
              category={category}
              name={name}
              price={productPrice}
              originalPrice={originalPrice}
            />
            <div className="border-t my-6 pt-6 border-t-[#e3e3e3] border-solid">
              <p className="text-[#454545] text-sm md:text-[14px] leading-[1.65] font-normal">
                {description}
              </p>
            </div>
            <div>
              {product?.data.sizesItemsList?.length >= 2 && (
                <SizeSelector
                  options={product?.data.sizesItemsList}
                  selectedOption={selectedOption}
                  onSelect={(option, price, sizeId) => {
                    const sizeDiscountPercent =
                      product?.data.sizesItemsList.find(
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
                title={t("productDetails.addToCart")}
                variant="dark"
                width="w-full"
                onClick={handleAddToCart}
              />
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-7 space-y-4 md:space-y-0">
                <div className="flex flex-row items-center mb-4 md:mb-0">
                  <LiaShippingFastSolid className="w-[35px] h-[35px] mr-[15px]" />
                  <p className="text-[#454545] text-xs md:text-sm leading-[1.65] font-normal">
                    {t("productDetails.freeShipping")}
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <BsBoxSeam className="w-[30px] h-[30px] mr-[15px]" />
                  <p className="text-[#454545] text-xs md:text-sm leading-[1.65] font-normal">
                    {t("productDetails.estimatedDelivery")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-solid border-[#e3e3e3] py-10 md:my-20">
          <h1 className="uppercase font-normal text-center text-lg md:text-xl tracking-[.2em] text-[#454545] mb-10 md:mb-16">
            {t("productDetails.youMayAlsoLike")}
          </h1>
          {isLoadingRecProducts ? (
            <div className="flex justify-center items-center py-10">
              <Spinner size="lg" color="#87754f" />
            </div>
          ) : (
            <RecommendedSlider
              items={recommendedProducts}
              collectionSlug={
                product.data.collectionsItemsList[0].collectionSlug
              }
              categorySlug={product.data.categorySlug}
            />
          )}
        </div>
      </div>
      <Script
        id="microdata-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: microdataJson }}
      />
    </>
  );
}
