import { handleContractError } from "utils";
import { AddToWhitelist, checkCorrectNetwork } from "interactions/contract";
import toast from "react-hot-toast";
import { deleteWhitelistRecord } from "interactions/database";
import { IWhitelistRecord } from "types";
import { Signer } from "@wagmi/core";

export const handleWhitelistRecord = async (
    record: IWhitelistRecord,
    isRejected: boolean = false,
    signerData: Signer,
    switchNetwork: (chainId_?: number) => void,
    loadingWhitelist: () => Promise<void>
) => {
    let status;
    if (!isRejected) {
        if (!(await checkCorrectNetwork(signerData, record.chainId, switchNetwork))) {
            return;
        }

        console.log("voting token " + record.votingTokenAddress);
        status = await AddToWhitelist({
            addressNFT: record.votingTokenAddress,
            walletAddress: record.walletAddress,
            signer: signerData,
        });
    }
    try {
        if (status || isRejected) {
            await deleteWhitelistRecord(record.governorUrl, record.walletAddress, record.votingTokenAddress);
            loadingWhitelist().then();
            isRejected ? toast.success("Whitelist request refected") : toast.success("Wallet added to Whitelist");
        }
    } catch (e) {
        handleContractError(e);
    }
};
