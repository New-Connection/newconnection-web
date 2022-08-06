import { ethers } from "ethers";
import { GOVERNOR_ABI } from "../abis";
import { networkDetails, SECONDS_IN_BLOCK } from "../utils/constants";
import { BaseProvider } from "@ethersproject/providers/src.ts/base-provider";

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
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.name();
}

export async function getGovernorInfoURI(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return await governor.governorInfoURI();
}

export async function getTotalProposals(contractAddress: string, chainId: number) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    return (await governor.getTotalProposals()).toString();
}

export async function isProposalActive(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const proposalState = await governor.state(proposalId);
    return proposalState == ProposalState.Active;
}

export async function proposalDeadline(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const votingPeriod = (await governor.votingPeriod()).toNumber();
    const blockNumber = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (await provider.getBlock(blockNumber)).timestamp + SECONDS_IN_BLOCK * votingPeriod;
}

export async function proposalSnapshot(
    contractAddress: string,
    chainId: number,
    proposalId: string
) {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const blockNumber = (await governor.proposalSnapshot(proposalId)).toNumber();
    return (await provider.getBlock(blockNumber)).timestamp;
}

export async function proposalForVotes(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const votes = await governor.proposalVotes(proposalId);
    return votes["forVotes"].toString();
}

export async function proposalAgainstVotes(
    contractAddress: string,
    chainId: number,
    proposalId: string
): Promise<string> {
    let provider = networkDetails[chainId].chainProviders as BaseProvider;
    const governor = new ethers.Contract(contractAddress, GOVERNOR_ABI, provider);
    const votes = await governor.proposalVotes(proposalId);
    console.log(votes);
    return votes["againstVotes"].toString();
}
