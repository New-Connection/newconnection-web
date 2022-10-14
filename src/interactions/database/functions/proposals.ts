import { ICreateProposal, IProposalPageForm } from "types";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { proposalsCollection } from "interactions/database";
import { isProposalActive, proposalAgainstVotes, proposalDeadline, proposalForVotes } from "interactions/contract";

export const saveNewProposal = async (proposal: ICreateProposal) => {
    try {
        await addDoc(proposalsCollection, proposal);
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getAllProposals = async (url: string) => {
    const proposals: IProposalPageForm[] = [];

    const q = query(proposalsCollection, where("governorUrl", "==", url));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const proposal = doc.data() as IProposalPageForm;

        const governorAddress = proposal.governorAddress;
        const chainId = proposal.chainId;
        const proposalId = proposal.proposalId;

        isProposalActive(governorAddress, chainId, proposalId).then((isActive) => (proposal.isActive = isActive));
        proposalForVotes(governorAddress, chainId, proposalId).then((forVotes) => (proposal.forVotes = forVotes));
        proposalAgainstVotes(governorAddress, chainId, proposalId).then(
            (againstVotes) => (proposal.againstVotes = againstVotes)
        );
        proposalDeadline(governorAddress, chainId, proposalId).then(
            (endDateTimestamp) => (proposal.endDateTimestamp = endDateTimestamp)
        );

        proposals.push(proposal);
    });

    return proposals;
};
