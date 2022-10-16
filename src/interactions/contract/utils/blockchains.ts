import ASSETS from "assets";
import { chain } from "wagmi";
import { StaticImageData } from "next/image";
import { INFURA_ID } from "utils";
import { Chain } from "@rainbow-me/rainbowkit";

enum ChainEnum {
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    ETH = "Ethereum",
    POL = "Polygon",
    OPT = "Optimism",
    AUR = "Aurora",

    // TEST CHAINS
    // ----------------------------------------------------------------------
    POL_TEST = "Polygon Mumbai",
    OPT_TEST = "Optimism Goerli",
    AUR_TEST = "Aurora Testnet",
}

type chainType = `${ChainEnum}`;

const CHAINS_IMG: {
    [key in chainType]: StaticImageData;
} = {
    Ethereum: ASSETS.Ethereum,

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
    [key in chainType]: number;
} = {
    // MAIN CHAINS
    // ----------------------------------------------------------------------
    Ethereum: 12,
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

const CHAINS: Chain[] = [
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

    // TEST CHAINS
    // ----------------------------------------------------------------------
    chain.polygonMumbai,

    {
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

    {
        id: 1313161555,
        name: "Aurora Testnet",
        network: "Aurora",
        iconUrl: ASSETS.Aurora.src,
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

    // MAIN CHAINS
    // ----------------------------------------------------------------------
    chain.polygon,

    chain.optimism,

    {
        id: 1313161554,
        name: "Aurora",
        network: "Aurora",
        iconUrl: ASSETS.Aurora.src,
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
];

export const getChains = (): Chain[] => CHAINS;

export const getChainIds = (): number[] => getChains().map((chain) => chain.id);

export const getChainNames = (): string[] => getChains().map((chain) => chain.name);

export const getChain = (chain: number | string): Chain =>
    typeof chain === "number" ? getChains().find((c) => c.id === chain) : getChains().find((c) => c.name === chain);

export const getChainScanner = (chainId: number | undefined, address: string | undefined): string =>
    chainId && address ? `${getChain(chainId).blockExplorers.default.url}/address/${address}` : "";

export const getTokenSymbol = (chainId: number) => getChain(chainId).nativeCurrency.symbol;

export const isBlockchainSupported = (chain: { id }) => (chain ? getChainIds().includes(chain.id) : false);

export const getLogoURI = (chain: number | string): StaticImageData =>
    (typeof chain === "number" ? CHAINS_IMG[getChain(chain)?.name]?.src : CHAINS_IMG[chain]) || CHAINS_IMG["Ethereum"];

export const getSecondsPerBlock = (chain: number | string): number =>
    (typeof chain === "number" ? CHAINS_BLOCKTIME[getChain(chain)?.name] : CHAINS_BLOCKTIME[chain]) ||
    CHAINS_BLOCKTIME["Ethereum"];

export const getBlocksPerDay = (chain: number | string): number => (60 * 60 * 24) / getSecondsPerBlock(chain);
