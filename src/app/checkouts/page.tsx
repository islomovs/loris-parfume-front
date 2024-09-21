"use client";
import React, { useState, useRef, useEffect } from "react";
import { BiBasket } from "react-icons/bi";
import { CustomDropdown } from "../components/CustomDropdown";
import { CustomInput } from "../components/CustomInput";
import { CheckoutCartItem } from "../components/CheckoutCartItem";
import CustomTextArea from "../components/CustomTextArea";
import useCartStore from "../../services/store"; // Import Zustand store
import useOrderStore from "../../services/orderStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import {
  createOrder,
  OrderData,
  fetchNearestBranch,
} from "../../services/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { message, Image } from "antd";
import { useTranslation } from "react-i18next";
import PaymeIcon from "../../../public/payme-logo.BdmkZoD4.svg";
import ClickIcon from "../../../public/click-logo.jzgAXUV7.svg";
import YandexMap from "../components/YandexMap";
import i18n from "@/utils/i18n";
import { Box, HStack, Spinner } from "@chakra-ui/react";
import { formatPrice } from "@/utils/priceUtils";

const allPaymentOptions = [
  { id: 0, title: "payme", icon: PaymeIcon.src },
  { id: 1, title: "click", icon: ClickIcon.src },
];

type FormData = {
  fullName: string;
  phone: string;
  branch: string;
  address: string;
  comment: string;
  paymentType: string;
  deliveryType: string;
  distance: number;
  deliverySum: number;
};

export default function Checkout() {
  const { cart, totalSum, getDiscountedTotal } = useCartStore((state) => state); // Use getDiscountedTotal from store
  const { addOrder } = useOrderStore();
  const { handleSubmit, setValue, control, register, resetField, watch } =
    useForm<FormData>({
      defaultValues: {
        deliveryType: "Доставка", // Set Доставка as default
      },
    });

  const [filteredPaymentOptions, setFilteredPaymentOptions] =
    useState(allPaymentOptions);
  const [isDelivery, setDelivery] = useState<boolean>(true);
  const [deliveryData, setDeliveryData] = useState<{
    distance: number;
    deliverySum: number;
  }>({
    distance: 0,
    deliverySum: 0,
  });
  const [branchName, setBranchName] = useState<string>("");
  const [coords, setCoords] = useState([41.314472, 69.27991]);
  const router = useRouter();
  const timer = useRef(setTimeout(() => {}, 3000));
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const { t } = useTranslation("common");
  const currentTotalSum = totalSum();
  const [deliverySum, setDeliverySum] = useState<number>(0);

  const deliveryOptions = [
    { id: 1, title: t("checkout.deliveryOptions.delivery") }, // Only include "Доставка"
  ];

  const orderMutation = useMutation(
    (orderData: OrderData) => createOrder(orderData),
    {
      onMutate: () => {
        loadingBarRef.current?.continuousStart();
      },
      onSuccess: (data) => {
        loadingBarRef.current?.complete();
        addOrder(data);
        if (data.paymentType.toLowerCase() === "uzum nasiya") {
          message.success(
            "Answer for your request will be sent to your phone number"
          );
        } else if (
          data.paymentType.toLowerCase() === "click" ||
          data.paymentType.toLowerCase() === "payme"
        ) {
          window.location.href = data.paymentLink;
        } else {
          message.success("Order created successfully!");
          router.push("/account");
        }
      },
      onError: (error) => {
        loadingBarRef.current?.complete();
        message.error("Failed to create order, please try again.");
      },
    }
  );

  const nearestBranchMutation = useMutation(
    ({ longitude, latitude }: { longitude: number; latitude: number }) =>
      fetchNearestBranch(latitude, longitude),
    {
      onMutate: () => {
        message.loading("Fetching nearest branch...");
      },
      onSuccess: (data) => {
        message.destroy();
        setBranchName(data?.name);
        setBranchId(data?.id);
        setDeliveryData({
          distance: Number(data?.distance),
          deliverySum: Number(data?.deliverySum),
        });

        // Calculate the deliverySum based on the total sum and set it using setDeliverySum
        const currentTotalSum = totalSum(); // Ensure totalSum() is available in this scope
        setDeliverySum(
          currentTotalSum >= 500000 ? 0 : Number(data?.deliverySum)
        );
      },
      onError: (error) => {
        message.destroy();
        message.error("Failed to fetch nearest branch, please try again.");
      },
    }
  );

  const handleDeliveryChange = (value: string) => {
    setValue("deliveryType", value);
    if (value === "Доставка") {
      setFilteredPaymentOptions(
        allPaymentOptions.filter((option) => option.title !== "cash")
      );
      if (watch("paymentType") === "cash") {
        resetField("paymentType");
      }
    } else {
      setFilteredPaymentOptions(allPaymentOptions);
    }
  };

  const onLocationChange = (value: {
    address: string;
    city: string;
    location: [number, number];
  }) => {
    setValue("address", value?.address);
    setCoords([value?.location[0], value?.location[1]]);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      nearestBranchMutation.mutate({
        latitude: value?.location[0],
        longitude: value?.location[1],
      });
    }, 2000);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const ordersItemsList = cart.map((item) => ({
      itemId: item.id,
      sizeId: item.sizeId ?? 1,
      quantity: item.quantity,
      collectionId: item.collectionId ?? 0,
    }));

    const finalTotalSum = deliverySum + currentTotalSum;
    const orderData: OrderData = {
      fullName: data.fullName,
      branchId: branchId ?? 0,
      address: data.address,
      addressLocationLink: `https://yandex.uz/maps/?ll=${coords[1]}%2C${coords[0]}`,
      distance: 5.0,
      phone: data.phone,
      comment: data.comment,
      isDelivery: data.deliveryType === t("checkout.deliveryOptions.delivery"),
      isSoonDeliveryTime: false,
      longitude: coords[0] || 0.0,
      latitude: coords[1] || 0.0,
      deliverySum: deliverySum,
      totalSum: finalTotalSum,
      paymentType: data.paymentType.toLowerCase(),
      returnUrl: "https://lorisparfume.uz/account",
      ordersItemsList: ordersItemsList,
    };

    orderMutation.mutate(orderData);
  };

  return (
    <section className="px-5 md:px-8 lg:px-16 overflow-x-hidden">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="py-2">
        <header className="flex flex-row justify-between items-center md:px-[104px] py-4 md:py-[21px]">
          <Link href="/">
            <Image
              preview={false}
              src="/logo.png"
              alt="logo"
              className="max-w-[60px] md:max-w-[90px]"
            />
          </Link>
          <Link href={`/cart`}>
            <BiBasket className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </Link>
        </header>
        <hr className="border-solid border-t-[1px] border-t-[#DFDFDF] -mx-5 md:-mx-[104px]" />
        <div className="relative flex flex-col lg:flex-row md:px-16 md:py-4">
          <div className="flex-[6] flex flex-col gap-4 border-b lg:border-b-0 lg:border-r-[1px] border-solid border-[#DFDFDF] py-5 md:p-10">
            <h1 className="text-lg md:text-xl lg:text-[21px] font-medium text-[#454545]">
              {t("checkout.delivery")}
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <CustomDropdown
                name="deliveryType"
                options={deliveryOptions}
                title={t("checkout.deliveryType")}
                control={control}
                onChange={handleDeliveryChange}
              />
              <YandexMap onLocationChange={onLocationChange} />
              <CustomInput
                {...register("fullName")}
                type="text"
                borders="rounded"
                title={t("checkout.fullName")}
              />
              <CustomInput
                {...register("phone")}
                type="text"
                borders="rounded"
                title={t("checkout.phoneNumber")}
              />
              <CustomInput
                value={branchName}
                type="text"
                borders="rounded"
                title={t("checkout.branch")}
                disabled
              />
              <CustomInput
                {...register("address")}
                type="text"
                borders="rounded"
                title={t("checkout.address")}
              />
              <CustomTextArea
                {...register("comment")}
                borders="rounded"
                title={t("checkout.comment")}
              />
              <CustomDropdown
                name="paymentType"
                options={filteredPaymentOptions}
                title={t("checkout.paymentType")}
                control={control}
              />
              <button
                type="submit"
                className="w-full bg-[#454545] p-[14px] font-semibold text-lg md:text-xl text-white rounded-[5px]"
                disabled={orderMutation.isLoading}
              >
                {orderMutation.isLoading
                  ? t("checkout.processing")
                  : t("checkout.makePayment")}
              </button>
            </form>
            <footer className="border-t border-solid border-t-[#DFDFDF] mt-4 lg:mt-16">
              <a href="#" className="mt-2 underline text-primary">
                {t("checkout.privacy")}
              </a>
            </footer>
          </div>
          <div className="flex-[4] p-4 md:p-10 lg:h-[300px] lg:sticky top-0 right-0 left-0">
            <div className="w-full flex flex-col gap-5">
              {nearestBranchMutation.isLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Spinner size="lg" color="#87754f" />
                </div>
              ) : (
                cart.map((cartItem, index) => {
                  const discountPrice = cartItem.discountPercent
                    ? cartItem.price -
                      (cartItem.price * cartItem.discountPercent) / 100
                    : cartItem.price;

                  const name =
                    i18n.language === "ru" ? cartItem.nameRu : cartItem.nameUz;
                  const sizeName =
                    i18n.language === "ru"
                      ? cartItem.sizeNameRu
                      : cartItem.sizeNameUz;

                  // Calculate total with discount logic from Zustand
                  const discountedTotal = getDiscountedTotal(
                    cartItem.collectionSlug || "",
                    Number(discountPrice),
                    Number(cartItem.quantity)
                  );

                  return (
                    <CheckoutCartItem
                      key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
                      title={name}
                      subtitle={sizeName}
                      price={discountPrice} // Pass original price
                      quantity={cartItem.quantity}
                      image={cartItem.imagesList[0]}
                      discountedTotal={discountedTotal} // Pass calculated total
                    />
                  );
                })
              )}
              <Box fontSize={{ md: "20px" }} color="#454545">
                <HStack justify="space-between">
                  <p>{t("checkout.products")}</p>
                  <p>
                    {formatPrice(totalSum())} {t("productDetails.sum")}
                  </p>
                </HStack>
                <HStack justify="space-between" my={5}>
                  <p>{t("checkout.delivery")}</p>
                  <p>
                    {formatPrice(deliverySum)} {t("productDetails.sum")}
                  </p>
                </HStack>
                <HStack justify="space-between" fontWeight={600}>
                  <p>{t("checkout.payment")}</p>
                  <p>
                    {formatPrice(
                      currentTotalSum + (deliverySum > 0 ? deliverySum : 0)
                    )}{" "}
                    {t("productDetails.sum")}
                  </p>
                </HStack>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
