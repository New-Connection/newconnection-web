import { deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { whitelistCollection } from "interactions/database";
import { IWhitelistRecord } from "types";

export const saveWhitelistRequest = async (request: IWhitelistRecord) => {
    try {
        const key = `${request.governorUrl}:${request.walletAddress}:${request.votingTokenAddress}`;
        await setDoc(doc(whitelistCollection, key), request);
        console.log("token requested");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const whitelistRequestExists = async (governorUrl: string, walletAddress: string, votingTokenAddress: string) => {
    const key = `${governorUrl}:${walletAddress}:${votingTokenAddress}`;
    const docSnap = await getDoc(doc(whitelistCollection, key));
    return docSnap.exists();
};

export const getWhitelist = async (url: string) => {
    const members: IWhitelistRecord[] = [];

    const q = query(whitelistCollection, where("governorUrl", "==", url));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const member = doc.data() as IWhitelistRecord;
        members.push(member);
    });

    return members;
};

export const deleteWhitelistRecord = async (governorUrl: string, walletAddress: string, votingTokenAddress: string) => {
    const key = `${governorUrl}:${walletAddress}:${votingTokenAddress}`;
    await deleteDoc(doc(whitelistCollection, key));
};