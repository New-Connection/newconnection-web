import { IProposalPageForm } from "types";
import { isProposalActive, proposalAgainstVotes, proposalDeadline, proposalForVotes } from "interactions/contract";
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
                tokenAddress: proposalMoralis.get("tokenAddress"),
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
