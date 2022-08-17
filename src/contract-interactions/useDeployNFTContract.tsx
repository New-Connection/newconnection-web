import { CreateNFTContract } from "./ContractFactory";
import { Signer, Contract, ethers } from "ethers";

export interface IConstructorNFT {
    name: string;
    symbol: string;
    layerzeroEndpoint: string;
    price: string;
    startMintId: number;
    endMintId: number;
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
        ethers.utils.parseEther(constructor.price),
        constructor.layerzeroEndpoint,
        constructor.startMintId,
        constructor.endMintId
    );
    console.log("Wallet approved, endMintID:", constructor.endMintId);
    return contract;
}
