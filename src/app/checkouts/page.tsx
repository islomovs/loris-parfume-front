"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import YandexMap from "../components/TYandexMap";

const options = [
  { id: 0, title: "Самовывоз" },
  { id: 1, title: "Доставка" },
];

const paymentOptions = [
  { id: 0, title: "cash" },
  { id: 1, title: "Uzum Nasiya" },
  { id: 2, title: "payme" },
  { id: 3, title: "click" },
];

type FormData = {
  fullName: string;
  phone: string;
  branch: string;
  address: string;
  comment: string;
  paymentType: string;
  deliveryType: string;
};

export default function Checkout() {
  const { cart, totalSum } = useCartStore((state) => state);
  const { addOrder } = useOrderStore();
  const { handleSubmit, setValue, control, register } = useForm<FormData>();
  const [isDelivery, setIsDelivery] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const router = useRouter();
  const loadingBarRef = useRef<LoadingBarRef | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define the mutation using React Query
  const mutation = useMutation(
    (orderData: OrderData) => createOrder(orderData),
    {
      onMutate: () => {
        loadingBarRef.current?.continuousStart();
      },
      onSuccess: (data) => {
        loadingBarRef.current?.complete();
        addOrder(data);

        if (
          data.paymentType.toLowerCase() === "click" ||
          data.paymentType.toLowerCase() === "payme"
        ) {
          window.location.href = data.paymentLink;
        } else {
          alert("Order created successfully!");
          router.push("/account");
        }
      },
      onError: (error) => {
        loadingBarRef.current?.complete();
        console.error("Failed to create order:", error);
        alert("Failed to create order, please try again.");
      },
    }
  );

  const handleDeliveryChange = (value: string) => {
    setIsDelivery(value === "Доставка");
    setValue("deliveryType", value);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const ordersItemsList = cart.map((item) => ({
      itemId: item.id,
      sizeId: item.sizeId ?? 0,
      quantity: item.quantity,
      collectionId: item.collectionId ?? 0,
    }));

    const orderData: OrderData = {
      fullName: data.fullName,
      branchId: parseInt(data.branch),
      address: data.address,
      addressLocationLink: `http://maps.google.com/?q=${encodeURIComponent(
        data.address
      )}`,
      distance: 5.0,
      phone: data.phone,
      comment: data.comment,
      isDelivery: data.deliveryType === "Доставка",
      isSoonDeliveryTime: false,
      scheduledDeliveryTime: new Date().toISOString(),
      longitude: longitude || 0.0,
      latitude: latitude || 0.0,
      deliverySum: 0.0,
      totalSum: totalSum(),
      paymentType: data.paymentType.toLowerCase(),
      returnUrl: "/",
      ordersItemsList: ordersItemsList,
    };

    mutation.mutate(orderData);
  };

  return (
    <section className="">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="py-2">
        <header className="flex flex-row justify-between items-center px-[104px] py-[21px] border-solid border-b-[1px] border-b-[#DFDFDF]">
          <Link href="/">
            <h1 className="text-[21px] font-medium text-[#454545]">
              Loris Parfume
            </h1>
          </Link>
          <Link href={`/cart`}>
            <BiBasket className="w-6 h-6 text-primary" />
          </Link>
        </header>
        <div className="relative flex px-16">
          <div className="flex flex-[6] flex-col gap-4 border-r-[1px] border-solid border-r-[#DFDFDF] p-10">
            <h1 className="flex flex-col text-[21px] font-medium text-[#454545]">
              Доставка
            </h1>
            <div>
              <div className="flex flex-col">
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <CustomDropdown
                    name="deliveryType"
                    options={options}
                    title="Тип доставки"
                    control={control}
                    onChange={handleDeliveryChange}
                  />
                  <YandexMap
                    onCoordinatesChange={(lat, lng) => {
                      setLatitude(lat);
                      setLongitude(lng);
                    }}
                  />

                  <CustomInput
                    {...register("fullName")}
                    type="text"
                    borders="rounded"
                    title="ФИО"
                  />
                  <CustomInput
                    {...register("phone")}
                    type="text"
                    borders="rounded"
                    title="Номер телефона"
                  />
                  <CustomInput
                    {...register("branch")}
                    type="text"
                    borders="rounded"
                    title="Филиал"
                  />
                  <CustomInput
                    {...register("address")}
                    type="text"
                    borders="rounded"
                    title="Адрес"
                  />
                  <CustomTextArea
                    {...register("comment")}
                    borders="rounded"
                    title="Комментарий"
                  />
                  <CustomDropdown
                    name="paymentType"
                    options={paymentOptions}
                    title="Тип оплаты"
                    control={control}
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#454545] p-[14px] font-semibold text-xl text-white rounded-[5px]"
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Processing..." : "Сделать оплату"}
                  </button>
                </form>
              </div>
            </div>

            <footer className="border-t border-solid border-t-[#DFDFDF] mt-16">
              <a href="#" className="mt-2 underline text-primary">
                Privacy
              </a>
            </footer>
          </div>
          <div className="flex flex-[4] p-10 h-[300px] sticky top-0 right-0 left-0">
            <div className="w-full flex flex-col gap-5">
              {cart.map((cartItem, index) => (
                <CheckoutCartItem
                  key={`${cartItem.id}-${cartItem.sizeId}-${cartItem.price}-${index}`}
                  title={cartItem.nameRu}
                  subtitle={cartItem.sizeNameRu}
                  price={cartItem.price}
                  quantity={cartItem.quantity}
                  image={cartItem.imagesList[0]}
                />
              ))}
              <div className="w-full flex flex-col gap-2">
                <div className="flex flex-row justify-between text-[19px] font-semibold text-[#454545]">
                  <p>Total</p>
                  <p>UZS {isMounted ? totalSum() : 0} сум</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
