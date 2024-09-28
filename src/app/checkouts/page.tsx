import { Metadata } from "next";
import CheckoutPage from "../_pages/checkouts";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
    languages: {
      ru: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
      uz: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout`,
    },
  },
};

export default function Checkout() {
  return <CheckoutPage />;
}
