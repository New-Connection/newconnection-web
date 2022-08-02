import { CreateGovernorContract } from "./ContractFactory";
import { Signer, Contract } from "ethers";

export interface IConstructorGovernor {
    name: string;
    tokenAddress: string;
    votingPeriod: number;
    quorumPercentage: number;
}

export async function deployGovernorContract(
    signer: Signer,
    constructor: IConstructorGovernor
): Promise<Contract> {
    const factory = CreateGovernorContract(signer);
    const contract = await factory.deploy(
        constructor.name,
        constructor.tokenAddress,
        constructor.votingPeriod,
        constructor.quorumPercentage
    );
    return contract;
}
