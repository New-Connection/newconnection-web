import toast from "react-hot-toast";

export const checkCorrectNetwork = async (
    signerData,
    chainID: number,
    switchNetwork
): Promise<boolean> => {
    if (!signerData) {
        toast.error("Please connect wallet");
        return false;
    }
    if ((await signerData.getChainId()) !== chainID) {
        toast.error("Please switch network");
        switchNetwork(chainID);
        return false;
    }
    return true;
};
