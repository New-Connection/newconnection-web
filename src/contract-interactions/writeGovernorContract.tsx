import { ethers, Signer } from "ethers";
import { GOVERNOR_ABI, GOVERNANCE_NFT_ABI } from "abis";

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

export type VotingType = 0 | 1 | 2 | undefined; //0 - Against, 1 - For, 2 - just results

export async function castVote(
    contractAddress: string,
    signer: Signer,
    proposalAddress: string,
    vote: VotingType
) {
    const governorContract = new ethers.Contract(contractAddress, GOVERNOR_ABI, signer);
    console.log("Contract Address", contractAddress);
    console.log("proposals Address", proposalAddress);
    console.log("Vote", vote);
    // proposalId: uint256, support: uint8
    const proposeTx = await governorContract.castVote(proposalAddress, vote);
    const proposeReceipt = await proposeTx.wait();

    return proposeReceipt.events![0].args!.proposalId._hex;
}

export async function addToken(
    governorContractAddress: string,
    signer: Signer,
    tokenAddress: string
) {
    const governorContract = new ethers.Contract(governorContractAddress, GOVERNOR_ABI, signer);
    const addTokenTx = await governorContract.addToken(tokenAddress);
    await addTokenTx.wait();
}
