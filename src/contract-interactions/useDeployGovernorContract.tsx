import { CreateGovernorContract } from "./useCreateGovernorContract";
import { Signer, BigNumber } from "ethers";

export interface IConstructorGovernor {
    name: string;
    tokenAddress: string;
    votingPeriod: number;
    quorumPercentage: number;
}

export async function deployGovernorContract(
    signer: Signer,
    constructor: IConstructorGovernor
): Promise<string> {
    const factory = CreateGovernorContract(signer);
    const contract = await factory.deploy(
        constructor.name,
        constructor.tokenAddress,
        constructor.votingPeriod,
        constructor.quorumPercentage
    );
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    return contract.address;
}
