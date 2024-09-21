import { axiosInstance } from "@/utils/axiosInstance";
import { ICategoryItem } from "./categories";

export interface CollectionsAndCategoriesData {
  collections: ICollectionItem[];
  categories: ICategoryItem[];
}

export interface ICollectionItem {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  descriptionUz: string;
  descriptionRu: string;
  bannerImage: string;
  collectionSlug: string;
  categoriesList: [
    {
      categoryId: number;
      categoryNameUz: string;
      categoryNameRu: string;
      categoryNameEng: string;
      categoryBannerImage: string;
    }
  ];
}

export const fetchCollectionsData = async (page: number) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/collections/all?page=${page}`
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching collections data"
    );
  }
};
