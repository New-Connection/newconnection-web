import { fetchWhitelist } from "interactions/database";

export const checkTokenRequestAvailable = async (
    walletAddress: string,
    governorUrl: string,
    votingTokenAddress: string
): Promise<boolean> => {
    const data = await fetchWhitelist(governorUrl, {
        votingTokenAddress: votingTokenAddress,
        walletAddress: walletAddress,
    });
    return !data || data.whitelist.length === 0;
};
