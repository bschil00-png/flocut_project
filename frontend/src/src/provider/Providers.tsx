"use client";

import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { ApolloProvider } from "@apollo/client/react";

import { index as store } from "@/store";
import { apolloClient } from "@/lib/apollo/clients";
import { AuthProvider } from "@/provider/AuthProvider";
import AuthInitializer from "@/provider/AuthInitializer";
import {OfflineBanner} from "@/app/components/layout/OfflineBanner";
import {AuthRevalidator, ProfileSyncInitializer, UIInitializer} from "@/provider/Initializers";



export function Providers({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider store={store}>
            <UIInitializer />
            <AuthProvider>
                <ApolloProvider client={apolloClient}>
                    <AuthInitializer />
                    <AuthRevalidator />
                    <ProfileSyncInitializer />
                    <OfflineBanner />
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        {children}
                    </ThemeProvider>
                </ApolloProvider>
            </AuthProvider>
        </ReduxProvider>
    );
}