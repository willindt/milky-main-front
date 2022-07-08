export enum NetworkId {
  BscTestnet = 97,
  BscMainnet = 56,
  Rinkeby = 4,
  Mainnet = 1,
}

export const NETWORK_ID = NetworkId.BscMainnet

export type ContractAddress = {
  [key in NetworkId]: string
}

export type ContractInformation = {
  address: ContractAddress
  abi: any
}

export enum FarmType {
  YourFarm = 1,
  OtherFarm = 2
}

export const enum TypeDialog {
  STAKE='Stake',
  UNSTAKE='Unstake'
}