import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI } from "../abis";

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
