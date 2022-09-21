import { ethers, Signer } from "ethers";

export const sendEthToAddress = async (
    receiverAddress: string,
    amountInEther: string,
    signer: Signer
) => {
    let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
    };
    return await signer.sendTransaction(tx);
};
