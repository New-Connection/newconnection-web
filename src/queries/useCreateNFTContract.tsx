import { Signer, ContractFactory } from "ethers";

import { createFactoryNFT } from "utils/contract";

export const CreateNFTContract = (bytecode, signer): ContractFactory => {
    try {
        console.log(signer);
        if (!signer) {
            throw new Error("Couldn't get signer");
        }
        if (!bytecode) {
            throw new Error("Couldn't find contract bytecode");
        }
        console.log("Hello", createFactoryNFT(bytecode, signer));
        return createFactoryNFT(bytecode, signer);
    } catch (error: any) {
        throw new Error(error.message || (error?.reason ?? "Couldn't create contract"));
    }
};
