import { ethers, Signer } from "ethers";
import { GOVERNANCE_NFT_ABI } from "../abis";

export async function setURI(contractAddress: string, signer: Signer, URI: string) {
    const nft = new ethers.Contract(contractAddress, GOVERNANCE_NFT_ABI, signer);

    return await nft.setBaseURI(
        URI
    );
}
