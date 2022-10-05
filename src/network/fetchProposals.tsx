import { IProposalDetail, IProposalPageForm } from "types/forms";
import {
    getProposer,
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes,
    proposalSnapshot,
} from "contract-interactions/viewGovernorContract";
import { Moralis } from "moralis-v1";

export async function fetchProposals(proposalQuery: any) {
    const results: Moralis.Object<Moralis.Attributes>[] = await proposalQuery();
    const proposals: IProposalPageForm[] = await Promise.all(
        results.map(async (proposalMoralis) => {
            const governorAddress = proposalMoralis.get("governorAddress");
            const chainId = proposalMoralis.get("chainId");
            const proposalId = proposalMoralis.get("proposalId");
            const proposal: IProposalPageForm = {
                name: proposalMoralis.get("name"),
                governorAddress: governorAddress,
                chainId: chainId,
                proposalId: proposalId,
                tokenName: proposalMoralis.get("tokenName"),
                description: proposalMoralis.get("description"),
                shortDescription: proposalMoralis.get("shortDescription"),
                isActive: await isProposalActive(governorAddress, chainId, proposalId),
                forVotes: await proposalForVotes(governorAddress, chainId, proposalId),
                againstVotes: await proposalAgainstVotes(governorAddress, chainId, proposalId),
                endDateTimestamp: await proposalDeadline(governorAddress, chainId, proposalId),
            };
            return proposal;
        })
    );
    return proposals;
}

export async function fetchDetailProposal(proposalQuery: Function) {
    const proposalMoralis: Moralis.Object<Moralis.Attributes> = (await proposalQuery())[0];
    const governorAddress = proposalMoralis.get("governorAddress");
    const chainId = proposalMoralis.get("chainId");
    const proposalId = proposalMoralis.get("proposalId");
    const proposal: IProposalDetail = {
        proposalId: proposalId,
        governorAddress: governorAddress,
        chainId: chainId,
        name: proposalMoralis.get("name"),
        description: proposalMoralis.get("description"),
        shortDescription: proposalMoralis.get("shortDescription"),
        tokenAddress: proposalMoralis.get("tokenAddress"),
        tokenName: proposalMoralis.get("tokenName"),
        isActive: await isProposalActive(governorAddress, chainId, proposalId),
        startDateTimestamp: await proposalSnapshot(governorAddress, chainId, proposalId),
        endDateTimestamp: await proposalDeadline(governorAddress, chainId, proposalId),
        forVotes: await proposalForVotes(governorAddress, chainId, proposalId),
        againstVotes: await proposalAgainstVotes(governorAddress, chainId, proposalId),
        ownerAddress: await getProposer(governorAddress, chainId, proposalId),
    };
    return proposal;
}
