import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

export interface CatalogueApiResponse {
  data: ICatalogueItem[];
}

export interface ICatalogueItem {
  id: number;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  fileUz: string;
  fileRu: string;
  fileEng: string;
}

export const fetchCataloguesData = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/catalogues/all`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching catalogues  data"
    );
  }
};
