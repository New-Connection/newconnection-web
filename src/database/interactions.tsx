import toast from "react-hot-toast";
import { Moralis } from "moralis-v1";
import { useMoralisQuery } from "react-moralis";

export enum MoralisClassEnum {
    DAO = "DAO",
    PROPOSAL = "Proposal",
    USER = "User",
    WHITELIST = "Whitelist",
}

const DaoMoralisObject = Moralis.Object.extend(MoralisClassEnum.DAO);
const ProposalMoralisObject = Moralis.Object.extend(MoralisClassEnum.PROPOSAL);
const UserMoralisObject = Moralis.Object.extend(MoralisClassEnum.USER);
const WhitelistMoralisObject = Moralis.Object.extend(MoralisClassEnum.WHITELIST);
Moralis.Object.registerSubclass("DAO", DaoMoralisObject);
Moralis.Object.registerSubclass("Proposal", ProposalMoralisObject);
Moralis.Object.registerSubclass("User", UserMoralisObject);
Moralis.Object.registerSubclass("Whitelist", WhitelistMoralisObject);

export const getMoralisInstance = (moralisClass: MoralisClassEnum) => {
    switch (moralisClass) {
        case MoralisClassEnum.DAO:
            return new DaoMoralisObject();
        case MoralisClassEnum.PROPOSAL:
            return new ProposalMoralisObject();
        case MoralisClassEnum.USER:
            return new UserMoralisObject();
        case MoralisClassEnum.WHITELIST:
            return new WhitelistMoralisObject();
    }
};

export const saveMoralisInstance = async <T extends Moralis.Object>(moralisInstance: T) => {
    await moralisInstance.save().then(
        (instance) => {
            console.log("New object updated with id: " + instance.id);
        },
        (error) => {
            toast.error(`Failed to create, please try again. Error(${error.message})`);
            console.error(`Failed to create, please try again. Error(${error.message})`);
        }
    );
};

export const setFieldsIntoMoralisInstance = <T extends Moralis.Object>(
    moralisInstance: T,
    data: { [key: string]: any }
) => {
    for (const dataKey in data) {
        moralisInstance.set(dataKey, data[dataKey]);
    }
};

export const getAllMoralisObjects = (className: string) => {
    const result = useMoralisQuery(
        className,
        // (query) => query.equalTo("ownerName", "Aegon"),
        (query) => query.notEqualTo("objectId", ""),
        [],
        { autoFetch: false }
    );

    return result.fetch({ onSuccess: (results) => console.log(results) });
};
