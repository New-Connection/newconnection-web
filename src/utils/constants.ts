import { ethers, providers } from "ethers";
import { Chain, allChains } from "wagmi";

import ETH from "assets/chains/Ethereum.png";
import BNB from "assets/chains/Binance.png";
import MATIC from "assets/chains/Polygon.png";
import AVAX from "assets/chains/Avalanche.png";

// IPFS MODULE
export const infuraIpfsApiEndpoint = "https://ipfs.infura.io:5001";
export const infuraIPFS = "";

// NFT-STORAGE MODULE
export const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;
   
// EVM MODULE
export const infuraId = process.env.REACT_APP_INFURA_ID;
export const alchemyId = process.env.REACT_APP_ALCHEMY_ID;
export const BLOCKS_IN_DAY = 6545;
export const SECONDS_IN_BLOCK = 13.2;

//Moralis
export const moralisAppId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
export const moralisServerUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_ID_URL;

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

interface ISecondsByDuration {
    [key: string]: number;
}

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
        default: "https://rpc-mumbai.matic.today",
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

export const SupportedChainName = ["Goerli", polygonTestnet.name, avalancheTestnet.name];

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

export const secondsByDuration: ISecondsByDuration = {
    week: 7 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    year: 365 * 24 * 60 * 60,
};
