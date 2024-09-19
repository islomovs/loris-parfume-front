import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import { TResetNewPasswordFormData } from "@/services/authService";
import { AnimatedButton } from "./AnimatedButton";
import { CustomInput } from "./CustomInput";

interface INewPasswordFormProps {
  onPasswordChange: (data: {
    newPassword: string;
    reNewPassword: string;
  }) => void;
}

export const NewPasswordForm: React.FC<INewPasswordFormProps> = ({
  onPasswordChange,
}) => {
  const { t } = useTranslation("common");
  const newResetPasswordSchema = yup.object({
    newPassword: yup
      .string()
      .min(8, t("validation.passwordMinLength"))
      .required(t("validation.passwordRequired")),
    reNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], t("validation.passwordsMatch"))
      .required(t("validation.rePasswordRequired")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newResetPasswordSchema),
  });

  const onSubmit: SubmitHandler<TResetNewPasswordFormData> = (data) => {
    console.log("Form Data: ", data);
    onPasswordChange({
      newPassword: data.newPassword,
      reNewPassword: data.reNewPassword,
    });
    // loadingBarRef.current?.continuousStart(); // Start the loading bar
  };

  return (
    <AnimatePresence>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 items-center justify-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <>
          <div className="w-full sm:w-[400px]">
            <CustomInput
              className="sm:w-[400px] w-full"
              {...register("newPassword")}
              title={t("account.login.newPassword")}
              borders="no-rounded"
              type="password"
            />
            {errors.newPassword && (
              <p className="text-sm text-start sm:text-[14px] text-[#CB2B2B] mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="w-full sm:w-[400px]">
            <CustomInput
              className="sm:w-[400px] w-full"
              {...register("reNewPassword")}
              title={t("account.login.reNewPassword")}
              borders="no-rounded"
              type="password"
            />
            {errors.reNewPassword && (
              <p className="text-sm text-start sm:text-[14px] text-[#CB2B2B] mt-1">
                {errors.reNewPassword.message}
              </p>
            )}
          </div>
          <AnimatedButton
            title={t("account.login.titleR")}
            variant="dark"
            width="w-full sm:w-[400px]"
            type="submit"
          />
        </>
      </motion.form>
    </AnimatePresence>
  );
};
