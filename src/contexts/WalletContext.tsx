import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { SUPRA_CHAIN_ID, appEnv } from '../services/config'

interface WalletContextType {
  isConnected: boolean
  isStarkeyInstalled: boolean
  account: string | null
  balance: string | null
  chainId: string | null
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  updateBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStarkeyInstalled, setIsStarkeyInstalled] = useState(false)

  const getProvider = () => {
    if (typeof window === 'undefined') return null
    
    // Check multiple possible paths for the wallet
    const provider = (window as any).starkey?.supra || (window as any).starKeyWallet?.supra
    return provider || null
  }

  // Check for wallet installation periodically
  useEffect(() => {
    const checkWallet = () => {
      const provider = getProvider()
      const installed = !!provider
      setIsStarkeyInstalled(installed)
      
      // Debug logging to help diagnose wallet detection issues
      if (typeof window !== 'undefined' && !installed) {
        const win = window as any
        console.log('[Wallet Debug] Checking for wallet...')
        console.log('[Wallet Debug] window.starkey:', win.starkey)
        console.log('[Wallet Debug] window.starKeyWallet:', win.starKeyWallet)
        console.log('[Wallet Debug] Available window properties:', Object.keys(win).filter(key => 
          key.toLowerCase().includes('star') || key.toLowerCase().includes('wallet') || key.toLowerCase().includes('supra')
        ))
      } else if (installed) {
        console.log('[Wallet Debug] Wallet detected successfully!')
      }
    }

    // Check immediately
    checkWallet()

    // Check periodically in case wallet loads after page load
    const interval = setInterval(checkWallet, 1000)
    
    // Also listen for wallet injection events
    if (typeof window !== 'undefined') {
      window.addEventListener('starkey#initialized', checkWallet)
    }

    return () => {
      clearInterval(interval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('starkey#initialized', checkWallet)
      }
    }
  }, [])

  const updateBalance = useCallback(async () => {
    const provider = getProvider()
    if (!provider || !account) return

    try {
      const balanceData = await provider.balance(account)
      if (balanceData) {
        setBalance(balanceData.formattedBalance || balanceData.balance)
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }, [account])

  const connectWallet = useCallback(async () => {
    const provider = getProvider()
    if (!provider) {
      setError('Starkey wallet is not installed. Please install it first.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const targetChainId = SUPRA_CHAIN_ID[appEnv]?.CHAIN_ID || '6'
      const accounts = await provider.connect({ chainId: targetChainId, multiple: false })

      if (!accounts || accounts.length === 0) {
        setError('No accounts found')
        setIsLoading(false)
        return
      }

      const walletAddress = accounts[0]
      setAccount(walletAddress)
      setIsConnected(true)

      // Get chain ID
      try {
        const currentChainId = await provider.getChainId()
        setChainId(currentChainId)
      } catch (err) {
        console.error('Failed to get chain ID:', err)
      }

      // Get balance
      try {
        const balanceData = await provider.balance(walletAddress)
        if (balanceData) {
          setBalance(balanceData.formattedBalance || balanceData.balance)
        }
      } catch (err) {
        console.error('Failed to fetch balance:', err)
      }

      // Set up event listeners
      provider.on?.('accountChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          updateBalance()
        }
      })

      provider.on?.('networkChanged', (newChainId: string) => {
        setChainId(newChainId)
        updateBalance()
      })

      provider.on?.('disconnect', () => {
        disconnectWallet()
      })
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
      console.error('Failed to connect wallet:', err)
    } finally {
      setIsLoading(false)
    }
  }, [updateBalance])

  const disconnectWallet = useCallback(async () => {
    const provider = getProvider()
    if (provider) {
      try {
        await provider.disconnect()
      } catch (err) {
        console.error('Failed to disconnect:', err)
      }
    }

    setIsConnected(false)
    setAccount(null)
    setBalance(null)
    setChainId(null)
    setError(null)
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const provider = getProvider()
      if (!provider) return

      try {
        const accounts = await provider.account()
        if (accounts && accounts.length > 0) {
          const walletAddress = accounts[0]
          setAccount(walletAddress)
          setIsConnected(true)

          const currentChainId = await provider.getChainId()
          setChainId(currentChainId)

          const balanceData = await provider.balance(walletAddress)
          if (balanceData) {
            setBalance(balanceData.formattedBalance || balanceData.balance)
          }

          // Set up event listeners
          provider.on?.('accountChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              disconnectWallet()
            } else {
              setAccount(accounts[0])
              updateBalance()
            }
          })

          provider.on?.('networkChanged', (newChainId: string) => {
            setChainId(newChainId)
            updateBalance()
          })

          provider.on?.('disconnect', () => {
            disconnectWallet()
          })
        }
      } catch {
        // Wallet not connected, that's fine
      }
    }

    // Small delay to ensure wallet is ready
    const timer = setTimeout(checkConnection, 500)
    return () => clearTimeout(timer)
  }, [disconnectWallet, updateBalance])

  const value: WalletContextType = {
    isConnected,
    isStarkeyInstalled,
    account,
    balance,
    chainId,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateBalance,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

