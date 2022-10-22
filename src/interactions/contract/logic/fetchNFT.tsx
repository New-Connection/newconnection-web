import {
    getNftName,
    getNumAvailableToMint,
    getNumberOfMintedTokens,
    getNumberOfTokenInOwnerAddress,
    getPrice,
    getSupplyNumber,
    getSymbol,
    getTokenURI,
} from "interactions/contract";
import { IDAOPageForm, IMember, INFTVoting } from "types";
import { getIpfsImage } from "utils";
import ASSETS from "assets";
import { whitelistRequestExists } from "interactions/database";

export async function getImage(tokenAddress: string, chainID: number) {
    const nftTokenUri: string = await getTokenURI(tokenAddress, chainID);
    return getIpfsImage(nftTokenUri, ASSETS.daoNFTMock.src);
}

const fetchBaseNftInfo = async (tokenAddress: string, chainId: number) => {
    const nft: INFTVoting = {
        tokenAddress: tokenAddress,
        chainId: chainId,
        title: await getNftName(tokenAddress, chainId),
        type: await getSymbol(tokenAddress, chainId),
        image: await getImage(tokenAddress, chainId),
        price: await getPrice(tokenAddress, chainId),
        totalSupply: await getSupplyNumber(tokenAddress, chainId),
        totalMinted: await getNumberOfMintedTokens(tokenAddress, chainId),
    };
    return nft;
};

export async function fetchNFT(DAO: IDAOPageForm, signerAddress?: string) {
    const nftsArray: INFTVoting[] = await Promise.all(
        DAO!.tokenAddress!.map(async (tokenAddress) => {
            const nft: INFTVoting = await fetchBaseNftInfo(tokenAddress, DAO.chainId);
            if (signerAddress) {
                nft.tokenRequestedByMember = await whitelistRequestExists(DAO.url, signerAddress, tokenAddress);
                nft.tokenMintedByMember = +(await getNumberOfTokenInOwnerAddress(
                    signerAddress,
                    tokenAddress,
                    DAO.chainId
                ));
                nft.tokenRequestApproved = +(await getNumAvailableToMint(signerAddress, tokenAddress, DAO.chainId)) > 0;
            }
            return nft;
        })
    );
    return nftsArray;
}

export async function fetchNFTsForMember(memberRecords: IMember[]): Promise<INFTVoting[]> {
    const nfts: Promise<INFTVoting>[] = [];

    memberRecords.forEach((record) => {
        const chainId = record.chainId;
        record.memberTokens.forEach(async (tokenAddress) => {
            const nft: Promise<INFTVoting> = fetchBaseNftInfo(tokenAddress, chainId);
            nfts.push(nft);
        });
    });

    return await Promise.all(nfts);
}
