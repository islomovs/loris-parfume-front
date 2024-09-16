import { Image, Badge } from "antd";
import { useTranslation } from "react-i18next";

export const CheckoutCartItem: React.FC<{
  title?: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image: string;
  discountedTotal?: number; // Accept the discounted total prop
  isOrderHistory?: boolean;
}> = ({
  title,
  subtitle,
  price,
  quantity,
  image,
  discountedTotal,
  isOrderHistory = false,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation("common");

  // Determine if a discount is applied by comparing the original total with the discounted total
  let originalTotal = 0;
  if (isOrderHistory) {
    originalTotal = price;
  } else {
    originalTotal = price * quantity;
  }
  const isDiscountApplied = originalTotal !== discountedTotal;
  return (
    <div className="flex flex-row items-center">
      <Badge count={quantity} color="#0000008F" offset={[-6, 0]}>
        <Image
          width={64}
          height={64}
          src={`${baseUrl}/${image}`}
          preview={false}
          alt="cart item"
          className="border border-[#DADADA] object-cover border-solid rounded-[5px]"
        />
      </Badge>
      <div className="flex-1 flex flex-col justify-center pl-[14px]">
        <h1 className="text-[14px] font-normal">{title}</h1>
        <p className="text-xs font-normal text-[#0000008F] my-1">
          {!isOrderHistory ? (
            <>{`${Number(price).toFixed(2)} ${t("productDetails.sum")}`}</>
          ) : (
            " "
          )}
        </p>
        <p className="text-xs font-normal text-[#0000008F]">{subtitle}</p>
      </div>
      <div className="flex flex-col justify-center items-center pl-[14px]">
        {isDiscountApplied ? (
          <>
            <p className="text-[12px] font-normal line-through text-[#0000008F]">
              {originalTotal.toFixed(2)} {t("productDetails.sum")}
            </p>
            <p className="text-[14px] font-bold text-red-500">
              {Number(discountedTotal).toFixed(2)} {t("productDetails.sum")}
            </p>
          </>
        ) : (
          <p className="text-[14px] font-normal">
            {!isOrderHistory ? originalTotal.toFixed(2) : price}{" "}
            {t("productDetails.sum")}
          </p>
        )}
      </div>
    </div>
  );
};
