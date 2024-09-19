"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomInput } from "@/app/components/CustomInput";
import { useRouter } from "next/navigation";
import {
  TResetPasswordFormData,
  generateResetPasswordCode,
  verifyResetPasswordCode,
  resetPassword,
} from "@/services/authService";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useDisclosure } from "@chakra-ui/react";
import { VerificationModal } from "../../components/VerificationModal";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { NewPasswordForm } from "@/app/components/NewPasswordForm";

// Utility function to sanitize phone number
const sanitizePhoneNumber = (phone: string) => phone.replace(/[^\d]/g, "");

export default function ResetPassword() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [reNewPassword, setreNewPassword] = useState<string>("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("common");

  const resetPasswordSchema = yup.object({
    phone: yup.string().required(t("validation.phoneNumber")),
  });

  // const schema = isCodeVerified ? resetPasswordSchema : newResetPasswordSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  // Form submit handler
  const onSubmit: SubmitHandler<TResetPasswordFormData> = (data) => {
    const sanitizedPhone = sanitizePhoneNumber(data.phone);
    setPhoneNumber(sanitizedPhone);

    loadingBarRef.current?.continuousStart();
    generateResetCodeMutation.mutate(sanitizedPhone);
  };

  const generateResetCodeMutation = useMutation(generateResetPasswordCode, {
    onSuccess: () => {
      setErrorMessage("");
      loadingBarRef.current?.complete();
      message.success(t("account.login.codeSentSuccess"));
      onOpen();
    },
    onError: (error: any) => {
      if (error.isAxiosError) {
        if (error.response?.status === 404) {
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

  const verifyResetCodeMutation = useMutation(
    (params: { phone: string; code: string }) =>
      verifyResetPasswordCode(params.phone, params.code),
    {
      onSuccess: () => {
        message.success(t("account.login.codeVerifiedSuccess"));
        setIsCodeVerified(true);
        loadingBarRef.current?.complete();
        onClose();
      },
      onError: (error) => {
        console.error("Failed to verify reset code:", error);
        message.error(t("account.login.invalidResetCode"));
        loadingBarRef.current?.complete();
      },
    }
  );

  const handleVerificationSubmit = (code: string) => {
    setVerificationCode(code);
    loadingBarRef.current?.continuousStart();
    verifyResetCodeMutation.mutate({
      phone: phoneNumber,
      code,
    });
  };

  const handleResend = () => {
    loadingBarRef.current?.continuousStart();
    generateResetCodeMutation.mutate(phoneNumber);
  };

  const handleResetPassword = (data: {
    newPassword: string;
    reNewPassword: string;
  }) => {
    resetPasswordMutation.mutate({
      phone: phoneNumber,
      code: verificationCode,
      newPassword: data.newPassword,
      reNewPassword: data.reNewPassword,
    });
  };

  const resetPasswordMutation = useMutation(
    (params: {
      phone: string;
      code: string;
      newPassword: string | undefined;
      reNewPassword: string | undefined;
    }) =>
      resetPassword(
        params.phone,
        params.code,
        params.newPassword,
        params.reNewPassword
      ),
    {
      onSuccess: () => {
        message.success(t("account.login.passwordResetSuccess"));
        loadingBarRef.current?.complete();
        router.push("/account/login");
      },
      onError: (error) => {
        console.error("Failed to reset password:", error);
        setErrorMessage("Failed to reset password. Please try again.");
        loadingBarRef.current?.complete();
      },
    }
  );

  return (
    <div className="flex flex-col justify-center items-center py-10 md:py-20 px-4 md:px-0">
      <LoadingBar color="#87754f" ref={loadingBarRef} />
      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md min-h-[400px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={isCodeVerified ? "code-verified" : "reset-state"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="uppercase font-normal text-center text-lg sm:text-xl tracking-[.2em] text-[#454545] mb-4">
              {t("account.login.titleR")}
            </h1>
            <h2 className="text-[#454545] text-sm sm:text-[14px] text-center font-normal">
              {isCodeVerified
                ? t("account.login.subtitleC")
                : t("account.login.subtitleR")}
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
        </AnimatePresence>
        {!isCodeVerified ? (
          <AnimatePresence>
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
              <AnimatedButton
                title={t("account.login.sendCode")}
                variant="dark"
                width="w-full sm:w-[400px]"
                type="submit"
              />
            </motion.form>
          </AnimatePresence>
        ) : (
          <NewPasswordForm onPasswordChange={handleResetPassword} />
        )}
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
