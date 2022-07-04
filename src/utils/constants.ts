import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

import ETH from "assets/chains/Ethereum.png";
import BNB from "assets/chains/Binance.png";
import MATIC from "assets/chains/Polygon.png"

export const infuraId = '9b42ce0bea0a40c98832bdef4f0fb5cc';
export const alchemyId = 'EYaU8KZOLuaFhqXUxa5zzXhaXk6qC2SW';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    chainProviders: ethers.providers.BaseProvider;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
  };
}

interface ISecondsByDuration {
  [key: string]: number;
}

export const defaultProvider = providers.getDefaultProvider(4, {
  alchemy: alchemyId,
  infura: infuraId,
});

export const networkDetails: INetworkDetails = {
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    chainProviders: providers.getDefaultProvider(5, {    
      alchemy: alchemyId,
      infura: infuraId,
    }),
    blockExplorerURL: 'https://goerli.etherscan.io',
    blockExplorerName: 'Etherscan',
    prefix: 'goerli',
    logoURI: ETH.src,
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: ETH.src,
    tokenListId: 'ethereum',
  }
};

export const defaultChains: Chain[] = allChains.filter(
  (chain) =>
    chain.name === 'Goerli' ||
    chain.name === 'Mainnet'
);

const formattedChains = defaultChains.map((chain) => {
  if (chain.name === 'Mainnet') {
    return { ...chain, name: 'Ethereum' };
  }
  
  if (chain.name === "Goerli") {
    return { ...chain, name: "Goerli"}
  }

  return chain;
});

export const chains: Chain[] = [
  ...formattedChains,
]

export const secondsByDuration: ISecondsByDuration = {
  week: 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};
