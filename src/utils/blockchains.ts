import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";
import Avalanche from "assets/chains/Avalanche.png";
import Fantom from "assets/chains/Fantom.png";
import Optimism from "assets/chains/Optimism.png";
import Aurora from "assets/chains/Aurora.png";
import Skale from "assets/chains/Skale.png";
import { Chain } from "wagmi";
import { StaticImageData } from "next/image";

export const CHAINS = [
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Binance",
    "Avalanche",
    "Fantom",
    "Optimism",
    "Aurora",
    "Skale",
] as const;

export const CHAINS_IMG: {
    [key in typeof CHAINS[number]]?: StaticImageData;
} = {
    Ethereum: Ethereum,
    Polygon: Polygon,
    Arbitrum: Arbitrum,
    Binance: Binance,
    Avalanche: Avalanche,
    Fantom: Fantom,
    Optimism: Optimism,
    Aurora: Aurora,
    Skale: Skale,
};

const TEST_CHAINS: {
    [key in typeof CHAINS[number]]?: Chain;
} = {
    Ethereum: {
        id: 4,
        name: "Ethereum Rinkeby",
        network: "Ethereum",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "Rinkeby",
        },
        rpcUrls: {
            default: "https://rinkeby.infura.io/v3/",
        },
        blockExplorers: {
            default: { name: "Etherscan", url: "https://rinkeby.etherscan.io" },
        },
        testnet: true,
    },

    Polygon: {
        id: 80001,
        name: "Polygon Mumbai",
        network: "Polygon",
        nativeCurrency: {
            decimals: 18,
            name: "Polygon",
            symbol: "MATIC",
        },
        rpcUrls: {
            default: "https://rpc-mumbai.maticvigil.com",
        },
        blockExplorers: {
            default: { name: "Polygonscan", url: "https://mumbai.polygonscan.com" },
        },
        testnet: true,
    },

    Avalanche: {
        id: 43113,
        name: "Avalanche FUJI",
        network: "Avalanche",
        nativeCurrency: {
            decimals: 18,
            name: "Avalanche",
            symbol: "AVAX",
        },
        rpcUrls: {
            default: "https://api.avax-test.network/ext/bc/C/rpc",
        },
        blockExplorers: {
            default: { name: "Snowtrace", url: "https://testnet.snowtrace.io" },
        },
        testnet: true,
    },

    Binance: {
        id: 97,
        name: "BSC Testnet",
        network: "Binance",
        nativeCurrency: {
            decimals: 18,
            name: "BSC",
            symbol: "BNB",
        },
        rpcUrls: {
            default: "https://data-seed-prebsc-1-s1.binance.org:8545",
        },
        blockExplorers: {
            default: { name: "bscscan", url: "https://testnet.bscscan.com" },
        },
        testnet: true,
    },

    // Arbitrum: {
    //     id: 421611,
    //     name: "Arbitrum Rinkeby",
    //     network: "Arbitrum",
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: "Ethereum",
    //         symbol: "ETH",
    //     },
    //     rpcUrls: {
    //         default: "https://rinkeby.arbitrum.io/rpc",
    //     },
    //     blockExplorers: {
    //         default: { name: "arbiscan", url: "https://testnet.arbiscan.io" },
    //     },
    //     testnet: true,
    // },

    Optimism: {
        id: 69,
        name: "Optimism Kovan",
        network: "Optimism",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://kovan.optimism.io/",
        },
        blockExplorers: {
            default: { name: "optiscan", url: "https://kovan-optimistic.etherscan.io" },
        },
        testnet: true,
    },

    Fantom: {
        id: 4002,
        name: "Fantom Testnet",
        network: "Fantom",
        nativeCurrency: {
            decimals: 18,
            name: "Fantom",
            symbol: "FTM",
        },
        rpcUrls: {
            default: "https://rpc.testnet.fantom.network/",
        },
        blockExplorers: {
            default: { name: "ftmscan", url: "https://testnet.ftmscan.com" },
        },
        testnet: true,
    },

    Aurora: {
        id: 1313161555,
        name: "Aurora Testnet",
        network: "Aurora",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://testnet.aurora.dev",
        },
        blockExplorers: {
            default: { name: "aurorascan", url: "https://testnet.aurorascan.dev" },
        },
        testnet: true,
    },

    Skale: {
        id: 0x2696efe5,
        name: "Skale Testnet",
        network: "Skale",
        nativeCurrency: {
            decimals: 18,
            name: "Skale",
            symbol: "SFUEL",
        },
        rpcUrls: {
            default: "https://eth-online.skalenodes.com/v1/hackathon-complex-easy-naos",
        },
        blockExplorers: {
            default: {
                name: "skalescan",
                url: "https://hackathon-complex-easy-naos.explorer.eth-online.skalenodes.com",
            },
        },
        testnet: true,
    },
};

const MAIN_CHAINS: {
    [key in typeof CHAINS[number]]?: Chain;
} = {
    Aurora: {
        id: 1313161554,
        name: "Aurora",
        network: "Aurora",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://mainnet.aurora.dev",
        },
        blockExplorers: {
            default: { name: "aurorascan", url: "https://aurorascan.dev" },
        },
        testnet: false,
    },
};

// TODO Change to MAIN
export const CURRENT_CHAINS = TEST_CHAINS

export const getChains = (chains: {
    [key in typeof CHAINS[number]]?: Chain;
}): Chain[] => {
    return Object.values(chains);
};

export const getChainIds = (chains: {
    [key in typeof CHAINS[number]]?: Chain;
}) => {
    return getChains(chains)
        .map((chain) => chain.id)
};

export const getChainNames = (chains: {
    [key in typeof CHAINS[number]]?: Chain;
}) => {
    return getChains(chains)
        .map((chain) => chain.name)
};

export const getChain = (
    chainId: number
): Chain => {
    return Object.values(TEST_CHAINS)
        .concat(Object.values(MAIN_CHAINS))
        .find((chain) => chain.id === chainId);
};

export function getChainScanner(chainId: number | undefined, address: string | undefined) {
    if (!chainId || !address) {
        return "";
    }
    return `${getChain(chainId).blockExplorers.default.url}/address/${address}`;
}

export const getTokenSymbol = (chainId: number) => {
    return getChain(chainId).nativeCurrency.symbol
}

export const isBlockchainSupported = (chain: { id }) => {
    if (!chain) {
        return false;
    }
    return getChainIds(TEST_CHAINS).concat(getChainIds(MAIN_CHAINS)).includes(chain.id);
};


export const getLogoURI = (chainId: number) => {
    return CHAINS_IMG[getChain(chainId).network]?.src || CHAINS_IMG["Ethereum"].src
}