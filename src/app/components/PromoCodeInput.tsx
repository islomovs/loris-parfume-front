import React, { useState } from "react";
import { CustomInput } from "./CustomInput"; // Assuming you're using this component for inputs
import { useMutation } from "react-query";
import { fetchPromoCodeDiscount } from "../../services/promocode"; // Import the promo code API
import { message } from "antd";
import { useTranslation } from "react-i18next";

interface PromoCodeInputProps {
  onApplyPromo: (
    discountSum: number,
    discountPercent: number,
    promoCode: string
  ) => void;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApplyPromo }) => {
  const { t } = useTranslation("common");
  const [promoCode, setPromoCode] = useState<string>("");

  const promoCodeMutation = useMutation(fetchPromoCodeDiscount, {
    onSuccess: (data) => {
      onApplyPromo(data.discountSum, data.discountPercent, promoCode);
      message.success(t("checkout.promoApplied"));
    },
    onError: () => {
      message.error(t("checkout.invalidPromo"));
    },
  });

  // Handle the "Apply" button click
  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      // Remove spaces from the promo code string before sending
      const sanitizedPromoCode = promoCode.replace(/\s+/g, "").toUpperCase();
      console.log("SANITIZED: ", sanitizedPromoCode);
      promoCodeMutation.mutate(sanitizedPromoCode); // Apply sanitized promo code
    } else {
      message.warning(t("checkout.enterPromo"));
    }
  };

  return (
    <div className="flex flex-row justify-between py-5">
      {/* Promo code input field */}
      <CustomInput
        value={promoCode}
        type="text"
        borders="rounded"
        title={t("checkout.promocode")}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      {/* Apply button */}
      <div
        className="bg-[#F1F1F1] flex justify-center items-center cursor-pointer border-solid border border-[#DADADA] text-[#454545] px-1 md:px-[14px] rounded-[5px] font-normal"
        onClick={handleApplyPromoCode}
      >
        {t("checkout.apply")}
      </div>
    </div>
  );
};

export default PromoCodeInput;
