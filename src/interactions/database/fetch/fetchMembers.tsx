import { IDAOPageForm, IMember } from "types";
import { Moralis } from "moralis-v1";
import { NftMoralisClass } from "interactions/database";
import { getGovernorOwnerAddress } from "interactions/contract";

export async function fetchMembers(DAO: IDAOPageForm) {
    const members = new Map<string, IMember>();
    const ownerAddress = await getGovernorOwnerAddress(DAO.governorAddress, DAO.chainId);

    members.set(ownerAddress, { address: ownerAddress, tokens: new Set<string>(), role: "Admin" });

    const nftQuery = new Moralis.Query(NftMoralisClass);
    nftQuery.equalTo("governorAddress", DAO.governorAddress) && nftQuery.equalTo("chainId", DAO.chainId);
    const nftInstance = await nftQuery.find();

    nftInstance.forEach((instance) => {
        const holders: string[] = instance.get("holders");
        const tokenAddress = instance.get("tokenAddress");

        holders.forEach((holderAddress) => {
            members.has(holderAddress)
                ? members.get(holderAddress).tokens.add(tokenAddress)
                : members.set(holderAddress, {
                    address: holderAddress,
                    tokens: new Set<string>().add(tokenAddress),
                    role: "Member",
                });
        });
    });

    return members;
}
