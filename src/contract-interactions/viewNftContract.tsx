import { ethers } from "ethers";
import { GOVERNANCE_NFT_ABI } from "abis";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";
import { provider } from "components/Web3";

export async function getNftName(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.name();
    } catch (e) {
        console.log("Error while parsing NFT.name");
    }
}

export async function getPrice(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return ethers.utils.formatEther(await nft.pricePerToken());
    } catch (e) {
        console.log("Error while parsing NFT price per token");
    }
}

export async function getSymbol(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.symbol();
    } catch (e) {
        console.log("Error while parsing NFT symbol");
    }
}

export async function getTokenURI(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.baseURI();
    } catch (e) {
        console.log("Error while parsing NFT URL");
    }
}

export async function getSupplyNumber(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.maxMintId();
    } catch (e) {
        console.log("Error to get max mint id of NFT");
    }
}

export async function getNumberOfMintedTokens(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        const nextMintId = await nft.nextMintId();
        return nextMintId.toString();
    } catch (e) {
        console.log(e);
        console.log("Error to get next mint id of NFT");
    }
}

export async function getNumAvailableToMint(
    userAddress: string,
    contractAddress: string,
    chainId: number
) {
    try {
        let baseProvider = provider({ chainId }) as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.numAvailableToMint(userAddress);
    } catch (e) {
        console.log("Error in getNumAvailableToMint()");
    }
}
