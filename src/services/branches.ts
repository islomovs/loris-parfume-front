import { axiosInstance } from "@/utils/axiosInstance";

export interface ApiResponse {
  data: IBranchItem[];
}

export interface IBranchItem {
  id: number;
  name: string;
  phone: string;
  longitude: number;
  latitude: number;
  redirectTo: string;
}

export const fetchBranchesData = async () => {
  try {
    const response = await axiosInstance.post(`/api/v1/branches/all`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching branches data"
    );
  }
};
