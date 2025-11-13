import { useState } from 'react'
import {
  checkZapsBalance,
  registerUserOnChain,
  buyRafflesTickets,
  buyCratesOnChain,
  openCratesOnChain,
  openCratesForRandomPrize,
  buyMerchOnChain,
} from '../services/zapshop'
import { useWallet } from '../contexts/WalletContext'
import './ZapShopInterface.css'

const ZapShopInterface = () => {
  const { account, isConnected, isStarkeyInstalled, isLoading: walletLoading, connectWallet, disconnectWallet, balance, error: walletError } = useWallet()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [ticketQuantity, setTicketQuantity] = useState('1')
  const [typeId, setTypeId] = useState('1')
  const [tier, setTier] = useState('1')
  const [monthSlot, setMonthSlot] = useState('1')
  const [cratesQuantity, setCratesQuantity] = useState('1')
  const [cratesId, setCratesId] = useState('1')
  const [merchTypeId, setMerchTypeId] = useState('1')
  const [merchQuantity, setMerchQuantity] = useState('1')

  const handleAction = async (action: () => Promise<any>, actionName: string) => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await action()
      setResult(`${actionName} successful! Result: ${JSON.stringify(response, null, 2)}`)
    } catch (err: any) {
      setError(`${actionName} failed: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (address: string | null) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="zapshop-interface">
      <div className="wallet-section">
        {!isConnected ? (
          <div className="wallet-connect">
            <h3>Connect Your Wallet</h3>
            {!isStarkeyInstalled ? (
              <div className="wallet-install-prompt">
                <p>Starkey wallet is not installed.</p>
                <a
                  href="https://chromewebstore.google.com/detail/starkey-wallet-qa-test/hcjhpkgbmechpabifbggldplacolbkoh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="install-link"
                >
                  Install Starkey Wallet
                </a>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={walletLoading}
                className="connect-button"
              >
                {walletLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
            {walletError && (
              <div className="wallet-error">
                <p>{walletError}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="wallet-info">
            <div className="wallet-details">
              <div className="wallet-address">
                <span className="label">Wallet:</span>
                <span className="address">{formatAddress(account)}</span>
              </div>
              {balance && (
                <div className="wallet-balance">
                  <span className="label">Balance:</span>
                  <span className="balance">{balance}</span>
                </div>
              )}
            </div>
            <button
              onClick={disconnectWallet}
              className="disconnect-button"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="actions-grid">
        {/* Check Balance */}
        <div className="action-card">
          <h3>Check Zaps Balance</h3>
          <button
            onClick={() => handleAction(() => checkZapsBalance(account!), 'Check Balance')}
            disabled={loading || !account}
            className="action-button"
          >
            Check Balance
          </button>
        </div>

        {/* Register User */}
        <div className="action-card">
          <h3>Register User</h3>
          <button
            onClick={() => handleAction(() => registerUserOnChain(account!), 'Register User')}
            disabled={loading || !account}
            className="action-button"
          >
            Register User
          </button>
        </div>

        {/* Buy Raffle Tickets */}
        <div className="action-card">
          <h3>Buy Raffle Tickets</h3>
          <div className="form-group">
            <label>Ticket Quantity:</label>
            <input
              type="number"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(e.target.value)}
              min="1"
              className="number-input"
            />
          </div>
          <div className="form-group">
            <label>Type ID:</label>
            <input
              type="number"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              min="0"
              className="number-input"
            />
          </div>
          <button
            onClick={() =>
              handleAction(
                () => buyRafflesTickets(account!, parseInt(ticketQuantity), parseInt(typeId)),
                'Buy Raffle Tickets',
              )
            }
            disabled={loading || !account}
            className="action-button"
          >
            Buy Tickets
          </button>
        </div>

        {/* Buy Crates */}
        <div className="action-card">
          <h3>Buy Crates</h3>
          <div className="form-group">
            <label>Tier:</label>
            <input
              type="number"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              min="0"
              max="255"
              className="number-input"
            />
          </div>
          <div className="form-group">
            <label>Month Slot:</label>
            <input
              type="number"
              value={monthSlot}
              onChange={(e) => setMonthSlot(e.target.value)}
              min="0"
              max="255"
              className="number-input"
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={cratesQuantity}
              onChange={(e) => setCratesQuantity(e.target.value)}
              min="1"
              max="255"
              className="number-input"
            />
          </div>
          <button
            onClick={() =>
              handleAction(
                () =>
                  buyCratesOnChain(
                    account!,
                    parseInt(tier),
                    parseInt(monthSlot),
                    parseInt(cratesQuantity),
                  ),
                'Buy Crates',
              )
            }
            disabled={loading || !account}
            className="action-button"
          >
            Buy Crates
          </button>
        </div>

        {/* Open Crate */}
        <div className="action-card">
          <h3>Open Crate</h3>
          <div className="form-group">
            <label>Crate ID:</label>
            <input
              type="number"
              value={cratesId}
              onChange={(e) => setCratesId(e.target.value)}
              min="0"
              className="number-input"
            />
          </div>
          <button
            onClick={() =>
              handleAction(() => openCratesOnChain(account!, parseInt(cratesId)), 'Open Crate')
            }
            disabled={loading || !account}
            className="action-button"
          >
            Open Crate
          </button>
        </div>

        {/* Open Crate for Random Prize */}
        <div className="action-card">
          <h3>Finalize Crate Opening</h3>
          <div className="form-group">
            <label>Crate ID:</label>
            <input
              type="number"
              value={cratesId}
              onChange={(e) => setCratesId(e.target.value)}
              min="0"
              className="number-input"
            />
          </div>
          <button
            onClick={() =>
              handleAction(
                () => openCratesForRandomPrize(account!, parseInt(cratesId)),
                'Finalize Crate Opening',
              )
            }
            disabled={loading || !account}
            className="action-button"
          >
            Finalize Opening
          </button>
        </div>

        {/* Buy Merch */}
        <div className="action-card">
          <h3>Buy Merchandise</h3>
          <div className="form-group">
            <label>Merch Type ID:</label>
            <input
              type="number"
              value={merchTypeId}
              onChange={(e) => setMerchTypeId(e.target.value)}
              min="0"
              className="number-input"
            />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              value={merchQuantity}
              onChange={(e) => setMerchQuantity(e.target.value)}
              min="1"
              className="number-input"
            />
          </div>
          <button
            onClick={() =>
              handleAction(
                () => buyMerchOnChain(account!, parseInt(merchTypeId), parseInt(merchQuantity)),
                'Buy Merchandise',
              )
            }
            disabled={loading || !account}
            className="action-button"
          >
            Buy Merch
          </button>
        </div>
      </div>

      {loading && (
        <div className="status-message loading">
          <p>Processing transaction...</p>
        </div>
      )}

      {error && (
        <div className="status-message error">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="status-message success">
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

export default ZapShopInterface

