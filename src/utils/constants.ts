// IPFS MODULE
import { create } from "ipfs-http-client";

export const IPFS = "ipfs://";
export const INFURA_IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_DEDICATED_GATEWAY_SUBDOMAIN;
export const ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: "Basic " +
            Buffer.from(
                process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID + ":" + process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
            ).toString("base64"),
    },
});

// CryptoCompare
export const CRYPTOCOMPARE_API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;

// EVM MODULE
export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
export const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

//Moralis

export const MORALIS_APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID_M;
export const MORALIS_SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_ID_URL_M;
