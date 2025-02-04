import { Metadata } from "next";
import CartPage from "../_pages/cart";

type Props = {
  params: { productSlug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { productSlug: slug } = params;

    return {
      title: "Корзина | LORIS Perfume",
      description:
        "Ваши выбранные ароматы ждут!Ваша корзина наполнена уникальными ароматами от LORIS Perfume, готовыми дополнить ваш стиль и создать особую атмосферу. Проверьте детали заказа, внесите последние изменения и завершите покупку, чтобы насладиться лучшими ароматами, созданными по международным стандартам качества. Наши продукты прошли строгий контроль, чтобы обеспечить вам только лучшие впечатления. Не упустите возможность — оформите заказ прямо сейчас и окунитесь в мир утонченных парфюмов от LORIS Perfume",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
        languages: {
          en: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
          ru: `${process.env.NEXT_PUBLIC_DOMAIN}/products/${slug}`,
        },
      },
    };
  } catch (error) {
    return {
      title: "LORIS Perfume",
      description: "Default Description",
    };
  }
}

export default function Cart() {
  return <CartPage />;
}
