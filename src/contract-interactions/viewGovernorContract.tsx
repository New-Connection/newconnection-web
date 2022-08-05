import { ethers } from "ethers";
import { GOVERNOR_ABI } from "../abis";

enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed,
}

export async function getName(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.name();
}

export async function getGovernorInfoURI(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.governorInfoURI();
}

export async function getTotalProposals(contractAddress: string, chainId: number) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.getTotalProposals();
}

export async function isProposalActive(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const proposalState = await governor.state(proposalId);
    return proposalState == ProposalState.Active;
}

export async function proposalDeadline(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.proposalDeadline(proposalId);
}

export async function proposalVotesFor(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const votes = await governor.proposalVotes(proposalId);
    return votes["forVotes"].toString();
}

export async function proposalVotesAgainst(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let provider = ethers.getDefaultProvider(chainId);
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const votes = await governor.proposalVotes(proposalId);
    return votes["againstVotes"].toString();
}
