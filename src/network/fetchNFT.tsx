import {
    getNftName,
    getNumberOfMintedTokens,
    getPrice,
    getSymbol,
    getTokenURI,
} from "contract-interactions/viewNftContract";
import { INFTVoting, IDAOPageForm } from "types/forms";
import { loadImage } from "utils/ipfsUpload";

async function getImage(tokenAddress: string, chainID: number) {
    return await loadImage(await getTokenURI(tokenAddress, chainID));
}

export async function fetchNFT(DAO: IDAOPageForm) {
    const nftsArray: INFTVoting[] = await Promise.all(
        DAO!.tokenAddress!.map(async (tokenAddress) => {
            const nft: INFTVoting = {
                title: await getNftName(tokenAddress, DAO.chainId),
                type: await getSymbol(tokenAddress, DAO.chainId),
                image: await getImage(tokenAddress, DAO.chainId),
                price: await getPrice(tokenAddress, DAO.chainId),
                tokenAddress: tokenAddress,
            };
            return nft;
        })
    );
    return nftsArray;
}
