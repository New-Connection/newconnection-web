import { CreateNFTContract } from "./ContractFactory";
import { Signer, BigNumber } from "ethers";

export interface IConstructorNFT {
    name: string;
    symbol: string;
    numberNFT: number;
}

export async function deployNFTContract(
    signer: Signer,
    constructor: IConstructorNFT
): Promise<string> {
    const factory = CreateNFTContract(signer);
    const contract = await factory.deploy(
        constructor.name,
        constructor.symbol,
        constructor.numberNFT
    );
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    return contract.address;
}
