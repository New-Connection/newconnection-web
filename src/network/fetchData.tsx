import {
    getTotalProposals,
    getNumberOfMintedTokens,
    getTreasuryBalance,
} from "contract-interactions";
import { IDAOPageForm } from "types/forms";
import { loadImage } from "utils/ipfsUpload";

export const fetchLargeData = async (DAO: IDAOPageForm) => {
    const newDAO = {
        ...DAO,
        totalProposals: await getTotalProposals(DAO!.governorAddress!, DAO!.chainId!),
        totalMembers: await getNumberOfMintedTokens(DAO!.tokenAddress[0]!, DAO!.chainId!),
        profileImage: await loadImage(DAO!.profileImage),
        coverImage: await loadImage(DAO!.coverImage),
    } as IDAOPageForm;
    console.log("DAO", DAO!.governorAddress!);
    return newDAO;
};

export async function fetchWhitelist(WhitelistQuery: any) {
    try {
        const results = await WhitelistQuery();
        return results;
    } catch (e) {
        console.log("Error to fetch Whitelist DAO", e);
    }
}

export async function fetchTreasuryBalance(DAO: IDAOPageForm) {
    const balance = DAO.treasuryAddress
        ? await getTreasuryBalance(DAO.treasuryAddress, DAO.chainId)
        : 0;
    return balance.toString().slice(0, 7);
}
