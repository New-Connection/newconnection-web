import ASSETS from "assets";
import { chain, Chain } from "wagmi";
import { StaticImageData } from "next/image";
import { INFURA_ID } from "utils";

type chainType = [
    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    // "Ethereum",
    // "Arbitrum",
    // "Binance",
    // "Avalanche",
    // "Fantom",
    "Polygon",
    "Optimism",
    "Aurora",

    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    // "Goerli",
    // "Arbitrum Goerli",
    // "Binance Testnet",
    // "Avalanche Testnet",
    // "Fantom Testnet",
    "Polygon Mumbai",
    "Optimism Goerli",
    "Aurora Testnet"
];

const CHAINS_IMG: {
    [key in chainType[number]]: StaticImageData;
} = {
    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    // Ethereum: ASSETS.Ethereum,
    // Arbitrum: ASSETS.Arbitrum,
    // Binance: ASSETS.Binance,
    // Avalanche: ASSETS.Avalanche,
    // Fantom: ASSETS.Fantom,
    Polygon: ASSETS.Polygon,
    Optimism: ASSETS.Optimism,
    Aurora: ASSETS.Aurora,

    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    // Goerli: ASSETS.Ethereum,
    // "Arbitrum Goerli": ASSETS.Arbitrum,
    // "Binance Testnet": ASSETS.Binance,
    // "Avalanche Testnet": ASSETS.Avalanche,
    // "Fantom Testnet": ASSETS.Fantom,
    "Polygon Mumbai": ASSETS.Polygon,
    "Optimism Goerli": ASSETS.Optimism,
    "Aurora Testnet": ASSETS.Aurora,
};

const CHAINS_BLOCKTIME: {
    [key in chainType[number]]: number;
} = {
    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    // Ethereum: 12,
    // Arbitrum: 0.5,
    // Binance: 3,
    // Avalanche: 2,
    // Fantom: 1.2,
    Polygon: 2,
    Optimism: 12,
    Aurora: 1.2,

    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    // Goerli: 12,
    // "Arbitrum Goerli": 0.5,
    // "Binance Testnet": 3,
    // "Avalanche Testnet": 2,
    // "Fantom Testnet": 1.2,
    "Polygon Mumbai": 5,
    "Optimism Goerli": 12,
    "Aurora Testnet": 1.2,
};

export const CHAINS: {
    [key in chainType[number]]: Chain;
} = {
    //
    // TEST CHAINS
    // ----------------------------------------------------------------------
    // "Rinkeby": chain.rinkeby,

    // Goerli: chain.goerli,

    // "Avalanche Testnet": {
    //     id: 43113,
    //     name: "Avalanche Testnet",
    //     database: "Avalanche",
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: "Avalanche",
    //         symbol: "AVAX",
    //     },
    //     rpcUrls: {
    //         default: "https://api.avax-test.network/ext/bc/C/rpc",
    //     },
    //     blockExplorers: {
    //         default: { name: "Snowtrace", url: "https://testnet.snowtrace.io" },
    //     },
    //     testnet: true,
    // },

    // "Binance Testnet": {
    //     id: 97,
    //     name: "Binance Testnet",
    //     database: "Binance",
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: "BSC",
    //         symbol: "BNB"
    //     },
    //     rpcUrls: {
    //         default: "https://data-seed-prebsc-1-s1.binance.org:8545"
    //     },
    //     blockExplorers: {
    //         default: { name: "bscscan", url: "https://testnet.bscscan.com" }
    //     },
    //     testnet: true
    // },

    // "Arbitrum Testnet": chain.arbitrumGoerli,

    // "Fantom Testnet": {
    //     id: 4002,
    //     name: "Fantom Testnet",
    //     database: "Fantom",
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: "Fantom",
    //         symbol: "FTM"
    //     },
    //     rpcUrls: {
    //         default: "https://rpc.testnet.fantom.network/"
    //     },
    //     blockExplorers: {
    //         default: { name: "ftmscan", url: "https://testnet.ftmscan.com" }
    //     },
    //     testnet: true
    // },

    "Polygon Mumbai": chain.polygonMumbai,

    "Optimism Goerli": {
        id: 420,
        name: "Optimism Goerli",
        network: "Optimism",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: `https://optimism-goerli.infura.io/v3/${INFURA_ID}`,
        },
        blockExplorers: {
            default: { name: "optiscan", url: "https://goerli-optimism.etherscan.io/" },
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
            default: `https://aurora-testnet.infura.io/v3/${INFURA_ID}`,
        },
        blockExplorers: {
            default: { name: "aurorascan", url: "https://testnet.aurorascan.dev" },
        },
        testnet: true,
    },

    //
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    Polygon: chain.polygon,

    Optimism: chain.optimism,

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
            default: `https://aurora-mainnet.infura.io/v3/${INFURA_ID}`,
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
    return getChains().map((chain) => chain.id);
};

export const getChainNames = () => {
    return getChains().map((chain) => chain.name);
};

export const getChain = (chainId: number): Chain => {
    return getChains().find((chain) => chain.id === chainId);
};

export function getChainScanner(chainId: number | undefined, address: string | undefined) {
    return chainId && address ? `${getChain(chainId).blockExplorers.default.url}/address/${address}` : "";
}

export const getTokenSymbol = (chainId: number) => {
    return getChain(chainId).nativeCurrency.symbol;
};

export const isBlockchainSupported = (chain: { id }) => {
    return chain ? getChainIds().includes(chain.id) : false;
};

export const getLogoURI = (chain: number | string): StaticImageData => {
    return (
        (typeof chain === "number" ? CHAINS_IMG[getChain(chain)?.name]?.src : CHAINS_IMG[chain]) ||
        CHAINS_IMG["Ethereum"]
    );
};

export const getSecondsPerBlock = (chain: number | string): number => {
    return (
        (typeof chain === "number" ? CHAINS_BLOCKTIME[getChain(chain)?.name] : CHAINS_BLOCKTIME[chain]) ||
        CHAINS_BLOCKTIME["Goerli"]
    );
};

export const getBlocksPerDay = (chain: number | string): number => {
    return (60 * 60 * 24) / getSecondsPerBlock(chain);
};
