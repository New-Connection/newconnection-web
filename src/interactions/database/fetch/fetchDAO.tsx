import { IDAOPageForm } from "types/pages";
import { getChainScanner } from "interactions/contract/utils/blockchains";
import { Moralis } from "moralis-v1";
import { getIpfsImage } from "utils/api/ipfsUpload";
import ASSETS from "assets";

export async function fetchDAO(isInitialized: any, daoQuery: Function) {
    if (isInitialized) {
        const results: Moralis.Object<Moralis.Attributes>[] = await daoQuery();
        //setIsLoaded(false);
        const moralisInstance = results[0];
        const chainId = moralisInstance.get("chainId");
        const governorAddress = moralisInstance.get("governorAddress");
        const newDao: IDAOPageForm = {
            url: moralisInstance.get("url"),
            name: moralisInstance.get("name"),
            description: moralisInstance.get("description"),
            goals: moralisInstance.get("goals"),
            profileImage: getIpfsImage(moralisInstance.get("profileImage"), ASSETS.daoLogoMock.src),
            coverImage: getIpfsImage(moralisInstance.get("coverImage"), ASSETS.daoLogoMock.src),
            tokenAddress: moralisInstance.get("tokenAddress"),
            votingPeriod: moralisInstance.get("votingPeriod"),
            quorumPercentage: moralisInstance.get("quorumPercentage"),
            blockchain: moralisInstance.get("blockchain"),
            governorAddress: governorAddress,
            chainId: chainId,
            discordURL: moralisInstance.get("discordURL"),
            twitterURL: moralisInstance.get("twitterURL"),
            websiteURL: moralisInstance.get("websiteURL"),
            treasuryAddress: moralisInstance.get("treasuryAddress"),
            scanURL: getChainScanner(chainId, governorAddress),
            //TODO: parse below values
            totalVotes: 0,
            totalMembers: 0,
            totalProposals: 0,
            activeProposals: 0,
        };
        return { newDao, moralisInstance };
    }
}
