import toast from "react-hot-toast";
import Moralis from "moralis";

export const DaoMoralisObject = Moralis.Object.extend("DAO");
export const NftMoralisObject = Moralis.Object.extend("NFT");
export const UserMoralisObject = Moralis.Object.extend("User");

Moralis.Object.registerSubclass("DAO", DaoMoralisObject);
Moralis.Object.registerSubclass("NFT", NftMoralisObject);
Moralis.Object.registerSubclass("User", UserMoralisObject);

export const saveObject = async <T extends Moralis.Object>(
    moralisInstance: T,
    data: { [key: string]: any }
) => {
    if (!(moralisInstance instanceof Moralis.Object)) {
        console.error(`object not instance of Moralis.Object`);
        return;
    }

    for (const dataKey in data) {
        moralisInstance.set(dataKey, data[dataKey]);
    }
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
