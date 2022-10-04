import { Contract, ContractFactory, Signer, utils } from "ethers";
import {
    GOVERNANCE_NFT_ABI,
    GOVERNANCE_NFT_BYTECODE,
    GOVERNOR_ABI,
    GOVERNOR_BYTECODE,
    TREASURY_ABI,
    TREASURY_BYTECODE,
} from "abis";

const CreateGovernorContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNOR_ABI, GOVERNOR_BYTECODE, signer);
};

const CreateNFTContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(GOVERNANCE_NFT_ABI, GOVERNANCE_NFT_BYTECODE, signer);
};

const CreateTreasuryContract = (signer: Signer): ContractFactory => {
    return new ContractFactory(TREASURY_ABI, TREASURY_BYTECODE, signer);
};

export interface IConstructorGovernor {
    name: string;
    tokenAddress: string;
    votingPeriod: number;
    quorumPercentage: number;
}

export async function deployGovernorContract(signer: Signer, constructor: IConstructorGovernor): Promise<Contract> {
    const factory = CreateGovernorContract(signer);
    return await factory.deploy(
        constructor.name,
        constructor.tokenAddress,
        constructor.votingPeriod,
        constructor.quorumPercentage
    );
}

export interface IConstructorNFT {
    name: string;
    symbol: string;
    layerzeroEndpoint: string;
    baseURI: string;
    price: string;
    startMintId: number;
    endMintId: number;
    isWalletApproved?: boolean;
}

export async function deployNFTContract(signer: Signer, constructor: IConstructorNFT): Promise<Contract> {
    const factory = CreateNFTContract(signer);
    const contract = await factory.deploy(
        constructor.name,
        constructor.symbol,
        constructor.baseURI,
        utils.parseEther(constructor.price),
        constructor.layerzeroEndpoint,
        constructor.startMintId,
        constructor.endMintId
    );
    console.log("Wallet approved, endMintID:", constructor.endMintId);
    return contract;
}

// For future constructor arguments
export interface IConstructorTreasury {}

export async function deployTreasuryContract(signer: Signer, constructor: IConstructorTreasury): Promise<Contract> {
    const factory = CreateTreasuryContract(signer);
    return await factory.deploy();
}
