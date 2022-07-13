import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query"; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WalletConfig } from "../components/Web3";
import { MoralisProvider } from "react-moralis";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <WagmiConfig client={WalletConfig}>
                <QueryClientProvider client={queryClient}>
                    <MoralisProvider
                        appId="iAzZ2yHjWMRkMgBuRwBv3ZdwatednKBAw4MpCV0D"
                        serverUrl="https://pmaspuub0lgb.usemoralis.com:2053/server"
                    >
                        <Component {...pageProps} />
                    </MoralisProvider>
                </QueryClientProvider>
            </WagmiConfig>
        </ThemeProvider>
    );
}

export default App;
