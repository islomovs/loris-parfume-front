"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  TAuthFormData,
  auth,
  resendVerificationCode,
  sendVerificationCode,
} from "@/services/authService";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import useCartStore from "@/services/store";
import { addToCart } from "@/services/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { VerificationModal } from "@/app/components/VerificationModal";

const sanitizePhoneNumber = (phone: string) => {
  // Remove any character that is not a digit or '+'
  const sanitizedPhone = phone.replace(/[^\d]/g, "");

  // Check if the phone number starts with a '+'
  return sanitizedPhone.startsWith("+") ? sanitizedPhone : `+${sanitizedPhone}`;
};

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const { cart, clearCart } = useCartStore();
  const { t } = useTranslation("common");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const authSchema = yup.object({
    phone: yup.string().required(t("validation.phoneNumberRequired")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm<TAuthFormData>({
    resolver: yupResolver(authSchema),
  });

  const onSubmit: SubmitHandler<TAuthFormData> = (data) => {
    setPhoneNumber(data.phone);
    const sanitizedPhone = sanitizePhoneNumber(data.phone);
    loadingBarRef.current?.continuousStart();

    loginMutation.mutate({ phone: sanitizedPhone });
  };

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (localStorage.getItem("token") === data.token) {
          await syncLocalCartWithServer();

          loadingBarRef.current?.complete();
          router.push("/");
        } else {
          console.error("Token was not stored correctly.");
          setErrorMessage("An error occurred while logging in.");
          loadingBarRef.current?.complete();
        }
      },
      onError: (error: any) => {
        if (error.isAxiosError) {
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
        console.error("Failed to resend verification code:", error);
        setErrorMessage(t("account.authorization.resentError"));
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
  const phone = watch("phone", "");

  return (
    <div className="flex flex-col justify-center items-center py-10 md:py-20 px-4 md:px-0">
      <LoadingBar color="#000000" ref={loadingBarRef} />
      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md min-h-[400px] text-center">
        <VerificationModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleVerificationSubmit}
          errorMessage={errorMessage}
          handleResend={handleResend}
        />
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
              {t("account.authorization.title")}
            </h1>
            <h2 className="text-[#454545] text-sm sm:text-[14px] text-center font-normal">
              {t("account.authorization.subtitle")}
            </h2>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
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
              <PhoneInput
                country={"uz"} // Default country (e.g., Uzbekistan)
                value={phone} // Bind the phone value
                onChange={(e: any) => setValue("phone", e)}
                enableSearch={false} // Enable search for countries
                placeholder="Enter phone number"
                inputStyle={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "0px",
                  border: "1px solid #e3e3e3",
                  outline: "1px solid #e3e3e3", // General outline
                  paddingTop: "13.5px",
                  paddingBottom: "13.5px",
                  outlineWidth: "2px",
                  transition: "all 0.3s",
                }}
                dropdownStyle={{
                  textAlign: "left",
                }}
              />
              {errors.phone && (
                <p className="text-sm text-start sm:text-[14px] text-[#CB2B2B] mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <AnimatedButton
              title={t("account.authorization.login")}
              variant="dark"
              width="w-full sm:w-[400px]"
              type="submit"
            />
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
