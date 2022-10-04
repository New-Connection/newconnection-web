import { configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { getChains } from "utils/blockchains";
import { INFURA_ID } from "utils/constants";

export const { chains, provider, webSocketProvider } = configureChains(getChains(), [
    infuraProvider({ priority: 0, apiKey: INFURA_ID }),
    // alchemyProvider({ priority: 1, apiKey: alchemyId }),
    jsonRpcProvider({
        priority: 2,
        rpc: (chain) => {
            return { http: chain.rpcUrls.default };
        },
    }),
    publicProvider({ priority: 3 }),
]);

// Set up client
export const WagmiClient = createClient({
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
