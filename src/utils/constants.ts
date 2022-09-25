// IPFS MODULE
export const infuraIpfsApiEndpoint = "https://ipfs.infura.io:5001";
export const infuraIPFS = "";

// NFT-STORAGE MODULE
export const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;

// EVM MODULE
export const infuraId = process.env.REACT_APP_INFURA_ID;
export const alchemyId = process.env.REACT_APP_ALCHEMY_ID;
export const BLOCKS_IN_DAY = 6545;
export const SECONDS_IN_BLOCK = 13.2;

//Moralis
export const moralisAppId = process.env.NEXT_PUBLIC_MORALIS_APP_ID_M;
export const moralisServerUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_ID_URL_M;

// export const moralisAppId = process..env.NEXT_PUBLIC_MORALIS_APP_ID_DEV_M;
// export const moralisServerUrl = process..env.NEXT_PUBLIC_MORALIS_SERVER_ID_URL_DEV_M;


interface ISecondsByDuration {
    [key: string]: number;
}

export const secondsByDuration: ISecondsByDuration = {
    week: 7 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    year: 365 * 24 * 60 * 60,
};
