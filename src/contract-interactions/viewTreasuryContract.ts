import { ethers } from "ethers";
import { TREASURY_ABI } from "abis";
import { networkDetails } from "utils/blockchains";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";
import { getExchangeRate } from "utils/cryptocompare";

export async function getTreasuryOwnerAddress(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, provider);
    return await treasury.owner();
}

export async function getTreasuryBalance(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, provider);

    const ethBalance = +ethers.utils.formatEther(await provider.getBalance(treasury.address));
    // console.log(ethBalance);

    const exchangeRate = await getExchangeRate(networkDetails[chainId].tokenListId, "USD");
    // console.log(x);

    return ethBalance * exchangeRate;
}
