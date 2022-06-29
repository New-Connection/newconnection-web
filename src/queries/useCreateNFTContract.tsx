import { Signer, ContractFactory } from "ethers";
import toast from "react-hot-toast";
import { createFactoryNFT } from "utils/contract";

export const CreateNFTContract = (bytecode: string, signer: Signer): ContractFactory => {
    try {
        if (!signer) {
            toast.error("Please connect wallet");
            throw new Error("Couldn't get signer");
        }
        if (!bytecode) {
            toast.error("Couldn't find contract bytecode");
            throw new Error("Couldn't find contract bytecode");
        }
        //console.log("Hello", createFactoryNFT(bytecode, signer));
        return createFactoryNFT(bytecode, signer);
    } catch (error: any) {
        toast.error("Couldn't create contract");
        throw new Error(error.message || (error?.reason ?? "Couldn't create contract"));
    }
};
