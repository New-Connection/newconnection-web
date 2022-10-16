import { checkCorrectNetwork, mintNFT, mintReserveAndDelegation } from "interactions/contract";
import toast from "react-hot-toast";
import { IDAOPageForm } from "types";
import { handleContractError } from "utils";

export const mint = async (
    tokenAddress: string,
    DAO: IDAOPageForm,
    signerData,
    switchNetwork: Function,
    setButtonState,
    isOwner: boolean
) => {
    if (!DAO) return;

    if (!(await checkCorrectNetwork(signerData, DAO.chainId, switchNetwork))) {
        return;
    }

    setButtonState("Loading");
    try {
        const tx = isOwner
            ? await mintReserveAndDelegation(tokenAddress, signerData)
            : await mintNFT(tokenAddress, signerData);
        if (tx.blockNumber) {
            toast.success(`DONE ✅ successful mint!`);
        }
        setButtonState("Success");
    } catch (e) {
        setButtonState("Error");
        handleContractError(e);
    }
};
