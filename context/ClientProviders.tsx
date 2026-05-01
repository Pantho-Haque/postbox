'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ShortcutProvider } from "./ShortcutKeypressProvider";
import { DataProvider } from "./dataContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 5,
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <ShortcutProvider>
          {children}
        </ShortcutProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}
