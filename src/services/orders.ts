import { axiosInstance } from "../utils/axiosInstance";

export interface OrderItem {
  itemId: number;
  sizeId: number;
  quantity: number;
  collectionId: number;
}

export interface OrderData {
  fullName: string;
  branchId: number;
  address: string;
  addressLocationLink: string;
  distance: number;
  phone: string;
  comment: string;
  isDelivery: boolean;
  isSoonDeliveryTime: boolean;
  scheduledDeliveryTime: string;
  longitude: number;
  latitude: number;
  deliverySum: number;
  totalSum: number;
  paymentType: string;
  returnUrl: string;
  ordersItemsList: OrderItem[];
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/orders/create",
      orderData
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to create order:", err);
    throw err;
  }
};

export const fetchAllOrders = async (page: number = 1) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/orders/allMy?page=${page}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch all orders:", err);
    throw err;
  }
};

export const fetchNearestBranch = async (
  longitude: number,
  latitude: number
) => {
  try {
    const response = await axiosInstance.post("/api/v1/branches/nearest", {
      longitude,
      latitude,
    });
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch nearest branches:", err);
    throw err;
  }
};
