import React from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider} from 'react-query'; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from 'wagmi'
import type { AppProps } from 'next/app';
// code 
import '../styles/globals.css';
import  { walletConfig } from '../components/Web3'

function App({Component, pageProps}: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <WagmiConfig client={walletConfig}>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
            </WagmiConfig>
        </ThemeProvider>
    )
}

export default App;