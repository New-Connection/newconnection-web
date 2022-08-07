import { ethers } from "ethers";
import { GOVERNANCE_NFT_ABI } from "abis";
import { networkDetails } from "utils/constants";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";

export async function getName(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
    return await nft.name();
}

export async function getTokenURI(contractAddress: string, chainId: number) {
    try {
        let provider = networkDetails[chainId].chainProviders as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
        return await nft.baseURI();
    } catch (e) {
        console.log("Error while parsing token URI");
    }
}

export async function getSupplyNumber(contractAddress: string, chainId: number) {
    try {
        let provider = networkDetails[chainId].chainProviders as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
        return await nft.maxMintId();
    } catch (e) {
        console.log("Error to get max mint id of NFT");
    }
}

export async function getNumberOfMintedTokens(contractAddress: string, chainId: number) {
    try {
        let provider = networkDetails[chainId].chainProviders as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
        const nextMintId = await nft.nextMintId();
        return nextMintId.toString()
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
        let provider = networkDetails[chainId].chainProviders as BaseProvider;
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
        return await nft.numAvailableToMint(userAddress);
    } catch (e) {
        console.log("Error in getNumAvailableToMint()");
    }
}
