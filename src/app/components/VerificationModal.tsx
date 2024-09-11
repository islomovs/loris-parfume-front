import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleResend: () => void;
  onSubmit: (verificationCode: string) => void;
  errorMessage: string | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  handleResend,
  onSubmit,
  errorMessage,
}) => {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Reset the countdown and disable the resend button when the modal opens
    if (isOpen) {
      setIsResendDisabled(true);
      setCountdown(59);
    }

    // Start countdown timer when the resend button is disabled
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup the interval when the component unmounts or modal closes
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      } else {
        onSubmit(newCode.join(""));
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleResendClick = () => {
    handleResend();
    setIsResendDisabled(true);
    setCountdown(30); // Reset countdown after resend is clicked
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius={0}
        maxW="90vw"
        className="mx-4 sm:mx-0 sm:w-fit"
      >
        <ModalHeader color="#454545" className="text-center">
          Verification Required
        </ModalHeader>
        <ModalCloseButton borderRadius={0} />
        <ModalBody>
          <div>
            <p className="text-sm sm:text-[16px] text-[#454545] text-center">
              Please enter the code sent to your number
            </p>
            <div className="flex flex-row justify-between my-5 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  className="w-8 h-12 sm:w-10 sm:h-[50px] text-xl sm:text-2xl text-center peer transition-all duration-300 focus:border-none block outline outline-2 outline-[#e3e3e3] py-2 sm:py-[13.5px] px-2 sm:px-[11px] focus:outline-2 focus:outline-primary text-[#9D9D9D]"
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            {errorMessage && (
              <div className="text-red-500 text-center mt-2 text-sm sm:text-base">
                {errorMessage}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter
          justifyContent="space-between"
          display="flex"
          width="100%"
          className="flex-col sm:flex-row gap-4 sm:gap-0"
        >
          <div className="w-full flex flex-col justify-start items-start text-sm sm:text-[14px] font-normal text-[#9d9d9d]">
            <div className="flex flex-row">
              Didn&apos;t receive code?
              <Button
                onClick={handleResendClick}
                isDisabled={isResendDisabled}
                variant="link"
                fontSize="sm"
                fontWeight="normal"
                color="#454545"
                ml="2"
              >
                Resend
              </Button>
            </div>
            {isResendDisabled && (
              <Text fontSize="xs" color="#454545">
                Available in {countdown} seconds
              </Text>
            )}
          </div>
          <Button
            onClick={onClose}
            fontSize="sm"
            fontWeight="semibold"
            color="white"
            bg="#454545"
            px="4"
            py="2"
            borderRadius="0"
            _hover={{ bg: "#5a5a5a" }}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
