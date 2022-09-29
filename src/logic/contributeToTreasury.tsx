import { sendEthToAddress } from "contract-interactions/utils";
import toast from "react-hot-toast";
import { checkCorrectNetwork } from "./utills";
import { IDAOPageForm } from "types/forms";

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
        console.log(error);
        contributeTreasuryDialog.hide();
        setSending(() => false);
        toast.error("Something went wrong");
        return;
    }

    toast.success("Successfully contributed!");
    contributeTreasuryDialog.hide();
    setSending(() => false);
};
