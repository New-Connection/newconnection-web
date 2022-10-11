import { IProposalPageForm } from "types";
import { isProposalActive, proposalAgainstVotes, proposalDeadline, proposalForVotes } from "interactions/contract";
import { Moralis } from "moralis-v1";
import { ProposalMoralisClass } from "interactions/database";

export async function fetchProposals(governorUrl: string) {
    const proposalQuery = new Moralis.Query(ProposalMoralisClass);
    proposalQuery.equalTo("governorUrl", governorUrl);

    const proposalsInstances = await proposalQuery.find();

    if (!proposalsInstances) {
        return;
    }

    const proposals: IProposalPageForm[] = await Promise.all(
        proposalsInstances.map(async (proposalInstance) => {
            const governorAddress = proposalInstance.get("governorAddress");
            const chainId = proposalInstance.get("chainId");
            const proposalId = proposalInstance.get("proposalId");
            const proposal: IProposalPageForm = {
                name: proposalInstance.get("name"),
                governorAddress: governorAddress,
                chainId: chainId,
                proposalId: proposalId,
                tokenName: proposalInstance.get("tokenName"),
                tokenAddress: proposalInstance.get("tokenAddress"),
                description: proposalInstance.get("description"),
                shortDescription: proposalInstance.get("shortDescription"),
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
