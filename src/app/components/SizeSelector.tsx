import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { ISizeItem } from "../../services/products";

export function SizeSelector({
  options,
  selectedOption,
  onSelect,
}: {
  options: ISizeItem[];
  selectedOption: string;
  onSelect: (
    option: string,
    price: number,
    sizeId: number,
    sizeName: string
  ) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="form-group relative flex flex-col-reverse mb-4">
      <button
        className="transition-all duration-300 flex align-middle h-[50px] w-full outline outline-[#e3e3e3] px-[11px] focus:outline-primary placeholder-transparent bg-white text-left justify-between items-center"
        onClick={toggleDropdown}
      >
        <span className="text-[#707070]">
          {"Size: "}
          {selectedOption || "Select an option"}
        </span>
        <FaChevronDown className="text-[#707070]" />
      </button>
      <ul
        className={`absolute left-0 top-full mt-1 w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-10 ${
          isOpen ? "max-h-60" : "max-h-0"
        } overflow-hidden`}
      >
        {options.map((option) => (
          <li
            key={option.sizeId}
            className="px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => {
              onSelect(
                option.sizeNameRu,
                option.price,
                option.sizeId,
                option.sizeNameRu
              );
              setIsOpen(false);
            }}
          >
            {option.sizeNameRu}
          </li>
        ))}
      </ul>
    </div>
  );
}
