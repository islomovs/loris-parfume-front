"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import { RootChildren } from "./components/RootChildren";
import { Providers } from "./providers";
import PageTransition from "./components/PageTransition";

// Load Poppins font with Latin and Cyrillic subsets
const poppins = Poppins({
  subsets: ["latin", "latin-ext"], // Note: Poppins currently supports latin and latin-ext subsets
  weight: ["400", "500", "600", "700"], // Include the weights you need
  display: "swap", // Optional: for better font loading performance
});

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
      </body>
    </html>
  );
}
