import { axiosInstance } from "../utils/axiosInstance";

export interface ICartItem {
  id: number;
  slug: string;
  quantity: number;
  price: number;
  imagesList: string[];
  nameUz?: string;
  nameRu?: string;
  nameEng: string;
  sizeNameUz?: string;
  sizeNameRu?: string;
  sizeNameEng?: string;
  sizeId?: number;
  collectionSlug: string;
  collectionId?: number;
  discountPercent?: number;
}

export const addToCart = async (item: any) => {
  try {
    const response = await axiosInstance.post(
      `${
        item.sizeId
          ? `/api/v1/basket/add/${item.slug}?quantity=${item.quantity}&sizeId=${item.sizeId}&collectionSlug=${item.collectionSlug}`
          : `/api/v1/basket/add/${item.slug}?quantity=${item.quantity}&collectionSlug=${item.collectionSlug}`
      }`
    );
    return response;
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

export const getCartItems = async () => {
  try {
    const response = await axiosInstance.post("/api/v1/basket/all");
    return response;
  } catch (error) {
    console.error("Failed to get cart items:", error);
  }
};

export const removeFromCart = async (slug: string, sizeId?: number) => {
  try {
    return await axiosInstance.delete(
      `${
        sizeId
          ? `/api/v1/basket/remove/${slug}?sizeId=${sizeId}`
          : `/api/v1/basket/remove/${slug}`
      }`
    );
  } catch (err) {
    throw err;
  }
};

export const clearCart = async () => {
  try {
    return await axiosInstance.delete("/api/v1/basket/clear");
  } catch (err) {
    console.error("Failed to clear cart:", err);
    throw err;
  }
};
