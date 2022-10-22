import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { WagmiConfig } from "wagmi";
import { chains, CustomToast, wagmiClient } from "components";
import Script from "next/script";
import { AppProps } from "next/app";
import { darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "styles/globals.css";
import { useBoolean, useDarkMode } from "usehooks-ts";
import { DARK_THEME, LIGHT_THEME } from "utils";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient());
    const { isDarkMode: localStorageTheme } = useDarkMode();
    const { value: isDarkTheme, setTrue, setFalse } = useBoolean(false);

    useEffect(() => {
        localStorageTheme ? setTrue() : setFalse();
    }, [localStorageTheme]);

    return (
        <div data-theme={isDarkTheme ? DARK_THEME : LIGHT_THEME}>
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

            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    theme={
                        isDarkTheme
                            ? darkTheme({
                                  accentColor: "#661AE6",
                                  overlayBlur: "small",
                              })
                            : lightTheme({
                                  accentColor: "#570df8",
                                  overlayBlur: "small",
                              })
                    }
                    appInfo={{
                        appName: "New Connection",
                        learnMoreUrl: "https://www.newconnection.xyz/",
                    }}
                    chains={chains}
                >
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </RainbowKitProvider>
            </WagmiConfig>
            <CustomToast />
        </div>
    );
}

export default App;
