import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI, TREASURY_ABI } from "abis";

export async function createProposal(
    contractAddress: string,
    signer: Signer,
    proposalDescription: string,
    tokenAddress: string
) {
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    const encodedFunctionCall = governor.interface.encodeFunctionData("incrementExecutedProposals");
    const proposeTx = await governor.propose(
        [contractAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription,
        tokenAddress
    );
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId.toString();
}

export async function createTransferProposal(
    contractAddress: string,
    signer: Signer,
    proposalDescription: string,
    tokenAddress: string,
    treasuryAddress: string,
    receiverAddress: string,
    receiveAmount: string
) {
    const treasury = new ethers.Contract(treasuryAddress, TREASURY_ABI, signer);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    const encodedFunctionCall = treasury.interface.encodeFunctionData("send", [
        receiverAddress,
        ethers.utils.parseEther(receiveAmount),
    ]);

    const proposeTx = await governor.propose(
        [contractAddress],
        [0],
        [encodedFunctionCall],
        proposalDescription,
        tokenAddress
    );
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId.toString();
}

export type VotingType = 0 | 1 | 2 | undefined; //0 - Against, 1 - For, 2 - just results

export async function castVote(contractAddress: string, signer: Signer, proposalAddress: string, vote: VotingType) {
    const governorContract = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    console.log("Contract Address", contractAddress);
    console.log("proposals Address", proposalAddress);
    console.log("Vote", vote);
    // proposalId: uint256, support: uint8
    const proposeTx = await governorContract.castVote(proposalAddress, vote);
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId._hex;
}

export async function addToken(governorContractAddress: string, signer: Signer, tokenAddress: string) {
    const governorContract = new ethers.Contract(governorContractAddress, GOVERNOR_ABI, signer);
    return await governorContract.addToken(tokenAddress);
}
