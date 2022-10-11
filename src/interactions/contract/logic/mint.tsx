import { checkCorrectNetwork, mintNFT, mintReserveAndDelegation } from "interactions/contract";
import toast from "react-hot-toast";
import { IDAOPageForm } from "types";
import { handleContractError } from "utils";
import { Moralis } from "moralis-v1";
import { NftMoralisClass, saveMoralisInstance } from "interactions/database";

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
        if (tx.blockNumber) {
            toast.success(`DONE ✅ successful mint!`);
        }
        setButtonState("Success");

        await updateDatabase(tokenAddress, DAO.chainId, await signerData.getAddress());
    } catch (e) {
        setButtonState("Error");
        handleContractError(e);
    }
};

const updateDatabase = async (tokenAddress: string, chainId: number, minterAddress: string) => {
    const nftQuery = new Moralis.Query(NftMoralisClass);
    nftQuery.equalTo("tokenAddress", tokenAddress) && nftQuery.equalTo("chainId", chainId);

    const nftInstance = (await nftQuery.find())[0];
    console.log(nftInstance);

    if (nftInstance) {
        nftInstance.addUnique("holders", minterAddress);
        await saveMoralisInstance(nftInstance);
    }
};
