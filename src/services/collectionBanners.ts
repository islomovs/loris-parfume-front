import { axiosInstance } from "../utils/axiosInstance";
import { ICategoryItem } from "./categories";

export interface ICollectionBanner {
  id: number;
  titleUz: string;
  titleRu: string;
  titleEng: string;
  redirectTo: string;
  imageNameUz: string;
  imageNameRu: string;
  imageNameEng: string;
  isRecommendedInMainPage: boolean;
  categoriesList: [
    {
      categoryId: number;
      categoryIsRecommendedInMainPage: boolean;
    }
  ];
}

export interface IBanner {
  id: number;
  desktopImageNameUz: string;
  desktopImageNameRu: string;
  desktopImageNameEng: string;
  mobileImageNameUz: string;
  mobileImageNameRu: string;
  mobileImageNameEng: string;
  isActive: true;
  redirectTo: string;
  titleEng: string;
  titleRu: string;
  titleUz: string;
}

export const fetchCollectionBannersData = async (page: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/collection-banners/all?page=${page}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch banners info:", err);
  }
};

export const fetchMainBannersData = async (page: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/banners/all?page=${page}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch banners info:", err);
  }
};
