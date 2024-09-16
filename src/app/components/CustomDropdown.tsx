import { useState, forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import Image from "next/image"; // Import Next.js Image component
import { useTranslation } from "react-i18next";

type Option = {
  id: number;
  title: string;
  icon?: string; // Use string type for URL or path to image
};

interface ICustomDropdownProps<T extends FieldValues> {
  title: string;
  options: Option[];
  name: Path<T>;
  control: Control<T>;
  onChange?: (value: string) => void; // Optional external onChange for additional side effects
}

export const CustomDropdown = forwardRef<
  HTMLDivElement,
  ICustomDropdownProps<any>
>(({ title, options, name, control, onChange }, ref) => {
  const {
    field: { onChange: formOnChange, onBlur, value, ref: inputRef },
  } = useController({
    name,
    control,
  });

  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");
  const selectOption = (option: string) => {
    formOnChange(option); // Update form state via react-hook-form
    if (onChange) onChange(option); // Call the external onChange if provided
    setIsOpen(false); // Close dropdown
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="form-group relative flex flex-col-reverse">
      <div className="relative" ref={ref}>
        <div
          className="peer transition-all duration-300 border-none focus:border-none flex align-middle h-[50px] w-full outline outline-[#e3e3e3] px-[11px] rounded-[5px] focus:outline-2 focus:outline-primary placeholder-transparent peer:focus:pb-[4px] peer:not(:placeholder-shown):pb-[4px] appearance-none bg-white text-left justify-between items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          <span
            id="dropdownSelected"
            className={`text-[#707070] pt-[10px] ${
              value ? "text-primary" : ""
            }`}
          >
            {value || t("checkout.selectOption")}
          </span>
          <FaChevronDown className="text-[#707070]" />
        </div>
        <ul
          className={`absolute left-0 top-full mt-1 w-full rounded-[4px] bg-white shadow-lg transition-all duration-300 ease-in-out z-10 ${
            isOpen ? "max-h-60" : "max-h-0"
          } overflow-hidden`}
        >
          {options.map((option) => (
            <li
              key={option.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
              onClick={() => selectOption(option.title)}
            >
              {option.icon && (
                <Image
                  src={option.icon}
                  alt={option.title}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              )}
              <span>{option.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <label className="absolute left-[11px] text-[#707070] text-xs top-1 transform transition-all duration-300 ease-in peer-placeholder-shown:top-[13.5px] peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-[0px] peer-focus:text-[#707070] peer-not(:placeholder-shown):top-1 peer-not(:placeholder-shown):text-xs peer-not(:placeholder-shown):-translate-y-[0px] peer-not(:placeholder-shown):text-primary">
        {title}
      </label>
    </div>
  );
});

CustomDropdown.displayName = "CustomDropdown";
