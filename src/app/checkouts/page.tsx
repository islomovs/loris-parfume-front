"use client";
import React, { useState, useRef } from "react";
import { BiBasket } from "react-icons/bi";
import { CustomDropdown } from "../components/CustomDropdown";
import { CustomInput } from "../components/CustomInput";
import { CheckoutCartItem } from "../components/CheckoutCartItem";
import CustomTextArea from "../components/CustomTextArea";
import useCartStore from "../../services/store";
import useOrderStore from "../../services/orderStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { createOrder, OrderData } from "../../services/orders";
import { fetchNearestBranch } from "../../services/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { message } from "antd";
import { Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CashIcon from "../../../public/cash-icon.svg";
import PaymeIcon from "../../../public/payme-logo.BdmkZoD4.svg";
import ClickIcon from "../../../public/click-logo.jzgAXUV7.svg";
import YandexMap from "../components/YandexMap";
import i18n from "@/utils/i18n";

const allPaymentOptions = [
  { id: 0, title: "cash", icon: CashIcon.src },
  { id: 1, title: "payme", icon: PaymeIcon.src },
  { id: 2, title: "click", icon: ClickIcon.src },
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
  const { cart, totalSum } = useCartStore((state) => state);
  const { addOrder } = useOrderStore();
  const { handleSubmit, setValue, control, register, resetField, watch } =
    useForm<FormData>();

  const [filteredPaymentOptions, setFilteredPaymentOptions] =
    useState(allPaymentOptions);

  const [isDelivery, setDelivery] = useState<boolean>(true);
  const [deliveryData, setDeliveryData] = useState<{
    distance: number;
    deliverySum: number;
  }>({ distance: 0, deliverySum: 0 });
  const [branchName, setBranchName] = useState<string>(""); // State for branch name
  const [coords, setCoords] = useState([41.314472, 69.27991]);

  const router = useRouter();
  const timer = useRef(setTimeout(() => {}, 3000));
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null); // State for branch ID
  const { t } = useTranslation("common");

  const deliveryOptions = [
    { id: 0, title: t("checkout.deliveryOptions.pickup") },
    { id: 1, title: t("checkout.deliveryOptions.delivery") },
  ];

  // Define the mutation for creating an order using React Query
  const orderMutation = useMutation(
    (orderData: OrderData) => createOrder(orderData),
    {
      onMutate: () => {
        loadingBarRef.current?.continuousStart();
      },
      onSuccess: (data) => {
        loadingBarRef.current?.complete();
        addOrder(data);

        // Handle specific payment types
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
        console.error("Failed to create order:", error);
        message.error("Failed to create order, please try again.");
      },
    }
  );

  // Define the mutation for fetching the nearest branch using React Query
  const nearestBranchMutation = useMutation(
    ({ longitude, latitude }: { longitude: number; latitude: number }) =>
      fetchNearestBranch(longitude, latitude),
    {
      onMutate: () => {
        message.loading("Fetching nearest branch...");
      },
      onSuccess: (data) => {
        message.destroy(); // Remove loading message
        setBranchName(data?.name); // Set the branch name from the response
        setBranchId(data?.id); // Set the branch ID from the response
        setDeliveryData({
          distance: Number(data?.distance),
          deliverySum: Number(data?.deliverySum),
        });
      },
      onError: (error) => {
        message.destroy(); // Remove loading message
        console.error("Error fetching nearest branch:", error);
        message.error("Failed to fetch nearest branch, please try again.");
      },
    }
  );

  const handleDeliveryChange = (value: string) => {
    setValue("deliveryType", value);

    // Filter payment options based on delivery type immediately after selection
    if (value === "Доставка") {
      setFilteredPaymentOptions(
        allPaymentOptions.filter((option) => option.title !== "cash")
      );
      if (watch("paymentType") === "cash") {
        resetField("paymentType"); // Reset payment type if it was cash
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
      sizeId: item.sizeId ?? 0,
      quantity: item.quantity,
      collectionId: item.collectionId ?? 0,
    }));

    const currentTotalSum = totalSum();
    const deliverySum = currentTotalSum > 500000 ? 0 : deliveryData.deliverySum;

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
      scheduledDeliveryTime: new Date().toISOString(),
      longitude: coords[1] || 0.0,
      latitude: coords[0] || 0.0,
      deliverySum: deliverySum,
      totalSum: finalTotalSum,
      paymentType: data.paymentType.toLowerCase(),
      returnUrl: "",
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
            <h1 className="text-lg md:text-xl lg:text-[21px] font-medium text-[#454545]">
              Loris Parfume
            </h1>
          </Link>
          <Link href={`/cart`}>
            <BiBasket className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </Link>
        </header>
        <hr className="border-solid border-t-[1px] border-t-[#DFDFDF] -mx-5 md:-mx-[104px]" />
        <div className="relative flex flex-col lg:flex-row md:px-16 md:py-4">
          <div className="flex-[6] flex flex-col gap-4 border-b lg:border-b-0 lg:border-r-[1px] border-solid border-[#DFDFDF] md:p-10">
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
              {/* Branch Name Input */}
              <CustomInput
                value={branchName}
                type="text"
                borders="rounded"
                title={t("checkout.branch")}
                disabled // Make the input field unchangeable
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
                    i18n.language == "ru" ? cartItem.nameRu : cartItem.nameUz;
                  const sizeName =
                    i18n.language == "ru"
                      ? cartItem.sizeNameRu
                      : cartItem.sizeNameUz;

                  return (
                    <CheckoutCartItem
                      key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
                      title={name}
                      subtitle={sizeName}
                      price={discountPrice}
                      quantity={cartItem.quantity}
                      image={cartItem.imagesList[0]}
                    />
                  );
                })
              )}
              <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row justify-between text-base md:text-[19px] font-semibold text-[#454545]">
                  <p>{t("checkout.total")}</p>
                  <p>
                    {totalSum().toFixed(2)} {t("productDetails.sum")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
