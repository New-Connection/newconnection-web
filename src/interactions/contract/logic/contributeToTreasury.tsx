import { checkCorrectNetwork, sendEthToAddress } from "interactions/contract";
import toast from "react-hot-toast";
import { IDAOPageForm } from "types";
import { handleContractError } from "utils";
import React from "react";

export const contributeToTreasury = async (
    e: React.FormEvent<HTMLFormElement>,
    signerData,
    DAO: IDAOPageForm,
    switchNetwork,
    setSending,
    contributeTreasuryDialog,
    contributeAmount
) => {
    e.preventDefault();

    if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
        return;
    }

    try {
        const sendTx = await sendEthToAddress(DAO.treasuryAddress, contributeAmount, signerData);
        await sendTx.wait(1);
        setSending(() => false);
    } catch (error) {
        handleContractError(e, contributeTreasuryDialog);
        setSending(() => false);
        return;
    }

    toast.success("Successfully contributed!");
    contributeTreasuryDialog.hide();
    setSending(() => false);
};
