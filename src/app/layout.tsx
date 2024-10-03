/* eslint-disable @next/next/no-img-element */
import { Poppins } from "next/font/google";
import { RootChildren } from "./components/RootChildren";
import { Providers } from "./providers";
import PageTransition from "./components/PageTransition";
import "react-phone-input-2/lib/style.css"; // Import the CSS file

import "./globals.css";
import { Metadata } from "next";
import Image from "next/image";

// Load Poppins font with Latin and Cyrillic subsets
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loris Parfum – Ароматы премиум-класса для мужчин и женщин",
  description:
    "Откройте для себя мир уникальных ароматов с LORIS Parfume — лидером на рынке парфюмерии, который дарит вам неповторимые ощущения свежести и гармонии каждый день",
  applicationName: "Loris Parfume",
  keywords: [
    "loris parfume",
    "loris parfum",
    "parfume",
    "parfumeria",
    "atir",
    "duhi",
    "духи",
    "gigiyena",
    "hygiene",
    "tashkent",
    "parfum",
    "hushbo'ylantruvchi",
    "loris",
    "uzbekistan",
  ],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN as string),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    languages: {
      ru: `${process.env.NEXT_PUBLIC_DOMAIN}`,
      uz: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    },
  },
  openGraph: {
    title: "Loris Parfum – Ароматы премиум-класса для мужчин и женщин",
    description:
      "Откройте для себя мир уникальных ароматов с LORIS Parfume — лидером на рынке парфюмерии, который дарит вам неповторимые ощущения свежести и гармонии каждый день",
    url: "https://lorisparfume.uz",
    images: "https://lorisparfume.uz/logo600.jpg",
    siteName: "Loris Parfume",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
    apple: {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  },
  manifest: "/site.webmanifest.json",
  verification: {
    google: "VQFkJCahv2Oab-Bi55UbMB26MoUu1Kx3cYp0T7v2wK0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={poppins.className}>
        <Providers>
          <PageTransition>
            <RootChildren>{children}</RootChildren>
          </PageTransition>
        </Providers>

        {/* <!-- Yandex.Metrika counter --> */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html:
              '(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }};k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(98371026, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});',
          }}
        ></script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/98371026"
              style={{ position: "absolute", left: "-9999px" }}
              alt="yandex"
            />
          </div>
        </noscript>
        {/* <!-- /Yandex.Metrika counter --> */}
      </body>
    </html>
  );
}
