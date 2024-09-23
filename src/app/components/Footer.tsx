import { useState } from "react";
import { useQuery } from "react-query";
import { fetchCollectionsData, ICollectionItem } from "@/services/collections";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../helpers/capitalizeString";
import Link from "next/link";
import i18n from "@/utils/i18n";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const [collections, setCollections] = useState<ICollectionItem[]>();
  const page = 1;
  const { isLoading } = useQuery("collectionsData", async () => {
    const collectionsResponse = await fetchCollectionsData(page);
    setCollections(collectionsResponse.data.content);
  });
  const { t } = useTranslation("common");

  return (
    <footer className="md:p-10 lg:p-20 border-t-[1px] border-solid border-[#e3e3e3]">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* First Column */}
        <div className="flex flex-col lg:basis-[460px] p-5 lg:p-10">
          <h1 className="text-xs mb-3 lg:mb-5 font-normal uppercase tracking-[.2em]">
            {t("about.title")}
          </h1>
          <p className="text-sm lg:text-[14px] leading-6 font-normal mb-5">
            {t("about.description")}
          </p>
          <a
            href="tel:+998939119944"
            className="text-sm lg:text-[14px] font-normal"
          >
            +998 93 911 99 44
          </a>
          <div className="flex flex-row gap-5 mt-3 lg:mt-[14px]">
            <a href="https://t.me/Loris_perfume" className="hover:text-primary">
              <FaTelegramPlane />
            </a>
            <a
              href="https://www.instagram.com/lorisparfum_uz"
              className="hover:text-primary"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="flex flex-col p-5 lg:p-10">
          <h1 className="text-xs mb-3 lg:mb-5 font-normal uppercase tracking-[.2em]">
            LORIS PARFUM
          </h1>
          <ul className="text-sm lg:text-[14px] leading-[21px] font-normal">
            {collections?.map((collection: ICollectionItem) => {
              const collectioName =
                i18n.language == "ru" ? collection.nameRu : collection.nameUz;
              return (
                <Link
                  href={`/collections/${collection.slug}`}
                  key={collection.id}
                >
                  <li className="mb-2 lg:mb-3 text-black hover:text-primary cursor-pointer">
                    {capitalizeFirstLetter(collectioName)}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col lg:basis-[460px] p-5 lg:p-10">
          <h1 className="text-xs mb-3 lg:mb-5 font-normal uppercase tracking-[.2em]">
            {t("terms")}
          </h1>
          <ul>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - {t("productDetails.estimatedDelivery")}
            </li>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - {t("productDetails.freeShipping")}
            </li>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - {t("navbar.announcement")}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <a className="text-xs font-normal uppercase tracking-[.2em] mt-4 lg:mt-0">
          COPYRIGHT© LORIS PARFUM
        </a>
      </div>
    </footer>
  );
}
