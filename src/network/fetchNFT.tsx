import {
    getNftName,
    getPrice,
    getSymbol,
    getTokenURI
} from "contract-interactions/viewNftContract";
import { INFTVoting, IDAOPageForm } from "types/forms";
import { getIpfsImage } from "utils/ipfsUpload";
import ASSETS from "assets";

async function getImage(tokenAddress: string, chainID: number) {
    const nftTokenUri: string = await getTokenURI(tokenAddress, chainID);
    return getIpfsImage(nftTokenUri, ASSETS.daoNFTMock.src);
}

export async function fetchNFT(DAO: IDAOPageForm) {
    const nftsArray: INFTVoting[] = await Promise.all(
        DAO!.tokenAddress!.map(async (tokenAddress) => {
            const nft: INFTVoting = {
                title: await getNftName(tokenAddress, DAO.chainId),
                type: await getSymbol(tokenAddress, DAO.chainId),
                image: await getImage(tokenAddress, DAO.chainId),
                price: await getPrice(tokenAddress, DAO.chainId),
                tokenAddress: tokenAddress
            };
            return nft;
        })
    );
    return nftsArray;
}
