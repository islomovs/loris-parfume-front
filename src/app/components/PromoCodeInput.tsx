import React, { useState } from "react";
import { CustomInput } from "./CustomInput"; // Assuming you're using this component for inputs
import { useMutation } from "react-query";
import { fetchPromoCodeDiscount } from "../../services/promocode"; // Import the promo code API
import { message } from "antd";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem("token");
  const router = useRouter();
  const promoCodeMutation = useMutation(fetchPromoCodeDiscount, {
    onSuccess: (data) => {
      onApplyPromo(data.discountSum, data.discountPercent, promoCode);
      message.success(t("checkout.promoApplied"));
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
        message.error(t("checkout.promoNotFound"));
      } else if (error.response?.status === 409) {
        message.error(t("checkout.promoAlreadyUsed"));
      } else {
        message.error(t("checkout.invalidPromo"));
      }
    },
  });

  // Handle the "Apply" button click
  const handleApplyPromoCode = () => {
    if (!token) {
      onOpen();
    } else {
      if (promoCode.trim()) {
        // Remove spaces from the promo code string before sending
        const sanitizedPromoCode = promoCode.replace(/\s+/g, "").toUpperCase();
        console.log("SANITIZED: ", sanitizedPromoCode);
        promoCodeMutation.mutate(sanitizedPromoCode); // Apply sanitized promo code
      } else {
        message.warning(t("checkout.enterPromo"));
      }
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between gap-4 md:gap-4 py-5">
        {/* Promo code input field */}
        <CustomInput
          value={promoCode}
          type="text"
          borders="rounded"
          title={t("checkout.promocode")}
          onChange={(e) => setPromoCode(e.target.value)}
          isPromoCode={true}
        />
        {/* Apply button */}
        <div
          className="bg-[#F1F1F1] flex justify-center items-center cursor-pointer border-solid border border-[#DADADA] text-[#454545] w-full rounded-[5px] font-normal"
          onClick={handleApplyPromoCode}
        >
          {t("checkout.apply")}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("checkout.promocode_error_title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{t("checkout.promocode_error_text")}</ModalBody>

          <ModalFooter>
            <Button w={"100%"} colorScheme="red" mr={3} onClick={onClose}>
              {t("checkout.cancel_error_modal")}
            </Button>
            <Button
              onClick={() => {
                router.push("/account/register");
                onClose();
              }}
              w={"100%"}
              colorScheme="blue"
            >
              {t("checkout.ok_error_modal")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromoCodeInput;
