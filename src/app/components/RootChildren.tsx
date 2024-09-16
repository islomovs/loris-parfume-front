import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import Footer from "./Footer";
import { useQuery } from "react-query";
import { getCartItems } from "../../services/cart";
import useCartStore from "../../services/store";
import { useTranslation } from "react-i18next";

interface IRootLayout {
  children: any;
}

export const RootChildren: React.FC<IRootLayout> = ({ children }) => {
  const pathname = usePathname();

  // Pattern to match product pages
  const dynamicProductPattern =
    /^\/collections\/[a-zA-Z0-9-]+\/categories\/[a-zA-Z0-9-]+\/products\/[a-zA-Z0-9-]+$/;

  // Updated pattern to match both /collections/[slug] and /collections/[slug]/categories/[slug]
  const dynamicSlugPattern =
    /^\/collections\/[a-zA-Z0-9-]+(\/categories\/[a-zA-Z0-9-]+)?$/;

  const variantOneRoutes = ["/"];

  const { setCartItems, setApiQuantity, cart } = useCartStore((state) => state);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Conditionally fetch cart items only if token exists
  const { data: cartData, refetch } = useQuery(
    "cartItemsData",
    async () => {
      const res = await getCartItems();
      console.log("Data IS FETCHED");
      return res?.data || [];
    },
    {
      enabled: !!token, // Run only if token is available
      onSuccess: (data) => {
        if (data) {
          setCartItems(data);
          const quantities: { [key: string]: number } = {};
          data.forEach(
            (item: { id: number; sizeId?: number; quantity: number }) => {
              quantities[`${item.id}-${item.sizeId}`] = item.quantity;
            }
          );
          setApiQuantity(quantities);
        }
      },
      onError: () => {
        setCartItems([]);
      },
    }
  );

  useEffect(() => {
    if (token) {
      refetch(); // Fetch cart items when token is available
    } else {
      try {
        // Load cart from local storage if available for logged-out users
        const storedCartString = localStorage.getItem("cart-storage");
        if (storedCartString) {
          const storedCart = JSON.parse(storedCartString);
          if (
            Array.isArray(storedCart) &&
            storedCart.length > 0 &&
            cart.length === 0
          ) {
            setCartItems(storedCart);
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from local storage:", error);
        localStorage.removeItem("cart-storage"); // Clear corrupted data to prevent repeated errors
      }
    }
  }, [token, refetch, setCartItems, cart.length]);

  const variant: "transparent" | "filled" =
    variantOneRoutes.includes(pathname) ||
    (!dynamicProductPattern.test(pathname) && dynamicSlugPattern.test(pathname))
      ? "transparent"
      : "filled";

  // Check if the current path is the checkout page
  const isCheckoutPage = pathname === "/checkouts";
  const { i18n } = useTranslation("common");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadNamespace = async () => {
      await i18n.loadNamespaces("common");
      setIsLoaded(true);
    };
    loadNamespace();
  }, [i18n]);

  if (!isLoaded) return "";

  return (
    <>
      {/* Conditionally render Navbar and Footer only if not on the checkout page */}
      {!isCheckoutPage && <Navbar variant={variant} />}
      {children}
      {!isCheckoutPage && <Footer />}
    </>
  );
};
