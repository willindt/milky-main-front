import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import { useCallback, useEffect, useReducer } from 'react'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'
import { ellipseAddress, getChainData } from '../lib/utilities'

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
      },
      chainId: 56,
      network: "binance",
      // infuraId: process.env.REACT_APP_INFURA_KEY, ???
    },
  },
  binancechainwallet: {
    package: true,
  },
}

export let web3Modal: any
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'binance', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}

export type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
}

export type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      provider?: StateType['provider']
      web3Provider?: StateType['web3Provider']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: '',
  chainId: -1,
}

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}