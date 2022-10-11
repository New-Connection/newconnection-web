import { IDAOPageForm } from "types";
import { Moralis } from "moralis-v1";
import { getIpfsImage } from "utils";
import ASSETS from "assets";
import { DaoMoralisClass } from "interactions/database";

export async function fetchDAOs() {
    const daosQuery = new Moralis.Query(DaoMoralisClass);
    daosQuery.includeAll();

    const daosInstance = await daosQuery.find();
    if (!daosInstance) {
        return;
    }

    return daosInstance.map((dao) => {
        const url = dao.get("url");
        const governorAddress = dao.get("governorAddress");
        const name = dao.get("name");
        const description = dao.get("description");
        const chainId = dao.get("chainId");
        let profileImage = getIpfsImage(dao.get("profileImage"), ASSETS.daoLogoMock.src);
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
}
