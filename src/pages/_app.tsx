import React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query"; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { WalletConfig } from "../components/Web3";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import HeadInfoBeforeApp from "components/Layout/";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    const HeadMetadata = () => {
        return (
            <Head>
                <link rel="shortcut icon" href="/favicon.png" />
                <meta
                    name="description"
                    content="NewConnection - it's a multichain solution with a simple design and NFT membership"
                />
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta property="og:url" content="https://www.app.newconnection.xyz/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Multichain DAO solution for everyone" />
                <meta name="twitter:card" content="Multichain DAO solution for everyone" />
                <meta property="og:description" content="The simplest DAO website" />
                <meta property="og:image" content={"/PreviewImage.png"} />
            </Head>
        );
    };

    return (
        <>
            <HeadMetadata />
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
        </>
    );
}

export default App;
