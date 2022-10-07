import { ethers } from "ethers";
import { TREASURY_ABI } from "abis";
import { getTokenSymbol } from "interactions/contract";
import { provider } from "components";
import { Currency, getExchangeRate } from "utils";

export async function getTreasuryOwnerAddress(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, baseProvider);
    return await treasury.owner();
}

export async function getTreasuryBalance(contractAddress: string, chainId: number) {
    let baseProvider = provider({ chainId });
    const treasury = new ethers.Contract(contractAddress, TREASURY_ABI, baseProvider);

    const ethBalance = +ethers.utils.formatEther(await baseProvider.getBalance(treasury.address));

    const exchangeRate = await getExchangeRate(getTokenSymbol(chainId), Currency.USD);

    return ethBalance * exchangeRate;
}
