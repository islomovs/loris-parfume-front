import { axiosInstance } from "@/utils/axiosInstance";

export interface ApiResponse {
  data: IContactMessage[];
}

export interface IContactMessage {
  //   id: number;
  //   createdTime: string; // Use string for ISO date format
  fullName: string;
  email: string;
  phone: string;
  contactSource: string;
  message: string;
}

export const postB2b = async (data: IContactMessage) => {
  try {
    const response = await axiosInstance.post(`/api/v1/b2b/create`, data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching b2b data");
  }
};
