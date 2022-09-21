import React from "react";
import { moralisAppId, moralisServerUrl } from "utils/constants";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query"; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import "styles/globals.css";
import { WalletConfig } from "components/Web3";
import { MoralisProvider } from "react-moralis";
import Script from "next/script";
import "nprogress/nprogress.css";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy="lazyOnload">
                {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
            </Script>

            <MoralisProvider appId={moralisAppId!} serverUrl={moralisServerUrl!}>
                <ThemeProvider defaultTheme="system" attribute="class">
                    <WagmiConfig client={WalletConfig}>
                        <QueryClientProvider client={queryClient}>
                            <Component {...pageProps} />
                        </QueryClientProvider>
                    </WagmiConfig>
                </ThemeProvider>
            </MoralisProvider>
        </>
    );
}

export default App;
