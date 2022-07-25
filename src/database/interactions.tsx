import toast from "react-hot-toast";
import Moralis from "moralis";
import { useMoralisQuery } from "react-moralis";

export enum MoralisClassEnum {
    DAO = "DAO",
    PROPOSAL = "Proposal",
    USER = "User",
}

const DaoMoralisObject = Moralis.Object.extend(MoralisClassEnum.DAO);
const ProposalMoralisObject = Moralis.Object.extend(MoralisClassEnum.PROPOSAL);
const UserMoralisObject = Moralis.Object.extend(MoralisClassEnum.USER);
Moralis.Object.registerSubclass("DAO", DaoMoralisObject);
Moralis.Object.registerSubclass("Proposal", ProposalMoralisObject);
Moralis.Object.registerSubclass("User", UserMoralisObject);

export const getMoralisInstance = (moralisClass: MoralisClassEnum) => {
    switch (moralisClass) {
        case MoralisClassEnum.DAO:
            return new DaoMoralisObject();
        case MoralisClassEnum.PROPOSAL:
            return new ProposalMoralisObject();
        case MoralisClassEnum.USER:
            return new UserMoralisObject();
    }
};

export const saveMoralisInstance = async <T extends Moralis.Object>(moralisInstance: T) => {
    await moralisInstance.save().then(
        (dao) => {
            console.log("New object created with id: " + dao.id);
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
