import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { ICreateDAO, IDAOPageForm } from "types";
import { getChainScanner } from "interactions/contract";
import { getIpfsImage } from "utils";
import ASSETS from "assets";
import { daosCollection } from "interactions/database";

export const checkUrlAvailability = async (url) => {
    const docSnap = await getDoc(doc(daosCollection, url));
    return !docSnap.exists();
};

export const saveNewDao = async (dao: ICreateDAO) => {
    console.log(dao);
    try {
        await setDoc(doc(daosCollection, dao.url), dao);
        console.log("Document written with ID: ", dao.url);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const addValueToDaoArray = async (daoUrl: string, keyArray: string, value: string) => {
    console.log(daoUrl);
    try {
        const docSnap = await getDoc(doc(daosCollection, daoUrl));
        if (docSnap.exists()) {
            const old = docSnap.data() as ICreateDAO;
            const newDao = { ...old, [keyArray]: [...old[keyArray], value] } as ICreateDAO;
            console.log(newDao);
            await setDoc(doc(daosCollection, daoUrl), newDao);
            console.log("DAO updated");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const addValueToDao = async (daoUrl: string, key: string, value: any) => {
    console.log(daoUrl);
    try {
        const docSnap = await getDoc(doc(daosCollection, daoUrl));
        if (docSnap.exists()) {
            const old = docSnap.data() as ICreateDAO;
            const newDao = { ...old, [key]: value } as ICreateDAO;
            await setDoc(doc(daosCollection, daoUrl), newDao);
            console.log("DAO updated");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getDao = async (url: string) => {
    const docSnap = await getDoc(doc(daosCollection, url));
    if (docSnap.exists()) {
        const dao = docSnap.data() as IDAOPageForm;
        dao.scanURL = getChainScanner(dao.chainId, dao.governorAddress);
        dao.profileImage = getIpfsImage(dao.profileImage, ASSETS.daoLogoMock.src);
        dao.coverImage = getIpfsImage(dao.coverImage, ASSETS.daoLogoMock.src);

        return dao;
    }
};

export const getAllDaos = async () => {
    console.log("fetch daos");
    const daos: IDAOPageForm[] = [];
    const querySnapshot = await getDocs(daosCollection);
    querySnapshot.forEach((doc) => {
        const dao = doc.data() as IDAOPageForm;
        dao.profileImage = getIpfsImage(dao.profileImage, ASSETS.daoLogoMock.src);

        daos.push(dao);
    });
    return daos;
};