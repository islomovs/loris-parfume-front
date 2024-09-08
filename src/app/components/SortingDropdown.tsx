import React, { useState } from "react";

interface SortingDropdownProps {
  onSortChange: (sortOption: string) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sort by");

  const options = [
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
    { label: "Price: Low to High", value: "low-high" },
    { label: "Price: High to Low", value: "high-low" },
  ];

  const handleOptionClick = (option: any) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSortChange(option.value); // Pass the selected option to the parent component
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-[220px] h-12 rounded-[3px] border border-[#f0f0f0] text-[15px] font-medium text-[#454545] px-3"
      >
        {selectedOption}
        <svg
          className="ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition transform duration-200 ease-out z-10`}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="block px-4 py-2 text-sm text-[#454545] hover:underline w-full text-left"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortingDropdown;
