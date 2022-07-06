import { ethers, getDefaultProvider } from "ethers";
import { GOVERNOR_ABI } from "../abis";

export async function getName(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const name = await governor.name();
    console.log(name);
    return name;

    // const supply = await erc20_rw.totalSupply();
    // console.log(supply);
}
