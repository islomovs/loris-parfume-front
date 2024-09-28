import { Poppins } from "next/font/google";
import { RootChildren } from "./components/RootChildren";
import { Providers } from "./providers";
import PageTransition from "./components/PageTransition";

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
  title: "Loris Parfum",
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
    title: "Loris Parfume",
    description:
      "Откройте для себя мир уникальных ароматов с LORIS Parfume — лидером на рынке парфюмерии, который дарит вам неповторимые ощущения свежести и гармонии каждый день",
    url: "https://lorisparfume.uz",
    images: "https://lorisparfume.uz/logo.jpg",
    siteName: "Loris Parfume",
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: ["/favicon-logo.png"],
    apple: ["/favicon-logo.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
            <Image
              src="https://mc.yandex.ru/watch/98371026"
              style={{ position: "absolute", left: "-9999px" }}
              alt="yandex"
              width={100}
              height={100}
            />
          </div>
        </noscript>
        {/* <!-- /Yandex.Metrika counter --> */}
      </body>
    </html>
  );
}
