import { ethers, providers } from "ethers";
import { Chain, allChains } from "wagmi";

import ETH from "assets/chains/Ethereum.png";
import BNB from "assets/chains/Binance.png";
import MATIC from "assets/chains/Polygon.png";

// IPFS MODULE
export const infuraIpfsApiEndpoint = "https://ipfs.infura.io:5001";
export const infuraIPFS = "";

// NFT-STORAGE MODULE
export const NFT_STORAGE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3MkRmOTliNkJDZjhGODlmOTQ4ODkwMTYyN0M5MUZhQkZENUU3RDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzMwMzgxOTIwOCwibmFtZSI6Ik5ld0Nvbm5lY3Rpb24ifQ.1LBmCk5ZRmzQVjSDXmV8Vugt85blOz0PBwTdLX1a9Rk";

// EVM MODULE
export const infuraId = "9b42ce0bea0a40c98832bdef4f0fb5cc";
export const alchemyId = "EYaU8KZOLuaFhqXUxa5zzXhaXk6qC2SW";
export const BLOCKS_IN_DAY = 6545;

//Moralis
export const moralisAppId = "iAzZ2yHjWMRkMgBuRwBv3ZdwatednKBAw4MpCV0D";
export const moralisServerUrl = "https://pmaspuub0lgb.usemoralis.com:2053/server";

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
    1: {
        rpcUrl: "https://rpc.ankr.com/eth",
        chainProviders: new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth"),
        blockExplorerURL: "https://etherscan.io/",
        blockExplorerName: "Etherscan",
        prefix: "ethereum",
        logoURI: ETH.src,
        tokenListId: "ethereum",
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

export const secondsByDuration: ISecondsByDuration = {
    week: 7 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    year: 365 * 24 * 60 * 60,
};
