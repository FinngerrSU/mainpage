// app/DAppWrapper.tsx
'use client'; // <--- The magic fix. This makes `ssr: false` legal here.

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the provider with SSR disabled
const NoSSRProvider = dynamic(
  () => import('./suiprovider'), 
  { ssr: false }
);

export default function DAppWrapper({ children }: { children: React.ReactNode }) {
  return <NoSSRProvider>{children}</NoSSRProvider>;
}