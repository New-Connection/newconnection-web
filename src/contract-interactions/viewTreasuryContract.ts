import { ethers, Signer } from "ethers";
import {  TREASURY_ABI } from "../abis";
import { networkDetails } from "../utils/blockchains";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";

export async function getTreasuryOwnerAddress(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, provider);
    return await treasury.owner();
}
