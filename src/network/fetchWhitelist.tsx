import { Moralis } from "moralis-v1";
import { IWhitelistPageForm } from "types/forms";

export const fetchWhitelist = async (whitelistQuery: any) => {
    try {
        const results: Moralis.Object<Moralis.Attributes>[] = await whitelistQuery();
        const whitelist: IWhitelistPageForm[] = await Promise.all(
            results.map(async (whitelistMoralis) => {
                const proposal: IWhitelistPageForm = {
                    walletAddress: whitelistMoralis.get("walletAddress"),
                    votingTokenName: whitelistMoralis.get("votingTokenName"),
                    votingTokenAddress: whitelistMoralis.get("votingTokenAddress"),
                    note: whitelistMoralis.get("note"),
                    blockchainSelected: whitelistMoralis.get("blockchainSelected"),
                };
                return proposal;
            })
        );
        return whitelist;

    } catch (e) {
        console.log("[ERROR] Fetch Proposal", e);
    }

};