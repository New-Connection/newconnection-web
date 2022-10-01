import { IProposalDetail, IProposalPageForm } from "types/forms";
import {
    isProposalActive,
    proposalAgainstVotes,
    proposalDeadline,
    proposalForVotes
} from "contract-interactions/viewGovernorContract";
import { Moralis } from "moralis-v1";

export async function fetchProposals(proposalQuery: any) {
    try {
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
                    deadline: await proposalDeadline(governorAddress, chainId, proposalId),
                    options: [],
                    blockchain: []
                };
                return proposal;
            })
        );
        return proposals;
    } catch (e) {
        console.log("[ERROR] Fetch Proposal", e);
    }
}

export async function fetchDetailProposal(proposalQuery: any) {
    const result: Moralis.Object<Moralis.Attributes> = (await proposalQuery())[0];
    const proposal: IProposalDetail = {
        title: result.get("name"),
        description: result.get("description"),
        shortDescription: result.get("shortDescription"),
        governorAddress: result.get("governorAddress"),
        chainId: result.get("chainId")
    };
    return proposal;
}