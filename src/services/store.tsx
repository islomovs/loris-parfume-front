import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { ICartItem } from "./cart";

interface CartState {
  cart: ICartItem[];
  apiQuantity: { [key: string]: number };
  setApiQuantity: (apiQty: { [key: string]: number }) => void;
  setCartItems: (items: ICartItem[]) => void;
  addOrUpdateCartItem: (item: ICartItem) => void;
  updateCartItemQuantity: (
    id: number,
    quantity: number,
    sizeId?: number
  ) => void;
  clearCart: () => void;
  totalSum: () => number;
}

// Custom storage object that conforms to PersistStorage interface
const localStoragePersist: PersistStorage<CartState> = {
  getItem: async (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    localStorage.removeItem(name);
  },
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      apiQuantity: { [""]: 0 },
      setApiQuantity: (apiQty) => set({ apiQuantity: apiQty }),
      setCartItems: (items) => set({ cart: items }),
      addOrUpdateCartItem: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) =>
              cartItem.id === item.id && cartItem.sizeId === item.sizeId
          );
          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id && cartItem.sizeId === item.sizeId
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            };
          }
          return {
            cart: [...state.cart, item],
          };
        }),
      updateCartItemQuantity: (id, quantity, sizeId) => {
        set((state) => {
          const cart = state.cart.map((item) =>
            item.id === id && item.sizeId === sizeId
              ? { ...item, quantity }
              : item
          );
          return { cart };
        });
        get().totalSum();
      },
      clearCart: () => set({ cart: [] }),
      totalSum: () => {
        const cart = get().cart;
        let total = 0;

        if (!cart || cart.length === 0) {
          console.log("Cart is empty or not loaded correctly.");
          return total; // Returns 0 if cart is empty or undefined
        }

        // Define a type for the accumulator
        type GroupedItems = {
          [key: string]: ICartItem[];
        };

        // Group items by collectionSlug to identify same collection products
        const itemsGrouped = cart.reduce<GroupedItems>((acc, item) => {
          const key = item.collectionSlug || "default-collection"; // Use a default key if collectionSlug is missing
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        }, {}); // Initialize as an empty object of type GroupedItems

        // Calculate total with 50% discount for every second item in each collection group
        Object.values(itemsGrouped).forEach((groupItems: ICartItem[]) => {
          // Flatten quantities to account for every second item regardless of item type
          const expandedItems = groupItems.flatMap((item) =>
            Array(item.quantity).fill(item)
          );

          // Apply 50% discount to every second item within the same collection group
          expandedItems.forEach((item, index) => {
            const price = item.discountPercent
              ? Number(item.price) -
                (Number(item.price) * item.discountPercent) / 100
              : Number(item.price);

            // Apply 50% discount to every second item
            const effectivePrice = (index + 1) % 2 === 0 ? price / 2 : price;

            // Debugging output to verify price calculations
            console.log(
              `Calculating total for item ${item.slug}: Original Price = ${price}, Effective Price = ${effectivePrice}`
            );

            total += effectivePrice;
          });
        });

        // Final debug output to verify total calculation
        console.log("Final Total Sum:", total);

        return total || 0; // Ensure total is a number
      },
    }),
    {
      name: "cart-storage", // Unique name for the storage key
      storage: localStoragePersist, // Use the custom storage object
    }
  )
);

export default useCartStore;
