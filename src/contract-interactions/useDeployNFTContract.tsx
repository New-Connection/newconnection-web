import { CreateNFTContract } from "./ContractFactory";
import { Signer, Contract } from "ethers";

export interface IConstructorNFT {
    name: string;
    symbol: string;
    numberNFT: number;
    isWalletApproved?: boolean;
}

export async function deployNFTContract(
    signer: Signer,
    constructor: IConstructorNFT
): Promise<Contract> {
    const factory = CreateNFTContract(signer);
    const contract = await factory.deploy(
        constructor.name,
        constructor.symbol,
        constructor.numberNFT
    );
    console.log("Wallet approved");
    return contract;
}
