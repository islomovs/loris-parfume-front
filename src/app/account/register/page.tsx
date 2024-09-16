"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatedButton } from "../../../app/components/AnimatedButton";
import { CustomInput } from "../../../app/components/CustomInput";
import {
  register as regApi,
  TRegisterFormData,
  sendVerificationCode as sendVerificationCodeApi,
  resendVerificationCode,
} from "../../../services/authService";
import { useMutation } from "react-query";
import { useDisclosure } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../utils/schemas";
import { VerificationModal } from "../../components/VerificationModal";
import useCartStore from "@/services/store";
import { addToCart } from "@/services/cart";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useTranslation } from "react-i18next";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cart, clearCart } = useCartStore();
  const { t } = useTranslation("common");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN VALUE: ", token, " TYPE: ", typeof token);

    if (token && token !== "undefined" && token !== "") {
      syncLocalCartWithServer();
      router.push("/account");
    }
  }, [router]);

  const registrationMutation = useMutation(regApi, {
    onSuccess: (data) => {
      console.log("Successfully Registered!", data);
      setErrorMessage(null);
      onOpen(); // Open the verification modal
      loadingBarRef.current?.complete(); // Complete the loading bar when registration is successful
    },
    onError: (error) => {
      console.error("Error during registration:", error);
      setErrorMessage(
        "This phone number is already linked to an account. If this account is yours, you can reset your password"
      );
      loadingBarRef.current?.complete(); // Complete the loading bar even on error
    },
  });

  const sendVerificationCodeMutation = useMutation(
    ({
      phoneNumber,
      verificationCode,
    }: {
      phoneNumber: string;
      verificationCode: string;
    }) => sendVerificationCodeApi(phoneNumber, verificationCode),
    {
      onSuccess: async (data) => {
        console.log("Verification code sent successfully!", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (localStorage.getItem("token") === data.token) {
          // Synchronize local cart with the server
          await syncLocalCartWithServer();

          loadingBarRef.current?.complete();
          router.push("/");
        } else {
          console.error("Token was not stored correctly.");
          setErrorMessage("An error occurred while logging in.");
          loadingBarRef.current?.complete();
        }
      },
      onError: (error) => {
        console.error("Failed to send verification code:", error);
        setErrorMessage("Failed to send verification code. Please try again.");
        loadingBarRef.current?.complete(); // Complete the loading bar even on error
      },
    }
  );

  const resendVerificationCodeMutation = useMutation(
    ({ phoneNumber }: { phoneNumber: string }) =>
      resendVerificationCode(phoneNumber),
    {
      onSuccess: (data) => {
        console.log("Verification code resent successfully!", data);
        loadingBarRef.current?.complete(); // Complete the loading bar
      },
      onError: (error) => {
        console.error("Failed to resend verification code:", error);
        setErrorMessage(
          "Failed to resend verification code. Please try again."
        );
        loadingBarRef.current?.complete(); // Complete the loading bar even on error
      },
    }
  );

  const onSubmit: SubmitHandler<TRegisterFormData> = (data) => {
    loadingBarRef.current?.continuousStart(); // Start the loading bar when submitting the form
    setPhoneNumber(data.phone);
    registrationMutation.mutate(data);
  };

  const handleVerificationSubmit = (verificationCode: string) => {
    loadingBarRef.current?.continuousStart(); // Continue the loading bar when submitting the verification code
    sendVerificationCodeMutation.mutate({
      phoneNumber,
      verificationCode,
    });
  };

  const handleResend = () => {
    loadingBarRef.current?.continuousStart(); // Start the loading bar when resending the verification code
    resendVerificationCodeMutation.mutate({ phoneNumber });
  };

  const syncLocalCartWithServer = async () => {
    try {
      for (const item of cart) {
        await addToCart(item); // Send each cart item to the server
      }
      clearCart(); // Clear local cart after synchronization
    } catch (error) {
      console.error("Error syncing cart with server:", error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 md:py-20 px-4 md:px-0">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="uppercase font-normal text-center text-lg sm:text-xl tracking-[.2em] text-[#454545] mb-4">
          {t("account.register.title")}
        </h1>
        <h2 className="text-[#454545] text-sm sm:text-[14px] text-center font-normal">
          {t("account.register.subtitle")}
        </h2>
      </div>

      {errorMessage && (
        <div className="px-4 py-2 sm:px-5 sm:py-[10px] mb-4 sm:mb-5 bg-[#E4C4C4] w-full sm:w-[400px] text-center">
          <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
            {errorMessage}
          </p>
        </div>
      )}

      <VerificationModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleVerificationSubmit}
        errorMessage={errorMessage}
        handleResend={handleResend}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4 w-full sm:max-w-[400px]"
      >
        <div className="w-full">
          <CustomInput
            {...register("fullName")}
            className="w-full"
            title={t("account.register.fullName")}
            borders="no-rounded"
            type="text"
          />
          {errors.fullName && (
            <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <CustomInput
            {...register("phone")}
            className="w-full"
            title={t("account.register.phoneNumber")}
            borders="no-rounded"
            type="text"
          />
          {errors.phone && (
            <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <CustomInput
            {...register("password")}
            className="w-full"
            title={t("account.register.password")}
            borders="no-rounded"
            type="password"
          />
          {errors.password && (
            <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <CustomInput
            {...register("rePassword")}
            className="w-full"
            title={t("account.register.repassword")}
            borders="no-rounded"
            type="password"
          />
          {errors.rePassword && (
            <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
              {errors.rePassword.message}
            </p>
          )}
        </div>
        <AnimatedButton
          title={t("account.register.createAccount")}
          variant="dark"
          width="w-full"
          type="submit"
        />
      </form>
    </div>
  );
}
