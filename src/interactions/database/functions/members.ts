import { IMember } from "types";
import { doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { membersCollection } from "interactions/database";

export const saveMember = async (member: IMember) => {
    try {
        const key = `${member.governorUrl}:${member.memberAddress}`;
        const docSnap = await getDoc(doc(membersCollection, key));

        if (docSnap.exists()) {
            const old = docSnap.data() as IMember;
            const newMember: IMember = {
                ...member,
                role: old.role,
            };

            await setDoc(doc(membersCollection, key), newMember);
            console.log("member updated");
        } else {
            await setDoc(doc(membersCollection, key), member);
            console.log("member created");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getAllMembers = async (url: string) => {
    const members: IMember[] = [];

    const q = query(membersCollection, where("governorUrl", "==", url));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const member = doc.data() as IMember;
        members.push(member);
    });

    return members;
};
