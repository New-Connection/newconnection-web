import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI } from "abis";

export async function createProposal(contractAddress: string, signer: Signer, proposalDescription) {
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    const encodedFunctionCall = governor.interface.encodeFunctionData("incrementExecutedProposals");

    const proposeTx = await governor.propose(
        [contractAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription
    );
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId.toString();
}

export type VotingType = 0 | 1 | 2 | undefined; //0 - Against, 1 - For, 2 - just results

export async function castVote(
    contractAddress: string,
    signer: Signer,
    proposalAddress: string,
    vote: VotingType
) {
    const governorContract = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    console.log("Contract Address", contractAddress);
    console.log("proposal Address", proposalAddress);
    console.log("Vote", vote);
    // proposalId: uint256, support: uint8
    const proposeTx = await governorContract.castVote(proposalAddress, vote);
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId._hex;
}
