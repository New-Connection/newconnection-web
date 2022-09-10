import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";
import Avalanche from "assets/chains/Avalanche.png";
import Fantom from "assets/chains/Fantom.png";
import Optimism from "assets/chains/Optimism.png";
import Aurora from "assets/chains/Aurora.png";
import { ethers, providers } from "ethers";
import { allChains, Chain } from "wagmi";
import { alchemyId, infuraId } from "./constants";
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
};

export const TEST_CHAINS = {
    Polygon: {
        id: 80001,
        name: "Polygon Mumbai",
        network: "Mumbai",
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
        network: "Fuji",
        nativeCurrency: {
            decimals: 18,
            name: "Avalanche",
            symbol: "AVAX",
        },
        rpcUrls: {
            default: "https://api.avax-test.network/ext/bc/C/rpc",
        },
        blockExplorers: {
            default: { name: "Snowtrace", url: "https://testnet.snowtrace.io/" },
        },
        testnet: true,
    },

    Binance: {
        id: 97,
        name: "BSC Testnet",
        network: "BSC",
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

    Arbitrum: {
        id: 421611,
        name: "Arbitrum Rinkeby",
        network: "Arbitrum",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "ETH",
        },
        rpcUrls: {
            default: "https://rinkeby.arbitrum.io/rpc",
        },
        blockExplorers: {
            default: { name: "arbiscan", url: "https://testnet.arbiscan.io" },
        },
        testnet: true,
    },

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
            symbol: "Eth",
        },
        rpcUrls: {
            default: "https://testnet.aurora.dev",
        },
        blockExplorers: {
            default: { name: "aurorascan", url: "https://testnet.aurorascan.dev" },
        },
        testnet: true,
    },

    getChains: function (): Chain[] {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain);
    },

    getChainIds: function () {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain.id)
            .concat(4); // rinkeby
    },

    getChainNames: function () {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain.name)
            .concat("Rinkeby"); // rinkeby
    },

    getChain: function (id: number): Chain {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain)
            .find((chain: Chain) => chain.id === id);
    },
};

export const MAIN_CHAINS = {
    Aurora: {
        id: 1313161554,
        name: "Aurora",
        network: "Aurora",
        nativeCurrency: {
            decimals: 18,
            name: "Ethereum",
            symbol: "Eth",
        },
        rpcUrls: {
            default: "https://mainnet.aurora.dev",
        },
        blockExplorers: {
            default: { name: "aurorascan", url: "https://aurorascan.dev" },
        },
        testnet: false,
    },

    getChains: function (): Chain[] {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain);
    },

    getChainIds: function () {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain.id)
            .concat(1); // ethereum
    },

    getChainNames: function () {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain.name)
            .concat("Ethereum"); // ethereum
    },

    getChain: function (id: number): Chain {
        return Object.values(this)
            .filter((value) => typeof value == "object")
            .map((chain: Chain) => chain)
            .find((chain: Chain) => chain.id === id);
    },
};

export const isBlockchainSupported = (chain: { id }) => {
    if (!chain) {
        return false;
    }
    return TEST_CHAINS.getChainIds().concat(MAIN_CHAINS.getChainIds()).includes(chain.id);
};

export const defaultProvider = providers.getDefaultProvider(4, {
    alchemy: alchemyId,
    infura: infuraId,
});

interface INetworkDetails {
    [key: number]: {
        rpcUrl: string;
        chainProviders: ethers.providers.BaseProvider;
        blockExplorerURL: string;
        blockExplorerName: string;
        prefix: string;
        logoURI: string;
        tokenListId?: string;
    };
}

export const networkDetails: INetworkDetails = {
    // TESTNETS

    5: {
        rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
        chainProviders: providers.getDefaultProvider(5, {
            alchemy: alchemyId,
            infura: infuraId,
        }),
        blockExplorerURL: "https://goerli.etherscan.io",
        blockExplorerName: "Etherscan",
        prefix: "goerli",
        logoURI: Ethereum.src,
    },

    80001: {
        rpcUrl: TEST_CHAINS.Polygon.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Polygon.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Polygon.blockExplorers.default.url,
        blockExplorerName: "Polygonscan",
        prefix: "mumbai",
        logoURI: Polygon.src,
        tokenListId: "MATIC",
    },

    43113: {
        rpcUrl: TEST_CHAINS.Avalanche.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Avalanche.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Avalanche.blockExplorers.default.url,
        blockExplorerName: "Snowtrace",
        prefix: "fuji",
        logoURI: Avalanche.src,
        tokenListId: "AVAX",
    },

    4: {
        rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
        chainProviders: providers.getDefaultProvider(4, {
            alchemy: alchemyId,
            infura: infuraId,
        }),
        blockExplorerURL: "https://rinkeby.etherscan.io/",
        blockExplorerName: "Etherscan",
        prefix: "Rinkeby",
        logoURI: Ethereum.src,
        tokenListId: "ETH",
    },

    97: {
        rpcUrl: TEST_CHAINS.Binance.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Binance.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Binance.blockExplorers.default.url,
        blockExplorerName: "tBscscan",
        prefix: "tBNB",
        logoURI: Binance.src,
    },

    421611: {
        rpcUrl: TEST_CHAINS.Arbitrum.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Arbitrum.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Arbitrum.blockExplorers.default.url,
        blockExplorerName: "tArbiscan",
        prefix: "ETH",
        logoURI: Arbitrum.src,
    },

    69: {
        rpcUrl: TEST_CHAINS.Optimism.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Optimism.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Optimism.blockExplorers.default.url,
        blockExplorerName: "tOptiscan",
        prefix: "ETH",
        logoURI: Optimism.src,
    },

    4002: {
        rpcUrl: TEST_CHAINS.Fantom.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Fantom.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Fantom.blockExplorers.default.url,
        blockExplorerName: "tFtmscan",
        prefix: "FTM",
        logoURI: Fantom.src,
    },

    1313161555: {
        rpcUrl: TEST_CHAINS.Aurora.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(TEST_CHAINS.Aurora.rpcUrls.default),
        blockExplorerURL: TEST_CHAINS.Aurora.blockExplorers.default.url,
        blockExplorerName: "aurorascan",
        prefix: "ETH",
        logoURI: Aurora.src,
    },

    //Mainnets

    1: {
        rpcUrl: "https://rpc.ankr.com/eth",
        chainProviders: new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth"),
        blockExplorerURL: "https://etherscan.io/",
        blockExplorerName: "Etherscan",
        prefix: "ethereum",
        logoURI: Ethereum.src,
        tokenListId: "ethereum",
    },

    1313161554: {
        rpcUrl: MAIN_CHAINS.Aurora.rpcUrls.default,
        chainProviders: new ethers.providers.JsonRpcProvider(MAIN_CHAINS.Aurora.rpcUrls.default),
        blockExplorerURL: MAIN_CHAINS.Aurora.blockExplorers.default.url,
        blockExplorerName: "aurorascan",
        prefix: "ETH",
        logoURI: Aurora.src,
    },
};

export const defaultChains: Chain[] = allChains.filter(
    (chain) => chain.name === "Goerli" || chain.name === "Mainnet"
);

const formattedChains = defaultChains.map((chain) => {
    if (chain.name === "Mainnet") {
        return { ...chain, name: "Ethereum" };
    }

    if (chain.name === "Goerli") {
        return { ...chain, name: "Goerli" };
    }
    return chain;
});

export const chains: Chain[] = [...formattedChains];
