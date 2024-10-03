import { axiosInstance } from "@/utils/axiosInstance";

export interface ApiResponse {
  data: IBlog[];
}

export interface IBlog {
  id: number;
  createdTime: string;
  titleUz: string;
  titleRu: string;
  descriptionUz: string;
  descriptionRu: string;
  mainImage: string;
  isActive: boolean;
}

export const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/blogs/all`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching b2b data");
  }
};

export const getByIdBlog = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/blogs/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching b2b data");
  }
};
