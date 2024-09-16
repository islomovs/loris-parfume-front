"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { CustomInput } from "@/app/components/CustomInput";
import { useRouter } from "next/navigation";
import {
  TLoginFormData,
  login,
  generateResetPasswordCode,
  verifyResetPasswordCode,
  resetPassword,
} from "@/services/authService";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"; // Import yup for conditional schemas
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import useCartStore from "@/services/store";
import { addToCart } from "@/services/cart";
import { useDisclosure } from "@chakra-ui/react";
import { VerificationModal } from "../../components/VerificationModal";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Define schemas
const loginSchema = yup.object({
  phone: yup.string().required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

const resetPasswordSchema = yup.object({
  phone: yup.string().required("Phone number is required"),
});

// Utility function to sanitize phone number
const sanitizePhoneNumber = (phone: string) => phone.replace(/^\+/, "");

export default function Login() {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>(""); // State for verification code
  const {
    register,
    handleSubmit,
    formState: { errors },
    unregister,
  } = useForm<TLoginFormData>({
    resolver: yupResolver(isResetPassword ? resetPasswordSchema : loginSchema),
  });

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { cart, clearCart } = useCartStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("common");

  const toggleResetPassword = () => {
    setIsResetPassword((prev) => !prev);
    setErrorMessage(null); // Clear error message when toggling states
    if (isResetPassword) {
      register("password"); // Register password field when not in reset mode
    } else {
      unregister("password"); // Unregister password field when in reset mode
    }
  };

  const onSubmit: SubmitHandler<TLoginFormData> = (data) => {
    const sanitizedPhone = sanitizePhoneNumber(data.phone); // Sanitize phone number
    setPhoneNumber(sanitizedPhone); // Save sanitized phone number
    if (isResetPassword) {
      loadingBarRef.current?.continuousStart(); // Start the loading bar
      generateResetCodeMutation.mutate(sanitizedPhone);
    } else {
      loadingBarRef.current?.continuousStart(); // Start the loading bar
      loginMutation.mutate({ ...data, phone: data.phone });
    }
  };

  const loginMutation = useMutation(login, {
    onSuccess: async (data) => {
      setErrorMessage(null);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (localStorage.getItem("token") === data.token) {
        await syncLocalCartWithServer();
        loadingBarRef.current?.complete(); // Complete the loading bar
        router.push("/");
      } else {
        console.error("Token was not stored correctly.");
        setErrorMessage("An error occurred while logging in.");
        loadingBarRef.current?.complete(); // Complete the loading bar
      }
    },
    onError: (error) => {
      console.error("Error during login:", error);
      setErrorMessage("Wrong login or password.");
      loadingBarRef.current?.complete(); // Complete the loading bar
    },
  });

  const generateResetCodeMutation = useMutation(generateResetPasswordCode, {
    onSuccess: () => {
      console.log("Reset code generated successfully!");
      setErrorMessage("");
      loadingBarRef.current?.complete(); // Complete the loading bar
      onOpen(); // Open verification modal for code entry
    },
    onError: (error) => {
      console.error("Failed to generate reset code:", error);
      setErrorMessage("Failed to generate reset code. Please try again.");
      loadingBarRef.current?.complete(); // Complete the loading bar
    },
  });

  const verifyResetCodeMutation = useMutation(
    ({ phone, code }: { phone: string; code: string }) =>
      verifyResetPasswordCode(phone, code),
    {
      onSuccess: () => {
        console.log("Code verified successfully!");
        handlePasswordReset(); // Proceed to reset the password
      },
      onError: (error) => {
        console.error("Failed to verify reset code:", error);
        setErrorMessage("Invalid reset code. Please try again.");
        loadingBarRef.current?.complete(); // Complete the loading bar
      },
    }
  );

  const resetPasswordMutation = useMutation(
    ({
      phone,
      code,
      newPassword,
      reNewPassword,
    }: {
      phone: string;
      code: string;
      newPassword: string;
      reNewPassword: string;
    }) => resetPassword(phone, code, newPassword, reNewPassword),
    {
      onSuccess: () => {
        console.log("Password reset successfully!");
        loadingBarRef.current?.complete(); // Complete the loading bar
        router.push("/"); // Redirect after password reset
      },
      onError: (error) => {
        console.error("Failed to reset password:", error);
        setErrorMessage("Failed to reset password. Please try again.");
        loadingBarRef.current?.complete(); // Complete the loading bar
      },
    }
  );

  const handleVerificationSubmit = (code: string) => {
    setVerificationCode(code); // Save the verification code
    loadingBarRef.current?.continuousStart(); // Start the loading bar
    verifyResetCodeMutation.mutate({
      phone: phoneNumber,
      code,
    });
  };

  const handlePasswordReset = () => {
    const newPassword = prompt("Enter new password:");
    const reNewPassword = prompt("Re-enter new password:");
    if (newPassword && reNewPassword) {
      resetPasswordMutation.mutate({
        phone: phoneNumber,
        code: verificationCode, // Use the saved verification code
        newPassword,
        reNewPassword,
      });
    } else {
      setErrorMessage("Passwords do not match. Please try again.");
      loadingBarRef.current?.complete(); // Complete the loading bar
    }
  };

  const handleResend = () => {
    loadingBarRef.current?.continuousStart(); // Start the loading bar
    generateResetCodeMutation.mutate(phoneNumber); // Use generateResetPasswordCode for resending
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

  return (
    <div className="flex flex-col justify-center items-center py-10 md:py-20 px-4 md:px-0">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md min-h-[400px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isResetPassword ? "reset-state" : "login-state"} // Ensure unique keys
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="uppercase font-normal text-center text-lg sm:text-xl tracking-[.2em] text-[#454545] mb-4">
              {isResetPassword
                ? `${t("account.login.titleR")}`
                : `${t("account.login.titleL")}`}
            </h1>
            <h2 className="text-[#454545] text-sm sm:text-[14px] text-center font-normal">
              {isResetPassword
                ? `${t("account.login.subtitleL")}`
                : `${t("account.login.subtitleR")}`}
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
              />
              {errors.phone && (
                <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            {!isResetPassword && (
              <div className="flex flex-col w-full sm:w-[400px]">
                <CustomInput
                  className="sm:w-[400px] w-full"
                  {...register("password")}
                  title={t("account.login.password")}
                  borders="no-rounded"
                  type="password"
                />
                {errors.password && (
                  <p className="text-sm sm:text-[14px] text-[#CB2B2B] mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={toggleResetPassword}
                  className="mt-1 text-sm sm:text-[14px] text-[#9d9d9d] font-normal self-end cursor-pointer hover:text-[#454545] transition-colors"
                >
                  {t("account.login.forgotPassword")}
                </button>
              </div>
            )}

            <AnimatedButton
              title={
                isResetPassword
                  ? t("account.login.sendCode")
                  : t("account.login.login")
              }
              variant="dark"
              width="w-full sm:w-[400px]"
              type="submit"
            />
          </motion.form>

          <p className="my-4 sm:my-6 text-[#9D9D9D] text-sm sm:text-[14px] font-normal">
            {isResetPassword ? (
              <>
                {t(`account.login.forgotQ`)}{" "}
                <button
                  onClick={toggleResetPassword}
                  className="text-[#454545] hover:text-[#454545]"
                >
                  {t(`account.login.backToLogin`)}
                </button>
              </>
            ) : (
              <>
                {t("account.login.regQ")}{" "}
                <a
                  href="/account/register"
                  className="text-[#454545] hover:text-[#454545]"
                >
                  {t("account.login.regGoToPage")}
                </a>
              </>
            )}
          </p>
        </AnimatePresence>
      </div>

      <VerificationModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleVerificationSubmit}
        errorMessage={errorMessage}
        handleResend={handleResend}
      />
    </div>
  );
}
