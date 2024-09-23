import { axiosInstance } from "../utils/axiosInstance";

export const fetchPromoCodeDiscount = async (promoCode: string) => {
  const response = await axiosInstance.get(`/api/v1/promocodes/${promoCode}`);
  return response.data;
};
