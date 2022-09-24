import { createClient, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CURRENT_CHAINS, getChains } from "utils/blockchains";
import { alchemyId, infuraId } from "utils/constants";

export const { chains, provider, webSocketProvider } = configureChains(
    (getChains(CURRENT_CHAINS)),
    [
        infuraProvider({ priority: 0, apiKey: infuraId }),
        alchemyProvider({ priority: 1, apiKey: alchemyId }),
        jsonRpcProvider({
            priority: 2,
            rpc: (chain) => {
                return { http: chain.rpcUrls.default };
            },
        }), publicProvider({ priority: 3 }),
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
