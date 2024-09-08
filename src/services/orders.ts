import { axiosInstance } from "../utils/axiosInstance";

// Define the types for the order and order items
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
  paymentType: string; // Should match 'payme', 'click', 'cash', 'uzum nasiya'
  returnUrl: string;
  ordersItemsList: OrderItem[];
}

// Function to create the order
export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/orders/create",
      orderData
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to create order:", err);
    throw err; // Re-throwing the error to handle it in the calling function
  }
};

export const fetchAllOrders = async (page: number = 1) => {
  try {
    // Making a POST request with the page number in the request body
    const response = await axiosInstance.post(
      `/api/v1/orders/allMy?page=${page}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to fetch all orders:", err);
    throw err; // Re-throwing the error to handle it in the calling function
  }
};
