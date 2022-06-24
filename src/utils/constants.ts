import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

// TESTNETS
// export const FACTORY_RINKEBY = '0xde1C04855c2828431ba637675B6929A684f84C7F';
// export const FACTORY_KOVAN = '0xd43bb75cc924e8475dff2604b962f39089e4f842';

// export const VESTING_FACTORY_RINKEBY = '0xB93427b83573C8F27a08A909045c3e809610411a';
// export const VESTING_FACTORY_KOVAN = '0xB93427b83573C8F27a08A909045c3e809610411a';

// LIVE
export const FACTORY_MAINNET = '0xde1C04855c2828431ba637675B6929A684f84C7F';

export const VESTING_FACTORY_MAINNET = '0xB93427b83573C8F27a08A909045c3e809610411a';


export const MAINNET_ENS_RESOLVER = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';

//export const DISPERSE_DEFAULT = '0xD152f549545093347A162Dce210e7293f1452150';
export const infuraId = '9b42ce0bea0a40c98832bdef4f0fb5cc';
export const alchemyId = 'EYaU8KZOLuaFhqXUxa5zzXhaXk6qC2SW';
// export const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

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
  // etherscan: etherscanKey,
  infura: infuraId,
});

export const networkDetails: INetworkDetails = {
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    chainProviders: providers.getDefaultProvider(4, {
      alchemy: alchemyId,
      // etherscan: etherscanKey,
      infura: infuraId,
    }),
    blockExplorerURL: 'https://goerli.etherscan.io',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
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

  return chain;
});

export const secondsByDuration: ISecondsByDuration = {
  week: 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};
