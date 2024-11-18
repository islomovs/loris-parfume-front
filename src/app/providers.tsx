"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { ParallaxProvider } from "react-scroll-parallax";
import { QueryClient, QueryClientProvider } from "react-query";
import PageTransition from "./components/PageTransition";
import { RootChildren } from "./components/RootChildren";
import { useEffect, useState } from "react";

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <ParallaxProvider>
        <ChakraProvider>
          <PageTransition>
            <RootChildren>{children} </RootChildren>
          </PageTransition>
        </ChakraProvider>
      </ParallaxProvider>
    </QueryClientProvider>
  );
}
