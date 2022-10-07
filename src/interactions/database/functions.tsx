import { Moralis } from "moralis-v1";
import toast from "react-hot-toast";
import { useMoralisQuery } from "react-moralis";
import {
    DaoMoralisObject,
    MoralisClassEnum,
    ProposalMoralisObject,
    UserMoralisObject,
    WhitelistMoralisObject,
} from "./moralisObjects";

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
