import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Shared QueryClient instance.
 *
 * Configured with sensible defaults:
 * - `retry: 2`  – retry failed requests twice before surfacing an error.
 * - `staleTime: 5 min` – data stays fresh for 5 minutes before a
 *   background refetch is triggered.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * Wraps the application tree with the TanStack React Query provider.
 * Must be placed at the root layout level.
 */
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
