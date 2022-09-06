import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI, GOVERNANCE_NFT_ABI } from "../abis";

export async function createProposal(
    contractAddress: string,
    signer: Signer,
    proposalDescription: string,
    tokenAddress: string
) {
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    const encodedFunctionCall = governor.interface.encodeFunctionData("incrementExecutedProposals");
    const nftToken = new ethers.Contract(tokenAddress, GOVERNANCE_NFT_ABI, signer);
    const proposeTx = await governor.propose(
        [contractAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription,
        nftToken.address
    );

    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId.toString();
}
