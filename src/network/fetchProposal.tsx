import { IProposalPageForm } from "types/forms";
import {
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes,
} from "contract-interactions/viewGovernorContract";

export async function fetchProposal(proposalQuery: any) {
    try {
        const results = await proposalQuery();
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
                    deadline: await proposalDeadline(governorAddress, chainId, proposalId),
                    options: [],
                    blockchain: [],
                };
                return proposal;
            })
        );
        return proposals;
    } catch (e) {
        console.log("[ERROR] Fetch Proposal", e);
    }
}
