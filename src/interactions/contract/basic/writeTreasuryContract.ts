import { ethers, Signer } from "ethers";
import { TREASURY_ABI } from "abis";

export async function transferTreasuryOwnership(contractAddress: string, newOwnerAddress: string, signer: Signer) {
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, signer);

    return await treasury.transferOwnership(newOwnerAddress);
}
