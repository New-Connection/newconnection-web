import { ethers, Signer } from "ethers";
import { GOVERNANCE_NFT_ABI } from "abis";
import { handleContractError } from "utils";

interface IAddToWhitelist {
    addressNFT: string;
    walletAddress?: string;
    signer?: Signer;
}

export async function AddToWhitelist({ addressNFT, walletAddress, signer }: IAddToWhitelist) {
    const erc721_rw = new ethers.Contract(addressNFT, GOVERNANCE_NFT_ABI, signer);
    try {
        const tx = await erc721_rw.setAllowList([walletAddress], 1);
        await tx.wait();
        console.log("Transaction add to WL", tx);
        return true;
    } catch (e) {
        handleContractError(e);
        return false;
    }
}

export async function setURI(contractAddress: string, signer: Signer, URI: string) {
    const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);

    return await nft.setBaseURI(URI);
}

export async function mintReserveAndDelegation(contractAddress: string, signer: Signer) {
    const erc20_rw = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);
    const tx = await erc20_rw.reserve(1);
    await tx.wait();
    const address = await signer.getAddress();
    const delegateTx = await erc20_rw.delegate(address);
    console.log(tx);
    console.log(delegateTx);
    console.log("Tx hash", tx.hash);

    return tx;
    // const supply = await erc20_rw.totalSupply();
    // console.log(supply);
}

export async function mintNFT(contractAddress: string, signer: Signer) {
    const erc20_rw = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);
    const tx = await erc20_rw.mint();
    await tx.wait();
    const address = await signer.getAddress();
    const delegateTx = await erc20_rw.delegate(address);
    await delegateTx.wait();
    console.log(tx);
    console.log("Tx hash", tx.hash);
}
