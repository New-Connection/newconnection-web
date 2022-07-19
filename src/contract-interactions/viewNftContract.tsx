import { ethers } from "ethers";
import { GOVERNANCE_NFT_ABI } from "abis";

export async function getName(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, provider);
    return await nft.name();
}
