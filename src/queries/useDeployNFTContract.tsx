import { GOVERNANCE_NFT_BYTECODE } from "contracts";
import { CreateNFTContract } from "./useCreateNFTContract";
import { Signer, BigNumber } from "ethers";

interface ICounstructorNFT {
    name: string;
    symbol: string;
    numberNFT: number;
}

export async function deployNFTContract(
    signer: Signer,
    construstor: ICounstructorNFT
): Promise<string> {
    const factory = CreateNFTContract(GOVERNANCE_NFT_BYTECODE, signer);
    const contract = await factory.deploy(
        construstor.name,
        construstor.symbol,
        BigNumber.from(construstor.numberNFT)
    );
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    return contract.address;
}
