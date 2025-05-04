import React, { useContext, useState, createContext} from 'react'

const StoreContext = createContext(null)

export const StoreProvider = ({children}) => {
    const [isStoreUpdated, setIsStoreUpdated] = useState(false)
    const [store, setStore] = useState({})

    return (
        <StoreContext.Provider value={{store, setStore, isStoreUpdated, setIsStoreUpdated}}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)