import { ethers } from "ethers";
import { GOVERNANCE_NFT_ABI } from "abis";
import { provider } from "components";
import { handleContractError } from "utils";

export async function getNftName(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.name();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getPrice(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return ethers.utils.formatEther(await nft.pricePerToken());
    } catch (e) {
        handleContractError(e);
    }
}

export async function getSymbol(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.symbol();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getTokenURI(contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        return await nft.baseURI();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getSupplyNumber(contractAddress: string, chainId: number): Promise<string> {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        const totalSupply = await nft.maxMintId();
        return totalSupply.toString();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getNumberOfMintedTokens(contractAddress: string, chainId: number): Promise<string> {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        const nextMintId = await nft.nextMintId();
        return nextMintId.toString();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getNumAvailableToMint(userAddress: string, contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        const available = await nft.numAvailableToMint(userAddress);
        return available.toString();
    } catch (e) {
        handleContractError(e);
    }
}

export async function getNumberOfTokenInOwnerAddress(userAddress: string, contractAddress: string, chainId: number) {
    try {
        let baseProvider = provider({ chainId });
        const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, baseProvider);
        const balance = await nft.balanceOf(userAddress);
        return balance.toString(); // 0 if you don't have tokens
    } catch (e) {
        handleContractError(e);
    }
}
