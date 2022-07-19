import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query"; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WalletConfig } from "../components/Web3";
import { MoralisProvider } from "react-moralis";
import { moralisAppId, moralisServerUrl } from "../utils/constants";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <MoralisProvider appId={moralisAppId} serverUrl={moralisServerUrl}>
            <ThemeProvider defaultTheme="system" attribute="class">
                <WagmiConfig client={WalletConfig}>
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </WagmiConfig>
            </ThemeProvider>
        </MoralisProvider>
    );
}

export default App;
