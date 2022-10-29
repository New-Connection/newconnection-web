import { ethers, Signer } from "ethers";
import toast from "react-hot-toast";
import { IDAOPageForm } from "types";
import { getTreasuryBalance } from "interactions/contract";

export const sendEthToAddress = async (receiverAddress: string, amountInEther: string, signer: Signer) => {
    let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
    };
    return await signer.sendTransaction(tx);
};

export const checkCorrectNetwork = async (signerData, chainID: number, switchNetwork: Function): Promise<boolean> => {
    if (!signerData) {
        toast.error("Please connect wallet");
        return false;
    }
    if ((await signerData.getChainId()) !== chainID) {
        if (switchNetwork) {
            toast.error("Please switch network");
            switchNetwork(chainID);
        } else {
            toast.error("Your wallet does not support switching networks");
        }
        return false;
    }
    return true;
};

export async function fetchTreasuryBalance(DAO: IDAOPageForm) {
    let currencyBalance = "0";
    let ethBalance = "0";
    if (DAO.treasuryAddress) {
        const balance = await getTreasuryBalance(DAO.treasuryAddress, DAO.chainId);

        currencyBalance = balance?.currencyBalance?.toString().slice(0, 7) || "0";
        ethBalance = balance?.ethBalance?.toString().slice(0, 7) || "0";
    }
    return { currencyBalance, ethBalance };
}
