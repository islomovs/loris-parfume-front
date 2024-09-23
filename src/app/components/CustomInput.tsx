"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "../../helpers/mergeFunction";
import { useTranslation } from "react-i18next";
import InputMask from "react-input-mask"; // Import InputMask for phone number formatting

interface ICustomInputProps {
  title: string;
  borders: "rounded" | "no-rounded";
  className?: string;
  type: "password" | "number" | "text";
  value?: string;
  disabled?: boolean;
  isPhoneNumber?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  isPromoCode?: boolean;
}

// Forwarding the ref correctly
export const CustomInput = forwardRef<
  HTMLInputElement | InputMask,
  ICustomInputProps
>(
  (
    {
      title,
      borders,
      className,
      type,
      value,
      disabled,
      isPhoneNumber,
      isPromoCode = false,
      onChange, // Include onChange in destructured props
      onBlur, // Include onBlur in destructured props
      name, // Include name prop for form handling
      ...rest
    },
    ref // ref forwarded here
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { t } = useTranslation("common");

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    // Ensure the correct input type based on isPhoneNumber and type prop
    const inputType = isPhoneNumber
      ? "text"
      : isPasswordVisible || type === "text"
      ? "text"
      : "password";

    const isPromoCoded = isPromoCode ? "pr-[22px]" : "pr-[40px] md:pr-[40px]";

    console.log("ISPROMOCDDE: ", isPromoCoded);

    return (
      <label
        htmlFor={title}
        className="form-group relative flex flex-col-reverse"
      >
        {/* Use InputMask if isPhoneNumber is true */}
        {isPhoneNumber ? (
          <InputMask
            id={title}
            ref={ref as React.Ref<InputMask>} // Use ref for InputMask
            className={cn(
              `${className} peer transition-all duration-300 border-none focus:border-none block h-[50px] outline outline-[#e3e3e3] py-[13.5px] pl-[11px] md:pl-[11px] pr-[40px] md:pr-[40px] focus:outline-2 focus:outline-primary placeholder-transparent pb-0 peer:focus:pb-[4px] peer:not(:placeholder-shown):pb-[4px]`,
              {
                "rounded-[5px]": borders === "rounded",
                "rounded-0": borders === "no-rounded",
              }
            )}
            mask="+\9\9\8 (99) 999-99-99" // Mask for Uzbek phone number format
            maskChar={null}
            placeholder=" "
            value={value}
            disabled={disabled}
            type={inputType}
            onChange={onChange} // Pass onChange handler here
            onBlur={onBlur} // Pass onBlur handler if needed
            {...rest} // Spread rest of the props
          />
        ) : (
          <input
            id={title}
            ref={ref as React.Ref<HTMLInputElement>} // Use ref for regular input
            className={cn(
              `${className} ${isPromoCoded} peer transition-all duration-300 border-none focus:border-none block h-[50px] outline outline-[#e3e3e3] py-[13.5px] pl-[11px] md:pl-[11px] focus:outline-2 focus:outline-primary placeholder-transparent pb-0 peer:focus:pb-[4px] peer:not(:placeholder-shown):pb-[4px]`,
              {
                "rounded-[5px]": borders === "rounded",
                "rounded-0": borders === "no-rounded",
              }
            )}
            type={inputType}
            placeholder=" "
            value={value}
            disabled={disabled}
            name={name} // Pass name for form handling
            onChange={onChange} // Pass onChange handler here
            onBlur={onBlur} // Pass onBlur handler if needed
            {...rest} // Spread rest of the props
          />
        )}

        {type === "password" && !isPhoneNumber && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-primary text-sm uppercase"
          >
            {isPasswordVisible
              ? t("account.login.hide")
              : t("account.login.show")}
          </button>
        )}

        <div className="absolute left-[11px] text-[#707070] text-xs top-1 transform transition-all duration-300 ease-in peer-placeholder-shown:top-[13.5px] peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-[0px] peer-focus:text-[#707070] peer:not(:placeholder-shown):top-1 peer:not(:placeholder-shown):text-xs peer:not(:placeholder-shown):-translate-y-[0px] peer:not(:placeholder-shown):text-primary">
          {title}
        </div>
      </label>
    );
  }
);

// Set display name for forwardRef component
CustomInput.displayName = "CustomInput";
