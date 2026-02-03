"use client"; // Mark as Client Component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppKitProvider } from '@mysten/dapp-kit-react';
import { dAppKit } from './dappkit';
import { useState } from "react";



export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit} >
			{children}
			</DAppKitProvider>
    </QueryClientProvider>
  );
}