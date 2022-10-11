import { IDAOPageForm } from "types";
import { getChainScanner } from "interactions/contract";
import { Moralis } from "moralis-v1";
import { getIpfsImage } from "utils";
import ASSETS from "assets";
import { DaoMoralisClass } from "interactions/database";

export async function fetchDAO(url: string) {
    const daosQuery = new Moralis.Query(DaoMoralisClass);
    daosQuery.equalTo("url", url);

    const daoInstance = await daosQuery.first();

    if (!daoInstance) {
        return { newDao: undefined, moralisInstance: undefined };
    }

    const chainId = daoInstance.get("chainId");
    const governorAddress = daoInstance.get("governorAddress");
    const newDao: IDAOPageForm = {
        url: daoInstance.get("url"),
        name: daoInstance.get("name"),
        description: daoInstance.get("description"),
        goals: daoInstance.get("goals"),
        profileImage: getIpfsImage(daoInstance.get("profileImage"), ASSETS.daoLogoMock.src),
        coverImage: getIpfsImage(daoInstance.get("coverImage"), ASSETS.daoLogoMock.src),
        tokenAddress: daoInstance.get("tokenAddress"),
        votingPeriod: daoInstance.get("votingPeriod"),
        quorumPercentage: daoInstance.get("quorumPercentage"),
        blockchain: daoInstance.get("blockchain"),
        governorAddress: governorAddress,
        chainId: chainId,
        discordURL: daoInstance.get("discordURL"),
        twitterURL: daoInstance.get("twitterURL"),
        websiteURL: daoInstance.get("websiteURL"),
        treasuryAddress: daoInstance.get("treasuryAddress"),
        scanURL: getChainScanner(chainId, governorAddress),
        //TODO: parse below values
        totalVotes: 0,
        totalMembers: 0,
        totalProposals: 0,
        activeProposals: 0,
    };
    return { newDao, moralisInstance: daoInstance };
}
