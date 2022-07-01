import toast from "react-hot-toast";
import { GovernorNFTABI } from "abis/GovernanceNFT";
import { ethers, Signer } from "ethers";

export async function mintClick(contractAddress: string, signer: Signer) {
    const erc20_rw = new ethers.Contract(contractAddress, GovernorNFTABI, signer);
    const tx = await erc20_rw.reserve(1);
    console.log(tx);

    toast.success(`DONE ✅ successful mint!`);
    // const supply = await erc20_rw.totalSupply();
    // console.log(supply);
}
