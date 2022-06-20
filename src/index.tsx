import React from 'react';
import { createRoot } from "react-dom/client";
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider} from 'react-query'; // it makes fetching, caching, synchronizing and updating server state
import { WagmiConfig } from 'wagmi'
// code
import Home from './pages';
import './styles/globals.css';
import  { walletConfig } from './components/Web3/'

function Page() {
    const [queryClient] = React.useState(() => new QueryClient());
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <WagmiConfig client={walletConfig}>
                <QueryClientProvider client={queryClient}>
                    <Home />
                </QueryClientProvider>
            </WagmiConfig>
        </ThemeProvider>
    )
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container)
root.render(<Page />);