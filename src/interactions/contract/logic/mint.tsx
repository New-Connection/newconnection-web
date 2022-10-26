import { checkCorrectNetwork, mintNFT, mintReserveAndDelegation } from "interactions/contract";
import toast from "react-hot-toast";
import { IDAOPageForm, INFTVoting } from "types";
import { handleContractError } from "utils";

export const mint = async (
    nft: INFTVoting,
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
            ? await mintReserveAndDelegation(nft.tokenAddress, signerData)
            : await mintNFT(nft.tokenAddress, signerData, nft.price);
        if (tx.blockNumber) {
            toast.success(`DONE ✅ successful mint!`);
        }
        setButtonState("Success");
    } catch (e) {
        setButtonState("Error");
        handleContractError(e);
    }
};
