import React from "react";

interface IOrderDetailsItem {
  title: string;
  description: string;
  isDescriptionLink?: boolean; // Optional prop to render description as a link
}

export const OrderDetailsItem: React.FC<IOrderDetailsItem> = ({
  title,
  description,
  isDescriptionLink = false, // Default to false if not provided
}) => {
  return (
    <div className="flex flex-row justify-between my-1">
      <p className="text-[14px] font-normal text-[#454545] mr-5">{title}:</p>
      {isDescriptionLink ? (
        <a
          href={description}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium text-[#1c7ed6] break-words max-w-[400px] "
        >
          Pay for the order
        </a>
      ) : (
        <p className="text-[14px] font-medium text-[#454545] break-words max-w-[400px]">
          {description}
        </p>
      )}
    </div>
  );
};
