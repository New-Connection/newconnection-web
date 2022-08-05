import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI } from "../abis";

export type VotingType = 0 | 1 | 2 | undefined; //0 - Against, 1 - For, 2 - just results

export async function castVote(
    contractAddress: string,
    signer: Signer,
    proposalAddress: string,
    vote: VotingType
) {
    const governorContract = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);

    // proposalId: uint256, support: uint8
    const proposeTx = await governorContract.castVote(proposalAddress, vote);
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId._hex;
}
