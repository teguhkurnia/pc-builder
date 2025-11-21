"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
