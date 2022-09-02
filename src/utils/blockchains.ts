import Ethereum from "assets/chains/Ethereum.png";
import Polygon from "assets/chains/Polygon.png";
import Arbitrum from "assets/chains/Arbitrum.png";
import Binance from "assets/chains/Binance.png";
import Avalanche from "assets/chains/Avalanche.png";
import Fantom from "assets/chains/Fantom.png";
import Optimism from "assets/chains/Optimism.png";

export const CHAINS = [
    "Ethereum",
    "Polygon",
    "Arbitrum",
    "Binance",
    "Avalanche",
    "Fantom",
    "Optimism",
];

export const CHAINS_IMG = {
    Ethereum: Ethereum,
    Polygon: Polygon,
    Arbitrum: Arbitrum,
    Binance: Binance,
    Avalanche: Avalanche,
    Fantom: Fantom,
    Optimism: Optimism,
};

//TODO: change to main networks
export const TEST_CHAINS_IDS = {
    Ethereum: 4, // rinkeby
    Polygon: 80001, // mumbai
    Arbitrum: 421611, // arbitrum rinkeby
    Binance: 97, // bsctest
    Avalanche: 43113, // fuji
    Fantom: 4002, // fantom testnet
    Optimism: 69, // optimism kovan
};

export const CHAINS_IDS={
    Ethereum: 1,
    Polygon: 137,
    Arbitrum: 42161,
    Binance: 56,
    Avalanche: 43114,
    Fantom: 250,
    Optimism: 10,
}
