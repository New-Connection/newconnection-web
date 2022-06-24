import { Signer } from 'ethers';

import { createFactoryNFT } from 'src/utils/contract';



interface ICreateNFTToken {
    bytecode: any | null;
    signer?: Signer;
}

export const create = async({bytecode, signer}: ICreateNFTToken) => {
    try{
        if(!signer){
            throw new Error("Couldn't get signer");
        }
        if(!bytecode){
            throw new Error("Couldn't find contract bytecode")
        }
        return createFactoryNFT(bytecode, signer);
    } catch (error: any){
        throw new Error(error.message || (error?.reason ?? "Couldn't create contract"))
    }
    
}

export default function CreateNFTContract({bytecode, signer}: ICreateNFTToken){
    
    return create({bytecode, signer})
}