import { Moralis } from "moralis-v1";
import { IWhitelistRecord } from "types/forms";

export const fetchWhitelist = async (whitelistQuery: Function) => {
    const moralisInstance: Moralis.Object<Moralis.Attributes>[] = await whitelistQuery();
    const whitelist: IWhitelistRecord[] = moralisInstance.map((whitelistMoralis) => {
        const proposal: IWhitelistRecord = {
            governorAddress: whitelistMoralis.get("governorAddress"),
            governorUrl: whitelistMoralis.get("governorUrl"),
            chainId: whitelistMoralis.get("chainId"),
            walletAddress: whitelistMoralis.get("walletAddress"),
            votingTokenName: whitelistMoralis.get("votingTokenName"),
            votingTokenAddress: whitelistMoralis.get("votingTokenAddress"),
            note: whitelistMoralis.get("note"),
            blockchainSelected: whitelistMoralis.get("blockchainSelected"),
        };
        return proposal;
    });
    return { whitelist, moralisInstance };
};
