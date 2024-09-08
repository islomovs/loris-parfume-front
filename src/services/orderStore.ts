import { create } from "zustand";

// types.ts

export type OrderItem = {
  id: number;
  imageName: string;
  nameUz: string;
  nameRu: string;
  nameEng: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEng: string;
  totalPrice: string;
  quantity: number;
  collectionId: number;
  collectionNameUz: string;
  collectionNameRu: string;
  collectionNameEng: string;
  categoryId: number | null;
  categoryNameUz: string | null;
  categoryNameRu: string | null;
  categoryNameEng: string | null;
  sizeId: number;
  sizeNameUz: string;
  sizeNameRu: string;
  sizeNameEng: string;
};

export type Order = {
  id: number;
  createdTime: string;
  userId: number;
  userFullName: string;
  phone: string;
  address: string;
  addressLocationLink: string;
  distance: number;
  sumForDelivery: string;
  totalSum: string;
  comments: string;
  isDelivered: boolean;
  isDelivery: boolean;
  isSoonDeliveryTime: boolean;
  scheduledDeliveryTime: string;
  branchId: number;
  branchName: string;
  branchLongitude: number;
  branchLatitude: number;
  branchRedirectTo: string;
  paymentLink: string;
  paymentType: string;
  isPaid: boolean;
  paymentResponseUz: string | null;
  paymentResponseRu: string | null;
  paymentResponseEng: string | null;
  itemsList: OrderItem[];
};

export type Pagination = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type OrdersResponse = {
  content: Order[];
  page: Pagination;
};

type OrderState = {
  orders: Order[];
  pagination: Pagination | null;
  setOrders: (orders: Order[], pagination: Pagination) => void;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
};

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  pagination: null,

  // Set orders and pagination details
  setOrders: (orders, pagination) => set({ orders, pagination }),

  // Add a single order to the list
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  // Clear all orders from the store
  clearOrders: () => set({ orders: [], pagination: null }),
}));

export default useOrderStore;
