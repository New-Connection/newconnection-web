import { ethers } from "ethers";
import { GOVERNOR_ABI } from "../abis";

export async function getName(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.name();
}

export async function getGovernorInfoURI(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.governorInfoURI();
}
