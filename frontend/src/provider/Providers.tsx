"use client";


import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { apolloClient } from "@/lib/apollo/clients";
import {ApolloProvider} from "@apollo/client/react";
import { index as store } from "@/api/store/index";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
}
