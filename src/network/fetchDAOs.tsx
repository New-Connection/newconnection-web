import { IDAOPageForm } from "types/forms";
import { Moralis } from "moralis-v1";
import { handleContractError } from "utils/errors";

export async function fetchDAOs(isInitialized: any, DAOsQuery: Function) {
    if (isInitialized) {
        try {
            const results: Moralis.Object<Moralis.Attributes>[] = await DAOsQuery();
            return results.map((dao) => {
                const url = dao.get("url");
                const governorAddress = dao.get("governorAddress");
                const name = dao.get("name");
                const description = dao.get("description");
                const chainId = dao.get("chainId");
                let profileImage = dao.get("profileImage");
                const isActive = dao.get("isActive");
                const totalProposals = 0;
                const totalVotes = 0;

                return {
                    url,
                    name,
                    governorAddress: governorAddress,
                    description,
                    profileImage,
                    totalVotes,
                    totalProposals,
                    isActive,
                    chainId,

                    //mock
                    blockchain: [],
                    goals: "",
                    coverImage: null,
                    tokenAddress: [""],
                    votingPeriod: "",
                    type: [],
                    quorumPercentage: "",
                } as IDAOPageForm;
            });
        } catch (e) {
            handleContractError(e);
        }
    }
}
