import { useContractWrite, useProvider, usePrepareContractWrite, useContractRead } from "wagmi";
import { GOVERNANCE_NFT_ABI } from "abis/";
import { ethers, Signer } from "ethers";
import toast from "react-hot-toast";

interface IAddToWhitelist {
    addressNFT: string;
    walletAddress?: string;
    signer?: Signer;
}

export async function AddToWhitelist({ addressNFT, walletAddress, signer }: IAddToWhitelist) {
    const erc721_rw = new ethers.Contract(addressNFT, GOVERNANCE_NFT_ABI, signer);
    try {
        const tx = await erc721_rw.setAllowList([walletAddress], 1);
        console.log("Transaction add to WL", tx);
    } catch (e) {
        console.log("[ERROR] add to whitelist", e);
    }
}
