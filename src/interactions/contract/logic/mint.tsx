import { mintNFT, mintReserveAndDelegation } from "interactions/contract/basic/writeNFTContract";
import toast from "react-hot-toast";
import { IDAOPageForm } from "types/pages";
import { handleContractError } from "utils/handlers/errorHandlers";
import { checkCorrectNetwork } from "../utils/functions";

export const mint = async (
    tokenAddress: string,
    DAO: IDAOPageForm,
    signerData,
    switchNetwork,
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
        await tx.wait();
        if (tx.blockNumber) {
            toast.success(`DONE ✅ successful mint!`);
        }
        setButtonState("Success");
    } catch (e) {
        setButtonState("Error");
        handleContractError(e);
    }
};
