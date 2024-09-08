"use client";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { RootChildren } from "./components/RootChildren";
import { Providers } from "./providers";
import PageTransition from "./components/PageTransition";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${montserrat.className}`}>
        <Providers>
          <PageTransition>
            <RootChildren>{children}</RootChildren>
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
