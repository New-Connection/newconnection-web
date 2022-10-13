import {
    getNftName,
    getNumberOfMintedTokens,
    getPrice,
    getSupplyNumber,
    getSymbol,
    getTokenURI,
} from "interactions/contract";
import { IDAOPageForm, INFTVoting } from "types";
import { getIpfsImage } from "utils";
import ASSETS from "assets";
import { checkTokenRequestAvailable } from "interactions/database";

async function getImage(tokenAddress: string, chainID: number) {
    const nftTokenUri: string = await getTokenURI(tokenAddress, chainID);
    return getIpfsImage(nftTokenUri, ASSETS.daoNFTMock.src);
}

export async function fetchNFT(DAO: IDAOPageForm, signerAddress?: string) {
    const nftsArray: INFTVoting[] = await Promise.all(
        DAO!.tokenAddress!.map(async (tokenAddress) => {
            const nft: INFTVoting = {
                title: await getNftName(tokenAddress, DAO.chainId),
                type: await getSymbol(tokenAddress, DAO.chainId),
                image: await getImage(tokenAddress, DAO.chainId),
                price: await getPrice(tokenAddress, DAO.chainId),
                totalSupply: await getSupplyNumber(tokenAddress, DAO.chainId),
                totalMinted: await getNumberOfMintedTokens(tokenAddress, DAO.chainId),
                tokenAddress: tokenAddress,
            };
            signerAddress &&
                (nft.tokenRequested = !(await checkTokenRequestAvailable(signerAddress, DAO.url, tokenAddress)));
            return nft;
        })
    );
    return nftsArray;
}
