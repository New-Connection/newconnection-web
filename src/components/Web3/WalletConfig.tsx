import { createClient, defaultChains, configureChains } from "wagmi";
//Example: https://wagmi.sh/examples/connect-wallet
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import { getChains, MAIN_CHAINS, TEST_CHAINS } from "utils/blockchains";
import { alchemyId, infuraId } from "utils/constants";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
export const { chains, provider, webSocketProvider } = configureChains(
    [...defaultChains].concat(getChains(TEST_CHAINS), getChains(MAIN_CHAINS)),
    [
        alchemyProvider({ apiKey: alchemyId }),
        publicProvider(),
        infuraProvider({ apiKey: infuraId }),
        jsonRpcProvider({
            rpc: (chain) => {
                if (chain.id !== TEST_CHAINS.Polygon.id) return null;
                return { http: chain.rpcUrls.default };
            },
        }),
    ]
);

// Set up client
export const WalletConfig = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});
