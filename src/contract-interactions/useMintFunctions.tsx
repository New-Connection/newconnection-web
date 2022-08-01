import toast from "react-hot-toast";
import { GOVERNANCE_NFT_ABI } from "abis";
import { ethers, Signer } from "ethers";

export async function mintClick(contractAddress: string, signer: Signer) {
    const erc20_rw = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);
    const tx = await erc20_rw.reserve(1);
    console.log(tx);
    console.log("Tx hash", tx.hash);

    if (tx) {
        if (tx.blockNumber) {
            toast.success(`DONE ✅ successful mint!`);
            console.log(tx);
        }
    }
    // const supply = await erc20_rw.totalSupply();
    // console.log(supply);
}
