import { sendEthToAddress } from "contract-interactions/utils";
import toast from "react-hot-toast";
import { checkCorrectNetwork } from "./utils";
import { IDAOPageForm } from "types/forms";
import { handleContractError } from "utils/errors";

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
