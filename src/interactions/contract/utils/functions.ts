import { ethers, Signer } from "ethers";
import toast from "react-hot-toast";

export const sendEthToAddress = async (receiverAddress: string, amountInEther: string, signer: Signer) => {
    let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
    };
    return await signer.sendTransaction(tx);
};

export const checkCorrectNetwork = async (signerData, chainID: number, switchNetwork): Promise<boolean> => {
    if (!signerData) {
        toast.error("Please connect wallet");
        return false;
    }
    if ((await signerData.getChainId()) !== chainID) {
        toast.error("Please switch database");
        switchNetwork(chainID);
        return false;
    }
    return true;
};
