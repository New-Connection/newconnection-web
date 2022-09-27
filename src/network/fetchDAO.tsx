import { MoralisContextValue } from "react-moralis";
import { IDAOPageForm } from "types/forms";
import { getChainScanner } from "utils/blockchains";

export function fetchDAO(isInitialized: any, daoQuery: any) {
    let newDao: IDAOPageForm = null;
    let moralisInstance: any = null;
    if (isInitialized) {
        daoQuery({
            onSuccess: (results) => {
                //setIsLoaded(false);
                moralisInstance = results[0];
                const chainId = moralisInstance.get("chainId");
                const governorAddress = moralisInstance.get("governorAddress");
                newDao = {
                    url: moralisInstance.get("url"),
                    name: moralisInstance.get("name"),
                    description: moralisInstance.get("description"),
                    goals: moralisInstance.get("goals"),
                    profileImage: moralisInstance.get("profileImage"),
                    coverImage: moralisInstance.get("coverImage"),
                    tokenAddress: moralisInstance.get("tokenAddress"),
                    votingPeriod: moralisInstance.get("votingPeriod"),
                    quorumPercentage: moralisInstance.get("quorumPercentage"),
                    type: moralisInstance.get("type"),
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
                console.log("fetchDAO", newDao);
                // setDAOMoralisInstance(() => moralisInstance);
                // setDAO(() => newDao);
            },
            onError: (error) => {
                console.log("Error fetching DAO db query" + error);
            },
        });
        return { newDao, moralisInstance };
    }
}
