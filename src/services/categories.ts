import { axiosInstance } from "@/utils/axiosInstance";

export interface ICategoryItem {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  bannerImage: string;
  collectionId: number;
  collectionNameUz: string;
  collectionNameRu: string;
  collectionNameEng: string;
}

export const fetchCategoriesData = async (page: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/categories/all?page=${page}`
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching categories data"
    );
  }
};
