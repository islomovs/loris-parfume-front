import { axiosInstance } from "../utils/axiosInstance";
import { ICollectionItem } from "./collections";

export interface ISizeItem {
  sizeId: number;
  sizeNameUz: string;
  sizeNameRu: string;
  sizeNameEng: string;
  quantity: number;
  price: number;
  discountPercent: number;
}

export interface IProduct {
  id: number;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  quantity: number;
  price: string;
  discountPercent: number;
  imagesList: string[];
  categoryId: number | null;
  categoryNameUz: string | null;
  categoryNameRu: string | null;
  categoryNameEng: string | null;
  collectionsItemsList: ICollectionItem[];
  sizesItemsList: ISizeItem[];
}

export interface IData {
  content: any[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/items/${slug}`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching product data"
    );
  }
};

export const fetchProductsData = async (
  page: number,
  collectionSlug: string,
  categorySlug?: string,
  sortOption?: string,
  search?: string
) => {
  try {
    let query = `/api/v1/items/all?page=${page}`;

    if (collectionSlug) {
      query += `&collectionSlug=${collectionSlug}`;
    }

    if (categorySlug) {
      query += `&categorySlug=${categorySlug}`;
    }

    const sortOptionsMap: { [key: string]: any } = {
      "a-z": { firstA: true },
      "z-a": { firstZ: true },
      "low-high": { firstCheap: true },
      "high-low": { firstExpensive: true },
    };

    const sortParams = sortOptionsMap[sortOption || ""];

    // Add search parameter if provided
    const requestBody = {
      ...sortParams,
      ...(search ? { search } : {}), // Include search in request body if present
    };

    const response = await axiosInstance.post(query, requestBody);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching products data"
    );
  }
};

export const fetchRecommendedProductsData = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/api/v1/recommended-items/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Error fetching recommended products data"
    );
  }
};
