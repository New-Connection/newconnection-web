import { Moralis } from "moralis-v1";
import { IWhitelistRecord } from "types";
import { fetchOptions, WhitelistMoralisClass } from "interactions/database";

export const fetchWhitelist = async (governorUrl: string, options?: fetchOptions) => {
    const whitelistQuery = new Moralis.Query(WhitelistMoralisClass);
    whitelistQuery.equalTo("governorUrl", governorUrl);

    if (options) {
        Object.keys(options).forEach(key => {
            whitelistQuery.equalTo(key, options[key]);
        });
    }

    const whitelistInstance = await whitelistQuery.find();
    if (!whitelistInstance) {
        return { whitelist: undefined, moralisInstance: undefined };
    }

    const whitelist: IWhitelistRecord[] = whitelistInstance.map((whitelistRecordInstanc) => {
        const proposal: IWhitelistRecord = {
            governorAddress: whitelistRecordInstanc.get("governorAddress"),
            governorUrl: whitelistRecordInstanc.get("governorUrl"),
            chainId: whitelistRecordInstanc.get("chainId"),
            walletAddress: whitelistRecordInstanc.get("walletAddress"),
            votingTokenName: whitelistRecordInstanc.get("votingTokenName"),
            votingTokenAddress: whitelistRecordInstanc.get("votingTokenAddress"),
            note: whitelistRecordInstanc.get("note"),
            blockchainSelected: whitelistRecordInstanc.get("blockchainSelected"),
        };
        return proposal;
    });
    return { whitelist, moralisInstance: whitelistInstance };
};
