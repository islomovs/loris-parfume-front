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
  removeCartItem: (id: number, sizeId?: number) => void;
  clearCart: () => void;
  totalSum: () => number;
  getDiscountedTotal: (
    collectionSlug: string,
    price: number,
    quantity: number
  ) => number; // New function to calculate discounted total
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
      removeCartItem: (id, sizeId) => {
        set((state) => {
          const updatedCart = state.cart.filter(
            (item) => !(item.id === id && item.sizeId === sizeId)
          );
          return { cart: updatedCart };
        });
      },
      clearCart: () => set({ cart: [] }),


      totalSum: () => {
        const cart = get().cart;
        let total = 0;
      
        if (!cart || cart.length === 0) {
          return total; // Returns 0 if cart is empty or undefined
        }
      
        const discountExceptions = ["creation"]; // Collections that normally don’t get discounts
        const crossedDiscountCollections = ["womens", "men"]; // Collections that share discount logic
      
        type GroupedItems = {
          [key: string]: ICartItem[];
        };
      
        const itemsGrouped = cart.reduce<GroupedItems>((acc, item) => {
          const key = item.collectionSlug || "default-collection";
      
          if (crossedDiscountCollections.includes(key)) {
            acc["crossed-group"] = acc["crossed-group"] || [];
            acc["crossed-group"].push(item);
          } else if (key === "creation") {
            // Ensure "creation" items are grouped by ID so discounts apply only to identical items
            const creationKey = `creation-${item.id}`;
            acc[creationKey] = acc[creationKey] || [];
            acc[creationKey].push(item);
          } else {
            acc[key] = acc[key] || [];
            acc[key].push(item);
          }
          return acc;
        }, {});
      
        Object.entries(itemsGrouped).forEach(([groupKey, groupItems]) => {
          // Identify if this group belongs to "creation"
          const isCreationGroup = groupKey.startsWith("creation-");
          const collectionSlug = groupItems[0].collectionSlug || "default-collection";
          const isExcluded = discountExceptions.includes(collectionSlug) && !isCreationGroup;
      
          // Expand items by quantity
          const expandedItems = groupItems.flatMap((item) => Array(item.quantity).fill(item));
      
          expandedItems.forEach((item, index) => {
            const price = item.discountPercent
              ? Number(item.price) - (Number(item.price) * item.discountPercent) / 100
              : Number(item.price);
      
            // Apply discount for every 2nd item if it's not an excluded collection
            const effectivePrice = isExcluded
              ? price // No discount for excluded collections (except per-item creation)
              : (index + 1) % 2 !== 0
              ? price // Full price for odd-indexed items
              : price / 2; // 50% discount for every second identical item
      
            total += effectivePrice;
          });
        });
      
        return total || 0; // Ensure total is a number
      },      
      
      
      

      getDiscountedTotal: (collectionSlug, price, quantity) => {
        const discountExceptions = ["f-2-women", "excluded-collection-2"]; // Update with your actual exception list
        const isExcluded = discountExceptions.includes(collectionSlug);

        let total = 0;
        for (let i = 1; i <= quantity; i++) {
          // Apply discount logic only if the collection is not excluded
          const effectivePrice = isExcluded || i % 2 !== 0 ? price : price / 2;
          total += effectivePrice;
        }
        return total;
      },
    }),
    {
      name: "cart-storage", // Unique name for the storage key
      storage: localStoragePersist, // Use the custom storage object
    }
  )
);

export default useCartStore;
