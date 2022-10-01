import { IDAOPageForm } from "types/forms";
import { Moralis } from "moralis-v1";

export async function fetchDAOs(isInitialized: any, DAOsQuery: any) {
    if (isInitialized) {
        try {
            const results: Moralis.Object<Moralis.Attributes>[] = await DAOsQuery();
            const daos = results.map((dao) => {
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
            return daos;
        } catch (e) {
            console.log("[ERROR] to fetch DAOs", e);
        }
    }
}
