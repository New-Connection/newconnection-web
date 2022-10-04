import { Moralis } from "moralis-v1";
import { IWhitelistPageForm } from "types/forms";

export const fetchWhitelist = async (whitelistQuery: Function) => {
    const moralisInstance: Moralis.Object<Moralis.Attributes>[] = await whitelistQuery();
    const whitelist: IWhitelistPageForm[] = moralisInstance.map((whitelistMoralis) => {
        const proposal: IWhitelistPageForm = {
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
