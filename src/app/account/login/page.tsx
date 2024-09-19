"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { CustomInput } from "@/app/components/CustomInput";
import { useRouter } from "next/navigation";
import { TLoginFormData, login } from "@/services/authService";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import useCartStore from "@/services/store";
import { addToCart } from "@/services/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { message } from "antd";

// Utility function to sanitize phone number
const sanitizeLoginPhoneNumber = (phone: string) =>
  phone.replace(/[^\d+]/g, "");

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const { cart, clearCart } = useCartStore();
  const { t } = useTranslation("common");

  // Schema validation for form
  const loginSchema = yup.object({
    phone: yup
      .string()
      .matches(
        /^\+998 \(\d{2}\) \d{3}-\d{2}-\d{2}$/,
        t("validation.phoneFormat")
      )
      .required(t("validation.phoneNumberRequired")),
    password: yup
      .string()
      .min(8, t("validation.passwordMinLength"))
      .required(t("validation.passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Form submit handler
  const onSubmit: SubmitHandler<TLoginFormData> = (data) => {
    const sanitizedLoginPhone = sanitizeLoginPhoneNumber(data.phone);
    loadingBarRef.current?.continuousStart(); // Start the loading bar

    loginMutation.mutate({ ...data, phone: sanitizedLoginPhone });
  };

  const loginMutation = useMutation(login, {
    onSuccess: async (data) => {
      setErrorMessage(null);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (localStorage.getItem("token") === data.token) {
        await syncLocalCartWithServer();
        loadingBarRef.current?.complete();
        message.success(t("account.login.loginSuccess"));
        router.push("/");
      } else {
        console.error("Token was not stored correctly.");
        setErrorMessage("An error occurred while logging innnnn.");
        loadingBarRef.current?.complete();
      }
    },
    onError: (error: any) => {
      if (error.isAxiosError) {
        console.error("ERRROR MESSAGE: ", error);
        if (error.response?.status === 400) {
          setErrorMessage(t("account.login.wrongLoginOrPassword"));
        } else if (error.response?.status === 404) {
          setErrorMessage(t("account.login.errorNotFound"));
        } else {
          setErrorMessage(`Failed: ${error.response?.data}`);
        }
      } else {
        console.error("Non-Axios error:", error);
      }
      loadingBarRef.current?.complete();
    },
  });

  const syncLocalCartWithServer = async () => {
    try {
      for (const item of cart) {
        await addToCart(item);
      }
      clearCart();
    } catch (error) {
      console.error("Error syncing cart with server:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 md:py-20 px-4 md:px-0">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md min-h-[400px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key="login-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="uppercase font-normal text-center text-lg sm:text-xl tracking-[.2em] text-[#454545] mb-4">
              {t("account.login.titleL")}
            </h1>
            <h2 className="text-[#454545] text-sm sm:text-[14px] text-center font-normal">
              {t("account.login.subtitleL")}
            </h2>
          </motion.div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 sm:px-5 sm:py-[10px] mb-4 sm:mb-5 bg-[#E4C4C4] w-full sm:w-[400px] text-center"
            >
              <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
                {errorMessage}
              </p>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full sm:w-[400px]">
              <CustomInput
                className="sm:w-[400px] w-full"
                {...register("phone")}
                title={t("account.login.phoneNumber")}
                borders="no-rounded"
                type="text"
                isPhoneNumber={true}
              />
              {errors.phone && (
                <p className="text-sm text-start sm:text-[14px] text-[#CB2B2B] mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full sm:w-[400px]">
              <CustomInput
                className="sm:w-[400px] w-full"
                {...register("password")}
                title={t("account.login.password")}
                borders="no-rounded"
                type="password"
              />
              {errors.password && (
                <p className="text-sm text-start sm:text-[14px] text-[#CB2B2B] mt-1">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => router.push("/account/reset-password")}
                className="mt-1 text-sm sm:text-[14px] text-[#9d9d9d] font-normal self-end cursor-pointer hover:text-[#454545] transition-colors"
              >
                {t("account.login.forgotPassword")}
              </button>
            </div>

            <AnimatedButton
              title={t("account.login.login")}
              variant="dark"
              width="w-full sm:w-[400px]"
              type="submit"
            />
          </motion.form>

          <p className="my-4 sm:my-6 text-[#9D9D9D] text-sm sm:text-[14px] font-normal">
            {t("account.login.regQ")}{" "}
            <a
              href="/account/register"
              className="text-[#454545] hover:text-[#454545]"
            >
              {t("account.login.regGoToPage")}
            </a>
          </p>
        </AnimatePresence>
      </div>
    </div>
  );
}
