import { ICreateProposal, IProposalPageForm } from "types";
import { addDoc, DocumentData, getDocs, query, where } from "firebase/firestore";
import { proposalsCollection } from "interactions/database";
import { getProposalState, proposalAgainstVotes, proposalDeadline, proposalForVotes } from "interactions/contract";

export const saveNewProposal = async (proposal: ICreateProposal) => {
    try {
        await addDoc(proposalsCollection, proposal);
        console.log("Document written");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

const fetchContractData = async (doc: DocumentData) => {
    const proposal = doc.data() as IProposalPageForm;

    const governorAddress = proposal.governorAddress;
    const chainId = proposal.chainId;
    const proposalId = proposal.proposalId;

    proposal.proposalState = await getProposalState(governorAddress, chainId, proposalId);
    proposal.forVotes = await proposalForVotes(governorAddress, chainId, proposalId);
    proposal.againstVotes = await proposalAgainstVotes(governorAddress, chainId, proposalId);
    proposal.endDateTimestamp = await proposalDeadline(governorAddress, chainId, proposalId);

    return proposal;
};

export const getAllProposals = async (url: string) => {
    let proposals: Promise<IProposalPageForm>[] = [];

    const q = query(proposalsCollection, where("governorUrl", "==", url));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        proposals.push(fetchContractData(doc));
    });

    return await Promise.all(proposals);
};
