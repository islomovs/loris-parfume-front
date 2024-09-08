import { useState } from "react";
import { useQuery } from "react-query";
import { fetchCollectionsData, ICollectionItem } from "@/services/collections";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../helpers/capitalizeString";
import Link from "next/link";

export default function Footer() {
  const [collections, setCollections] = useState<ICollectionItem[]>();
  const page = 1;
  const { isLoading } = useQuery("collectionsData", async () => {
    const collectionsResponse = await fetchCollectionsData(page);
    setCollections(collectionsResponse.data.content);
  });

  return (
    <footer className="p-20 border-t-[1px] border-solid border-[#e3e3e3]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col basis-[460px] p-10">
          <h1 className="text-xs mb-5 font-normal uppercase tracking-[.2em]">
            OVER LORIS
          </h1>
          <p className="text-[14px] leading-6 font-normal mb-5">
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
          <h2 className="text-[14px] font-normal">Whatsapp +316 22 07 77 30</h2>
          <div className="flex flex-row gap-5 mt-[14px]">
            <a href="https://facebook.com" className="hover:text-primary">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" className="hover:text-primary">
              <FaInstagram />
            </a>
          </div>
        </div>
        <div className="flex flex-col p-10">
          <h1 className="text-xs mb-5 font-normal uppercase tracking-[.2em]">
            LORIS PARFUM
          </h1>
          <ul className="text-[14px] leading-[21px] font-normal">
            {collections?.map((collection: ICollectionItem) => (
              <Link
                href={`/collections/${collection.slug}`}
                key={collection.id}
              >
                <li
                  key={collection.id}
                  className="mb-3 text-[14px] font-normal text-black hover:text-primary cursor-pointer"
                >
                  {capitalizeFirstLetter(collection.nameEng)}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex flex-col basis-[460px] p-10">
          <h1 className="text-xs mb-5 font-normal uppercase tracking-[.2em]">
            ALGEMENE VOORWAARDEN
          </h1>
          <ul>
            <li className="font-bold text-[14px] mb-5">- Snelle levering</li>
            <li className="font-bold text-[14px] mb-5">
              - Online veilig & snel besteld
            </li>
            <li className="font-bold text-[14px] mb-5">
              - Gratis verzending vanaf €50
            </li>
          </ul>
        </div>
      </div>
      <a
        href="#"
        className="text-xs mb-5 font-normal uppercase tracking-[.2em]"
      >
        COPYRIGHT© LORIS PARFUM
      </a>
    </footer>
  );
}
