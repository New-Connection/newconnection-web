import { Contract } from 'ethers';

export interface IToken {
  tokenAddress: string;
  ncContractAddress: string; // TODO
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  ncTokenContract: Contract; // TODO
}