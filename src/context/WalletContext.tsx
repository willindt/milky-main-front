import React, { createContext, useState, useContext } from 'react';
import { ethers } from 'ethers'

interface WalletState {
    provider? : any,
    web3Provider?: any,
    address?: string,
    chainId?: number
}

const defaultState: WalletState = {
    provider: null,
    web3Provider: null,
    address: '',
    chainId: -1
}

type ContextType<TValue> = [TValue, (newValue: TValue) => void]

const defaultContextValue: ContextType<WalletState> = [defaultState, () => {}]

export const AppContext = createContext(defaultContextValue)

export const AppContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<WalletState>(defaultState);

    const ctxValue: ContextType<WalletState> = [
        contextState,
        (value: WalletState) => {
            setContextState(value);
        },
    ];

    return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>
};

export const useAppContext = () => useContext(AppContext)
