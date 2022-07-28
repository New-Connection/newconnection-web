import toast from "react-hot-toast";
import { GOVERNANCE_NFT_ABI } from "abis";
import { ethers, Signer } from "ethers";

export async function mintClick(contractAddress: string, signer: Signer) {
    const erc20_rw = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);
    const tx = await erc20_rw.reserve(1);
    const address = await signer.getAddress();
    const delegateTx = await erc20_rw.delegate(address);
    console.log(tx);
    console.log(delegateTx);

    toast.success(`DONE ✅ successful mint!`);
    // const supply = await erc20_rw.totalSupply();
    // console.log(supply);
}
