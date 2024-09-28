import { fetchBranchesData, IBranchItem } from "@/services/branches";
import BranchesPage from "../_pages/branches";
import { AxiosResponse } from "axios";

export async function generateMetadata() {
  return {
    title: "Филиалы | Парфюмерные Филиалы Лорис",
    description:
      "LORIS Parfume представлен в ряде ключевых торговых центров и локаций по всей стране, предлагая широкий ассортимент уникальных ароматов для дома и парфюмов. Наши филиалы находятся в таких местах, как Tashkent City Mall, Seoul Mun, Samarqand Darvoza, Next, Riviera, Compass, Chimgan, Atlass Mall, Navruz Mall и O’zbegim Trade Center. Посетите ближайший магазин, чтобы окунуться в мир утонченных ароматов LORIS Parfume.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/branches`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/branches`,
        ru: `${process.env.NEXT_PUBLIC_DOMAIN}/branches`,
      },
    },
  };
}

const getData = async () => {
  let branches: IBranchItem[] = [];
  let error = null;

  try {
    const response: AxiosResponse<any> = await fetchBranchesData();
    branches = response.data;
  } catch (err) {
    error = err;
  }

  return { branches, error };
};

export default async function Branches() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };
  const { branches, error } = await getData();

  const isLoading = !branches && !error;

  return (
    <BranchesPage branches={branches} isLoading={isLoading} error={error} />
  );
}
