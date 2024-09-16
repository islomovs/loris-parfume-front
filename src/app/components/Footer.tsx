import { useState } from "react";
import { useQuery } from "react-query";
import { fetchCollectionsData, ICollectionItem } from "@/services/collections";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../helpers/capitalizeString";
import Link from "next/link";
import i18n from "@/utils/i18n";

export default function Footer() {
  const [collections, setCollections] = useState<ICollectionItem[]>();
  const page = 1;
  const { isLoading } = useQuery("collectionsData", async () => {
    const collectionsResponse = await fetchCollectionsData(page);
    setCollections(collectionsResponse.data.content);
  });

  return (
    <footer className="md:p-10 lg:p-20 border-t-[1px] border-solid border-[#e3e3e3]">
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* First Column */}
        <div className="flex flex-col lg:basis-[460px] p-5 lg:p-10">
          <h1 className="text-xs mb-3 lg:mb-5 font-normal uppercase tracking-[.2em]">
            OVER LORIS
          </h1>
          <p className="text-sm lg:text-[14px] leading-6 font-normal mb-5">
            Loris Parfum biedt kwalitatieve parfum voor aantrekkelijke prijzen.
            Wij hebben verschillende lijnen, van oosters tot westers, waar ieder
            zijn eigen stijl in terug kan vinden. Je bent welkom om kennis te
            maken van onze exclusieve geuren die je zintuigen prikkelen. Naast
            onze parfums kun je ook terecht voor geurstokjes en geurkaarsen en
            luxe roomsprays. Dankzij onze beveiligde betaalmethodes, gaat het
            bestellen bij Loris Parfum veilig en snel. Volg Loris Parfum
            Nederland ook op Social Media. Zo mis je geen aanbiedingen en kan je
            kans maken op diverse acties.
          </p>
          <h2 className="text-sm lg:text-[14px] font-normal">
            Whatsapp +316 22 07 77 30
          </h2>
          <div className="flex flex-row gap-5 mt-3 lg:mt-[14px]">
            <a href="https://facebook.com" className="hover:text-primary">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" className="hover:text-primary">
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
            ALGEMENE VOORWAARDEN
          </h1>
          <ul>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - Snelle levering
            </li>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - Online veilig & snel besteld
            </li>
            <li className="font-bold text-sm lg:text-[14px] mb-3 lg:mb-5">
              - Gratis verzending vanaf €50
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        <a
          href="#"
          className="text-xs font-normal uppercase tracking-[.2em] mt-4 lg:mt-0"
        >
          COPYRIGHT© LORIS PARFUM
        </a>
      </div>
    </footer>
  );
}
