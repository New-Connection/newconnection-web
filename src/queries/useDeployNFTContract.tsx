import toast from "react-hot-toast";
import { GovernorNFTBytecode } from "abis/GovernanceNFT";
import { CreateNFTContract } from "./useCreateNFTContract";
import { ethers, Signer, BigNumber } from "ethers";

interface ICounstructorNFT {
    name: string;
    symbol: string;
    numberNFT: number;
}

export async function deployNFTContract(
    signer: Signer,
    construstor: ICounstructorNFT
): Promise<string> {
    const factory = CreateNFTContract(GovernorNFTBytecode, signer);
    const contract = await factory.deploy(
        construstor.name,
        construstor.symbol,
        BigNumber.from(construstor.numberNFT)
    );
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    return contract.address;
}
