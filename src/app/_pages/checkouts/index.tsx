/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { BiBasket } from "react-icons/bi";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { message, Image } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";
import { Box, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { formatPrice } from "@/utils/priceUtils";
import useCartStore from "@/services/store";
import useOrderStore from "@/services/orderStore";
import { createOrder, OrderData } from "@/services/orders";
import YandexMap from "@/app/components/YandexMap";
import { CustomInput } from "@/app/components/CustomInput";
import CustomTextArea from "@/app/components/CustomTextArea";
import { CheckoutCartItem } from "@/app/components/CheckoutCartItem";
import PromoCodeInput from "@/app/components/PromoCodeInput";
import PhoneInput from "react-phone-input-2";
import { fetchUserInfo } from "@/services/user";
import { VerificationModal } from "@/app/components/VerificationModal";
import {
  auth,
  resendVerificationCode,
  sendVerificationCode,
} from "@/services/authService";

const sanitizePhoneNumber = (phone: string) => {
  // Remove any character that is not a digit or '+'
  const sanitizedPhone = phone?.replace(/[^\d]/g, "");

  // Check if the phone number starts with a '+'
  return sanitizedPhone.startsWith("+") ? sanitizedPhone : `+${sanitizedPhone}`;
};

const allPaymentOptions = [
  { id: 0, title: "payme", icon: "/payme-logo.BdmkZoD4.svg" },
  { id: 1, title: "click", icon: "/click-logo.jzgAXUV7.svg" },
  { id: 2, title: "cash", icon: "/cash-payment.png" },
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

const CheckoutPage = () => {
  const { cart, totalSum, getDiscountedTotal, clearCart } = useCartStore(
    (state) => state
  );
  const { addOrder } = useOrderStore();
  const { handleSubmit, setValue, control, register, getValues, watch } =
    useForm<FormData>({
      defaultValues: {
        deliveryType: "Доставка", // Set Доставка as default
      },
    });
  const { t } = useTranslation("common");

  const [requiredFields, setRequiredFields] = useState<any>({
    phone: false,
    payment: false,
  });
  const [branchName, setBranchName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [coords, setCoords] = useState([41.314472, 69.27991]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountSum, setDiscountSum] = useState<number>(0);
  const [finalTotalSum, setFinalTotalSum] = useState<number>(totalSum());
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>(""); // Store applied promo code
  const router = useRouter();
  const timer = useRef(setTimeout(() => {}, 3000));
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const currentTotalSum = totalSum();
  const [deliverySum, setDeliverySum] = useState(20000);
  // Debounce Timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const token = localStorage.getItem("token");
  const [activePayment, setActivePayment] = useState<string>(""); // State to track active payment type
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handlePaymentClick = (paymentType: string) => {
    setActivePayment(paymentType);
    setValue("paymentType", paymentType);
    setRequiredFields((prev: any) => ({
      ...prev,
      payment: false,
    }));
  };

  // Calculate final total with discount logic
  useEffect(() => {
    const totalAfterSum = currentTotalSum - discountSum;
    const totalAfterDiscount =
      totalAfterSum - (totalAfterSum * discountPercent) / 100;
    setFinalTotalSum(totalAfterDiscount + deliverySum);
  }, [discountSum, discountPercent, currentTotalSum, deliverySum]);

  // Function to handle applying the promo code
  const handleApplyPromo = (
    discountSum: number,
    discountPercent: number,
    promoCode: string
  ) => {
    setDiscountSum(discountSum);
    setDiscountPercent(discountPercent);
    setAppliedPromoCode(promoCode); // Store the applied promo code
  };

  const { data: userInfo } = useQuery("userInfo", fetchUserInfo);

  const orderMutation = useMutation(
    (orderData: OrderData | null) => createOrder(orderData),
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
        } else {
          message.success(t("checkout.success"));
          router.push("/account");
        }
      },
      onError: () => {
        loadingBarRef.current?.complete();
        message.error(t("checkout.failure"));
      },
    }
  );

  const onLocationChange = (value: {
    address: string;
    city: string;
    location: [number, number];
  }) => {
    setValue("address", value?.address);
    setCoords([value?.location[0], value?.location[1]]);

    if (
      value?.city.toLowerCase() == "ташкент" ||
      value?.city.toLowerCase() == "toshkent" ||
      value?.city.toLowerCase() == "tashkent"
    ) {
      setDeliverySum(20000);
    } else {
      setDeliverySum(30000);
    }
    setCity(value?.city);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setPhoneNumber(sanitizePhoneNumber(data.phone));
    const phoneIsEmpty = !data.phone;
    const paymentIsEmpty = !data.paymentType;

    loginMutation.mutate({ phone: sanitizePhoneNumber(data.phone) });

    setRequiredFields((prev: any) => ({
      ...prev,
      phone: phoneIsEmpty,
      payment: paymentIsEmpty,
    }));

    if (phoneIsEmpty || paymentIsEmpty) {
      message.error(t("checkout.requiredFileds"));
      return;
    }

    if (!data.address) {
      message.error(t("checkout.addressErr"));
      return;
    }

    const ordersItemsList = cart.map((item) => ({
      itemId: item.id,
      sizeId: item.sizeId ?? 1,
      quantity: item.quantity,
      collectionId: item.collectionId ?? 0,
    }));

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
      paymentType: data.paymentType?.toLowerCase(),
      promocode: appliedPromoCode, // Include the applied promo code in the order
      returnUrl: token
        ? "https://lorisparfume.uz/account"
        : "https://lorisparfume.uz",
      ordersItemsList: ordersItemsList,
      userId: userInfo?.id || null,
      city,
    };

    if (token != null) {
      orderMutation.mutate(orderData);
    } else {
      message.info(t("checkout.loginFirst"));
      setErrorMessage(null);
      onOpen();
    }
    setOrderData(orderData);
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation(auth, {
    onSuccess: async (data) => {
      message.success(t("account.authorization.codeSentSuccess"));
      setErrorMessage(null);
      onOpen();
      loadingBarRef.current?.complete();
    },
    onError: (error: any) => {
      if (error.isAxiosError) {
        // console.error("ERRROR MESSAGE: ", error);
        if (error.response?.status === 404) {
          setErrorMessage(t("account.authorization.errorNotFound"));
        } else {
          setErrorMessage(`Failed: ${error.response?.data}`);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
      loadingBarRef.current?.complete();
    },
  });

  const sendVerificationCodeMutation = useMutation(
    ({
      phoneNumber,
      verificationCode,
    }: {
      phoneNumber: string;
      verificationCode: string;
    }) => sendVerificationCode(phoneNumber, verificationCode),
    {
      onSuccess: async (data) => {
        message.success(t("account.authorization.loginSuccess"));
        orderMutation.mutate(orderData);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
      },
      onError: (error: any) => {
        console.error("Error: ", error);
        loadingBarRef.current?.complete();
      },
    }
  );

  const resendVerificationCodeMutation = useMutation(
    ({ phoneNumber }: { phoneNumber: string }) =>
      resendVerificationCode(phoneNumber),
    {
      onSuccess: (data) => {
        message.success(t("account.authorization.verificationCodeResent"));
        loadingBarRef.current?.complete();
      },
      onError: (error) => {
        setErrorMessage(t("account.authorization.resentError"));
        console.error("Failed to resend verification code:", error);
        loadingBarRef.current?.complete();
      },
    }
  );

  const handleVerificationSubmit = (verificationCode: string) => {
    loadingBarRef.current?.continuousStart();
    sendVerificationCodeMutation.mutate({
      phoneNumber,
      verificationCode,
    });
  };

  const handleResend = () => {
    loadingBarRef.current?.continuousStart();
    resendVerificationCodeMutation.mutate({ phoneNumber });
  };

  return (
    <section className="px-5 md:px-8 lg:px-16 overflow-x-hidden">
      <LoadingBar color="black" ref={loadingBarRef} />
      <VerificationModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleVerificationSubmit}
        errorMessage={errorMessage}
        handleResend={handleResend}
      />
      <div className="py-2">
        <header className="flex flex-row justify-between items-center md:px-[104px] py-4 md:py-[21px]">
          <Link href="/">
            <Image
              preview={false}
              src="/logo.jpg"
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
          <div className="flex-[6] flex flex-col gap-4 border-b lg:border-b-0 lg:border-r-[1px] border-solid border-[#DFDFDF] md:p-10 py-5">
            <h1 className="text-lg md:text-xl lg:text-[21px] font-medium text-[#454545]">
              {t("checkout.delivery")}
            </h1>
            <form
              className="flex flex-col gap-4 relative"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* <CustomDropdown
                name="deliveryType"
                options={deliveryOptions}
                title={t("checkout.deliveryType")}
                control={control}
              /> */}
              <div
                className={`flex flex-col  w-full  p-2 cursor-pointer rounded-md border-2  transition duration-300`}
              >
                <p className="text-[10px] text-[gray]">
                  {t("checkout.deliveryType")}
                </p>
                <p className="font-[500]">{t("checkout.delivery")}</p>
              </div>
              <YandexMap
                onLocationChange={onLocationChange}
                onNearestBranch={function (coords: [number, number]): void {
                  throw new Error("Function not implemented.");
                }}
              />
              <CustomInput
                {...register("fullName")}
                type="text"
                borders="rounded"
                title={t("checkout.fullName")}
              />
              <div>
                <PhoneInput
                  country={"uz"} // Default country (e.g., Uzbekistan)
                  value={phoneNumber} // Bind the phone value
                  onChange={(e: any) => {
                    setValue("phone", e);
                    setRequiredFields((prev: any) => ({
                      ...prev,
                      phone: e === "",
                    }));
                  }}
                  enableSearch={false} // Enable search for countries
                  placeholder="Enter phone number"
                  inputStyle={{
                    width: "100%",
                    height: "50px",
                    borderRadius: "5px",
                    border: requiredFields?.phone
                      ? "1px solid red"
                      : "2px solid #e3e3e3",
                    outline: requiredFields?.phone
                      ? "2px solid red"
                      : "2px solid #e3e3e3",
                    paddingTop: "13.5px",
                    paddingBottom: "13.5px",
                    outlineWidth: "2px",
                    transition: "all 0.3s",
                  }}
                  dropdownStyle={{
                    textAlign: "left",
                  }}
                />
                {requiredFields?.phone && (
                  <Text color={"red"} mt={1} fontSize={"12"}>
                    {t("checkout.requiredFileds")}
                  </Text>
                )}
              </div>
              <CustomInput
                {...register("address")}
                type="text"
                borders="rounded"
                title={t("checkout.address")}
                disabled={true}
              />
              <CustomTextArea
                {...register("comment")}
                borders="rounded"
                title={t("checkout.comment")}
              />
              <div>
                <div className="flex items-center gap-4">
                  {allPaymentOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => {
                        handlePaymentClick(option.title);
                      }}
                      className={`flex items-center justify-center w-full gap-2 p-4 cursor-pointer rounded-md border-2 ${
                        activePayment === option.title
                          ? "border-[#53B7D1]"
                          : "border-[#e3e3e3]"
                      } hover:border-[#53B7D1] transition duration-300`}
                    >
                      <img
                        className="w-16 h-8 object-contain"
                        src={option.icon}
                        alt={option.title}
                      />
                    </div>
                  ))}
                </div>
                {requiredFields?.payment && (
                  <Text color={"red"} mt={1} fontSize={"12"}>
                    {t("checkout.requiredFileds")}
                  </Text>
                )}
              </div>

              <div className="md:hidden flex-[4] top-0 right-0 left-0">
                <div className="w-full flex flex-col gap-5">
                  {cart.map((cartItem, index) => {
                    const discountPrice = cartItem.discountPercent
                      ? cartItem.price -
                        (cartItem.price * cartItem.discountPercent) / 100
                      : cartItem.price;

                    const name =
                      i18n.language === "ru"
                        ? cartItem.nameRu
                        : cartItem.nameUz;
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
                        price={discountPrice}
                        quantity={cartItem.quantity}
                        image={cartItem.imagesList[0]}
                        discountedTotal={discountedTotal}
                      />
                    );
                  })}
                  <Box color="#454545">
                    <PromoCodeInput onApplyPromo={handleApplyPromo} />
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
                        {formatPrice(finalTotalSum)} {t("productDetails.sum")}
                      </p>
                    </HStack>
                  </Box>
                </div>
              </div>

              {/* Submit Button - Mobile */}
              <div className="block md:hidden">
                <button
                  type="submit"
                  className="w-full bg-[#454545] p-[14px] font-semibold text-lg text-white rounded-md"
                  disabled={orderMutation.isLoading}
                >
                  {orderMutation.isLoading
                    ? t("checkout.processing")
                    : t("checkout.makePayment")}
                </button>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden md:block">
                <button
                  type="submit"
                  className="w-full bg-[#454545] p-[14px] font-semibold text-lg md:text-xl text-white rounded-md"
                  disabled={orderMutation.isLoading}
                >
                  {orderMutation.isLoading
                    ? t("checkout.processing")
                    : t("checkout.makePayment")}
                </button>
              </div>
            </form>

            {/* <footer className="border-t border-solid border-t-[#DFDFDF] mt-4 lg:mt-16">
                <a href="#" className="mt-2 underline text-primary">
                  {t("checkout.privacy")}
                </a>
              </footer> */}
          </div>
          <div className="hidden md:block flex-[4] py-4 md:p-10 lg:h-[300px] lg:sticky top-0 right-0 left-0">
            <div className="w-full flex flex-col gap-5">
              {cart.map((cartItem, index) => {
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
                    price={discountPrice}
                    quantity={cartItem.quantity}
                    image={cartItem.imagesList[0]}
                    discountedTotal={discountedTotal}
                  />
                );
              })}
              <Box color="#454545">
                <PromoCodeInput onApplyPromo={handleApplyPromo} />
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
                    {formatPrice(finalTotalSum)} {t("productDetails.sum")}
                  </p>
                </HStack>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
