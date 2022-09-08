import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";
import Avalanche from "assets/chains/Avalanche.png";
import Fantom from "assets/chains/Fantom.png";
import Optimism from "assets/chains/Optimism.png";
import { ethers, providers } from "ethers";
import { allChains, Chain } from "wagmi";
import ETH from "assets/chains/Ethereum.png";
import MATIC from "assets/chains/Polygon.png";
import AVAX from "assets/chains/Avalanche.png";
import BNB from "assets/chains/Binance.png";
import ARB from "assets/chains/Arbitrum.png";
import OPT from "assets/chains/Optimism.png";
import FTM from "assets/chains/Fantom.png";
import { alchemyId, infuraId } from "./constants";

export const CHAINS = [
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Binance",
    "Avalanche",
    "Fantom",
    "Optimism",
];

export const CHAINS_IMG = {
    Ethereum: Ethereum,
    Polygon: Polygon,
    Arbitrum: Arbitrum,
    Binance: Binance,
    Avalanche: Avalanche,
    Fantom: Fantom,
    Optimism: Optimism,
};

//TODO: change to main networks
export const TEST_CHAINS_IDS = {
    Ethereum: 4, // rinkeby
    Polygon: 80001, // mumbai
    Arbitrum: 421611, // arbitrum rinkeby
    Binance: 97, // bsctest
    Avalanche: 43113, // fuji
    Fantom: 4002, // fantom testnet
    Optimism: 69, // optimism kovan
};

export const CHAINS_IDS = {
    Ethereum: 1,
    Polygon: 137,
    Arbitrum: 42161,
    Binance: 56,
    Avalanche: 43114,
    Fantom: 250,
    Optimism: 10,
};

export const isBlockchainSupported = (chain: { id }) => {
    if (!chain) {
        return false;
    }
    return SupportedChainIds.includes(chain.id);
};

export const defaultProvider = providers.getDefaultProvider(4, {
    alchemy: alchemyId,
    infura: infuraId,
});

export const polygonTestnet: Chain = {
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
        default: { name: "Polygonscan", url: "https://mumbai.polygonscan.com/" },
    },
    testnet: true,
};

export const avalancheTestnet: Chain = {
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
};

export const bscTestnet: Chain = {
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
};

export const arbitrumTestnet: Chain = {
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
};

export const optimismTestnet: Chain = {
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
};

export const fantomTestnet: Chain = {
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
};

export const SupportedChainNames = [
    polygonTestnet.name,
    avalancheTestnet.name,
    "Rinkeby",
    bscTestnet.name,
    arbitrumTestnet.name,
    optimismTestnet.name,
    fantomTestnet.name,
];

export const SupportedChainIds = [
    polygonTestnet.id,
    avalancheTestnet.id,
    4,
    bscTestnet.id,
    arbitrumTestnet.id,
    optimismTestnet.id,
    fantomTestnet.id,
];

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
    5: {
        rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
        chainProviders: providers.getDefaultProvider(5, {
            alchemy: alchemyId,
            infura: infuraId,
        }),
        blockExplorerURL: "https://goerli.etherscan.io",
        blockExplorerName: "Etherscan",
        prefix: "goerli",
        logoURI: ETH.src,
    },
    // 1: {
    //     rpcUrl: "https://rpc.ankr.com/eth",
    //     chainProviders: new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth"),
    //     blockExplorerURL: "https://etherscan.io/",
    //     blockExplorerName: "Etherscan",
    //     prefix: "ethereum",
    //     logoURI: ETH.src,
    //     tokenListId: "ethereum",
    // },

    80001: {
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        chainProviders: new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com"),
        blockExplorerURL: "https://polygonscan.com/",
        blockExplorerName: "Polygonscan",
        prefix: "mumbai",
        logoURI: MATIC.src,
        tokenListId: "MATIC",
    },

    43113: {
        rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
        chainProviders: new ethers.providers.JsonRpcProvider(
            "https://api.avax-test.network/ext/bc/C/rpc"
        ),
        blockExplorerURL: "https://testnet.snowtrace.io/",
        blockExplorerName: "Snowtrace",
        prefix: "fuji",
        logoURI: AVAX.src,
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
        logoURI: ETH.src,
        tokenListId: "ETH",
    },

    97: {
        rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545`,
        chainProviders: new ethers.providers.JsonRpcProvider(
            "https://data-seed-prebsc-1-s1.binance.org:8545"
        ),
        blockExplorerURL: "https://testnet.bscscan.com",
        blockExplorerName: "tBscscan",
        prefix: "tBNB",
        logoURI: BNB.src,
    },

    421611: {
        rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
        chainProviders: new ethers.providers.JsonRpcProvider("https://rinkeby.arbitrum.io/rpc"),
        blockExplorerURL: "https://testnet.arbiscan.io",
        blockExplorerName: "tArbiscan",
        prefix: "ETH",
        logoURI: ARB.src,
    },

    69: {
        rpcUrl: `https://kovan.optimism.io/`,
        chainProviders: new ethers.providers.JsonRpcProvider("https://kovan.optimism.io/"),
        blockExplorerURL: "https://kovan-optimistic.etherscan.io",
        blockExplorerName: "tOptiscan",
        prefix: "ETH",
        logoURI: OPT.src,
    },

    4002: {
        rpcUrl: `https://rpc.testnet.fantom.network/`,
        chainProviders: new ethers.providers.JsonRpcProvider("https://rpc.testnet.fantom.network/"),
        blockExplorerURL: "https://testnet.ftmscan.com",
        blockExplorerName: "tFtmscan",
        prefix: "FTM",
        logoURI: FTM.src,
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
    console.log(chain);
    return chain;
});

export const chains: Chain[] = [...formattedChains];
