import { axiosInstance } from "@/utils/axiosInstance";

export interface ApiResponse {
  content: IBranchItem[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface IBranchItem {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  redirectTo: string;
}

export const fetchBranchesData = async (page: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/branches/all?page=${page}`
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching branches data"
    );
  }
};
