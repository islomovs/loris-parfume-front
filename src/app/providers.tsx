// app/providers.tsx
"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { ParallaxProvider } from "react-scroll-parallax";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParallaxProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </ParallaxProvider>
    </QueryClientProvider>
  );
}
