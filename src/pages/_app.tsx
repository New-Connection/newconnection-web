import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { WagmiConfig } from "wagmi";
import { CustomToast, wagmiClient } from "components";
import Script from "next/script";
import { AppProps } from "next/app";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { getChains } from "interactions/contract";
import "@rainbow-me/rainbowkit/styles.css";
import "styles/globals.css";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient());

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

            <ThemeProvider defaultTheme="system" attribute="class">
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        modalSize="compact"
                        theme={lightTheme({
                            accentColor: "#7343DF",
                            accentColorForeground: "white",
                            borderRadius: "large",
                            overlayBlur: "small"
                        })}
                        appInfo={{
                            appName: "New Connection",
                            learnMoreUrl: "https://www.newconnection.xyz/"
                        }}
                        chains={getChains()}
                    >
                        <QueryClientProvider client={queryClient}>
                            <Component {...pageProps} />
                        </QueryClientProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </ThemeProvider>
            <CustomToast />
        </>
    );
}

export default App;
