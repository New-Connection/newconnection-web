import ASSETS from "assets/index";
import { Chain } from "wagmi";
import { StaticImageData } from "next/image";

type chainType = [
    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    "Ethereum Rinkeby",
    "Polygon Mumbai",
    "Arbitrum Testnet",
    "Binance Testnet",
    "Avalanche Testnet",
    "Fantom Testnet",
    "Optimism Testnet",
    "Aurora Testnet",
    "Skale Testnet",

    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Binance",
    "Avalanche",
    "Fantom",
    "Optimism",
    "Aurora",
    "Skale",
];

const CHAINS_IMG: {
    [key in chainType[number]]?: StaticImageData;
} = {
    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    Ethereum: ASSETS.Ethereum,
    Polygon: ASSETS.Polygon,
    Arbitrum: ASSETS.Arbitrum,
    Binance: ASSETS.Binance,
    Avalanche: ASSETS.Avalanche,
    Fantom: ASSETS.Fantom,
    Optimism: ASSETS.Optimism,
    Aurora: ASSETS.Aurora,
    Skale: ASSETS.Skale,


    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    "Ethereum Rinkeby": ASSETS.Ethereum,
    "Polygon Mumbai": ASSETS.Polygon,
    "Arbitrum Testnet": ASSETS.Arbitrum,
    "Binance Testnet": ASSETS.Binance,
    "Avalanche Testnet": ASSETS.Avalanche,
    "Fantom Testnet": ASSETS.Fantom,
    "Optimism Testnet": ASSETS.Optimism,
    "Aurora Testnet": ASSETS.Aurora,
    "Skale Testnet": ASSETS.Skale,
};

export const CHAINS: {
    [key in chainType[number]]?: Chain;
} = {

    //
    // TEST CHAINS
    // ----------------------------------------------------------------------

    "Ethereum Rinkeby": {
        id: 4,
        name: "Ethereum Rinkeby",
        network: "Ethereum",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
        blockExplorers: {
            default: { name: "Etherscan", url: "https://rinkeby.etherscan.io" },
        },
        testnet: true,
    },

    "Polygon Mumbai": {
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

    "Avalanche Testnet": {
        id: 43113,
        name: "Avalanche Testnet",
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

    "Binance Testnet": {
        id: 97,
        name: "Binance Testnet",
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

    // "Arbitrum Testnet": {
    //     id: 421611,
    //     name: "Arbitrum Testnet",
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

    "Optimism Testnet": {
        id: 420,
        name: "Optimism Testnet",
        network: "Optimism",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://goerli.optimism.io/",
        },
        blockExplorers: {
            default: { name: "optiscan", url: "https://goerli-optimism.etherscan.io/" },
        },
        testnet: true,
    },

    "Fantom Testnet": {
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

    "Aurora Testnet": {
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

    "Skale Testnet": {
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

    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------

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

export const getChains = (): Chain[] => {
    return Object.values(CHAINS);
};

export const getChainIds = () => {
    return getChains()
        .map((chain) => chain.id)
};

export const getChainNames = () => {
    return getChains()
        .map((chain) => chain.name)
};

export const getChain = (
    chainId: number
): Chain => {
    return getChains()
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
    return getChainIds().includes(chain.id);
};

export const getLogoURI = (chain: number | string) => {
    if (typeof chain === "number") {
        return CHAINS_IMG[getChain(chain).network]?.src || CHAINS_IMG["Ethereum"];
    } else {
        return CHAINS_IMG[chain] || CHAINS_IMG["Ethereum"];
    }
}