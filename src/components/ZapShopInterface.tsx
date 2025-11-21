import { useState } from 'react'
import {
  checkZapsBalance,
  registerUserOnChain,
  checkUserInitiated,
  buyRafflesTickets,
  buyCratesOnChain,
  openCratesOnChain,
  buyMerchOnChain,
  getUserCratePurchases,
  getUserRafflesPurchases,
  claimCratePrize,
  getPrizeAllowed,
  checkCrateOpened,
  getCratesPrizesClaimed,
  getUserMerchQuantity,
  getConfigCopy,
  getUserCrateLimitDaily,
  getUserInventoryFull,
  getUserCrateDetails,
  checkDailyLimit
} from '../services/zapshop'
import { useWallet } from '../contexts/WalletContext'
import './ZapShopInterface.css'

const ZapShopInterface = () => {
  const { account, isConnected, isStarkeyInstalled, isLoading: walletLoading, connectWallet, disconnectWallet, balance, error: walletError } = useWallet()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cratePurchases, setCratePurchases] = useState<any[]>([])
  const [rafflePurchases, setRafflePurchases] = useState<any[]>([])
  const [claimedPrizes, setClaimedPrizes] = useState<any[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(false)
  const [loadingRafflePurchases, setLoadingRafflePurchases] = useState(false)
  const [loadingClaimedPrizes, setLoadingClaimedPrizes] = useState(false)
  const [fullInventory, setFullInventory] = useState<any>(null)
  const [loadingFullInventory, setLoadingFullInventory] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ type: 'crate' | 'merch' | 'raffle', id: any, data?: any } | null>(null)
  const [itemDetails, setItemDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [limitStatus, setLimitStatus] = useState<{ canBuy: boolean; remaining: number; limit: number; purchased: number; message: string } | null>(null)
  const [checkingLimit, setCheckingLimit] = useState(false)
  const [userInitStatus, setUserInitStatus] = useState<{ initiated: boolean; zapBalance: number } | null>(null)
  const [checkingInit, setCheckingInit] = useState(false)

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

  const handleFetchCratePurchases = async () => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setLoadingPurchases(true)
    setError(null)

    try {
      let purchases = await getUserCratePurchases(account, {})
      //Limit purchases to show only 10
      purchases = purchases.slice(0, 10)
      setCratePurchases(purchases)
      setResult(`Found ${purchases.length} crate purchase(s)`)
    } catch (err: any) {
      setError(`Failed to fetch crate purchases: ${err.message || 'Unknown error'}`)
      setCratePurchases([])
    } finally {
      setLoadingPurchases(false)
    }
  }

  const handleFetchRafflePurchases = async () => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setLoadingRafflePurchases(true)
    setError(null)

    try {
      const purchases = await getUserRafflesPurchases(account, {})
      setRafflePurchases(purchases)
      setResult(`Found ${purchases.length} raffle ticket(s)`)
    } catch (err: any) {
      setError(`Failed to fetch raffle purchases: ${err.message || 'Unknown error'}`)
      setRafflePurchases([])
    } finally {
      setLoadingRafflePurchases(false)
    }
  }

  const handleFetchClaimedPrizes = async () => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setLoadingClaimedPrizes(true)
    setError(null)

    try {
      const prizes = await getCratesPrizesClaimed(account)
      setClaimedPrizes(prizes)
      setResult(`Found ${prizes.length} claimed prize(s)`)
    } catch (err: any) {
      setError(`Failed to fetch claimed prizes: ${err.message || 'Unknown error'}`)
      setClaimedPrizes([])
    } finally {
      setLoadingClaimedPrizes(false)
    }
  }

  
  const handleFetchFullInventory = async () => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setLoadingFullInventory(true)
    setError(null)

    try {
      const inventory = await getUserInventoryFull(account)
      setFullInventory(inventory)
      setResult(`Full inventory loaded: ${inventory[0]?.length || 0} raffles, ${inventory[1]?.length || 0} crates, ${inventory[2]?.length || 0} merch items`)
    } catch (err: any) {
      setError(`Failed to fetch full inventory: ${err.message || 'Unknown error'}`)
      setFullInventory(null)
    } finally {
      setLoadingFullInventory(false)
    }
  }

  const handleItemClick = async (type: 'crate' | 'merch' | 'raffle', id: any, data?: any) => {
    if (!account) return

    setSelectedItem({ type, id, data })
    setLoadingDetails(true)
    setError(null)

    try {
      if (type === 'crate') {
        console.log('Fetching crate details for:', { account, crateId: id, crateIdType: typeof id })
        const details = await getUserCrateDetails(account, Number(id))
        console.log('Received crate details:', details)
        console.log('Details type:', typeof details)
        console.log('Details keys:', details ? Object.keys(details) : 'null/undefined')
        setItemDetails(details)
      } else if (type === 'merch') {
        const details = await getUserMerchQuantity(account, Number(id))
        setItemDetails(details)
      } else {
        // For raffles, we just show the ID and data from inventory
        setItemDetails({ raffle_id: id, ...data })
      }
    } catch (err: any) {
      console.error('Error fetching item details:', err)
      setError(`Failed to fetch item details: ${err.message || 'Unknown error'}`)
      setItemDetails(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeDetails = () => {
    setSelectedItem(null)
    setItemDetails(null)
  }

  const handleCheckLimit = async (itemType: 'crate' | 'raffle' | 'merch') => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setCheckingLimit(true)
    setError(null)
    setLimitStatus(null)

    try {
      let status
      if (itemType === 'crate') {
        status = await checkDailyLimit(
          account,
          'crate',
          parseInt(cratesQuantity),
          parseInt(tier)
        )
      } else if (itemType === 'raffle') {
        status = await checkDailyLimit(
          account,
          'raffle',
          parseInt(ticketQuantity)
        )
      } else if (itemType === 'merch') {
        status = await checkDailyLimit(
          account,
          'merch',
          parseInt(merchQuantity),
          undefined,
          parseInt(merchTypeId)
        )
      } else {
        return
      }

      setLimitStatus(status)
      if (!status.canBuy) {
        setError(status.message)
      } else {
        setResult(status.message)
      }
    } catch (err: any) {
      setError(`Failed to check limit: ${err.message || 'Unknown error'}`)
    } finally {
      setCheckingLimit(false)
    }
  }

  const handleBuyWithLimitCheck = async (
    action: () => Promise<any>,
    actionName: string,
    itemType: 'crate' | 'raffle' | 'merch'
  ) => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    // Check limit first
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let limitCheck
      if (itemType === 'crate') {
        limitCheck = await checkDailyLimit(
          account,
          'crate',
          parseInt(cratesQuantity),
          parseInt(tier)
        )
      } else if (itemType === 'raffle') {
        limitCheck = await checkDailyLimit(
          account,
          'raffle',
          parseInt(ticketQuantity)
        )
      } else if (itemType === 'merch') {
        limitCheck = await checkDailyLimit(
          account,
          'merch',
          parseInt(merchQuantity),
          undefined,
          parseInt(merchTypeId)
        )
      } else {
        limitCheck = { canBuy: true, remaining: -1, limit: -1, purchased: -1, message: '' }
      }

      setLimitStatus(limitCheck)

      if (!limitCheck.canBuy) {
        setError(limitCheck.message)
        setLoading(false)
        return
      }

      // If limit check passes, proceed with purchase
      const response = await action()
      setResult(`${actionName} successful! ${limitCheck.message} Result: ${JSON.stringify(response, null, 2)}`)
    } catch (err: any) {
      setError(`${actionName} failed: ${err.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
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

      {/* Section 1: Wallet & Account */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">Wallet & Account</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Check ZAP Balance</h3>
              <button
                onClick={() => handleAction(() => checkZapsBalance(account!), 'Check Balance')}
                disabled={loading || !account}
                className="action-button"
              >
                Check Balance
              </button>
            </div>

            <div className="action-card">
              <h3>Register User</h3>
              <button
                onClick={() => handleAction(async () => {
                  if (!account) throw new Error('Please connect your wallet first')
                  
                  // Check if user is initiated first
                  const initStatus = await checkUserInitiated(account)
                  if (!initStatus.initiated) {
                    throw new Error(`User account not initiated. Please contact admin to initiate your account first. The admin needs to call user_init_zap_snapshot for your address.`)
                  }
                  
                  // Proceed with registration
                  return await registerUserOnChain(account)
                }, 'Register User')}
                disabled={loading || !account}
                className="action-button"
              >
                Register User
              </button>
              <button
                onClick={async () => {
                  if (!account) {
                    setError('Please connect your wallet first')
                    return
                  }
                  
                  setCheckingInit(true)
                  setError(null)
                  setResult(null)
                  
                  try {
                    const status = await checkUserInitiated(account)
                    setUserInitStatus(status)
                    if (status.initiated) {
                      setResult(`User is initiated. ZAP balance to be minted on registration: ${status.zapBalance}`)
                    } else {
                      setError(`User is NOT initiated. Please contact admin to initiate your account first.`)
                    }
                  } catch (err: any) {
                    setError(`Failed to check initiation status: ${err.message || 'Unknown error'}`)
                  } finally {
                    setCheckingInit(false)
                  }
                }}
                disabled={checkingInit || !account}
                className="action-button"
                style={{ marginTop: '10px', background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' }}
              >
                {checkingInit ? 'Checking...' : 'Check Initiation Status'}
              </button>
              {userInitStatus && (
                <div className={`limit-status ${userInitStatus.initiated ? 'limit-ok' : 'limit-error'}`} style={{ marginTop: '10px' }}>
                  {userInitStatus.initiated 
                    ? `✓ Initiated - Will receive ${userInitStatus.zapBalance} ZAP on registration`
                    : '✗ Not initiated - Contact admin'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Buy Items */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">Buy Items</h2>
          <div className="actions-grid">
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
                onClick={() => handleCheckLimit('raffle')}
                disabled={checkingLimit || !account}
                className="action-button"
                style={{ marginBottom: '10px', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
              >
                {checkingLimit ? 'Checking...' : 'Check Daily Limit'}
              </button>
              {limitStatus && limitStatus.message.includes('raffle') && (
                <div className={`limit-status ${limitStatus.canBuy ? 'limit-ok' : 'limit-error'}`}>
                  {limitStatus.message}
                </div>
              )}
              <button
                onClick={() =>
                  handleBuyWithLimitCheck(
                    () => buyRafflesTickets(account!, parseInt(ticketQuantity), parseInt(typeId)),
                    'Buy Raffle Tickets',
                    'raffle'
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Buy Tickets
              </button>
            </div>

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
                onClick={() => handleCheckLimit('crate')}
                disabled={checkingLimit || !account}
                className="action-button"
                style={{ marginBottom: '10px', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
              >
                {checkingLimit ? 'Checking...' : 'Check Daily Limit'}
              </button>
              {limitStatus && limitStatus.message.includes('crate') && (
                <div className={`limit-status ${limitStatus.canBuy ? 'limit-ok' : 'limit-error'}`}>
                  {limitStatus.message}
                </div>
              )}
              <button
                onClick={() =>
                  handleBuyWithLimitCheck(
                    () =>
                      buyCratesOnChain(
                        account!,
                        parseInt(tier),
                        parseInt(monthSlot),
                        parseInt(cratesQuantity),
                      ),
                    'Buy Crates',
                    'crate'
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Buy Crates
              </button>
            </div>

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
                onClick={() => handleCheckLimit('merch')}
                disabled={checkingLimit || !account}
                className="action-button"
                style={{ marginBottom: '10px', background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
              >
                {checkingLimit ? 'Checking...' : 'Check Limit'}
              </button>
              {limitStatus && limitStatus.message.includes('merchandise') && (
                <div className={`limit-status ${limitStatus.canBuy ? 'limit-ok' : 'limit-error'}`}>
                  {limitStatus.message}
                </div>
              )}
              <button
                onClick={() =>
                  handleBuyWithLimitCheck(
                    () => buyMerchOnChain(account!, parseInt(merchTypeId), parseInt(merchQuantity)),
                    'Buy Merchandise',
                    'merch'
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Buy Merch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Crate Operations */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">Crate Operations</h2>
          <div className="actions-grid">
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

            <div className="action-card">
              <h3>Claim Crate Prize</h3>
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
                    () => claimCratePrize(account!, parseInt(cratesId)),
                    'Claim Crate Prize',
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Claim Prize
              </button>
            </div>

            <div className="action-card">
              <h3>Check Crate Opened</h3>
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
                    () => checkCrateOpened(account!, parseInt(cratesId)),
                    'Check Crate Opened',
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Check Status
              </button>
            </div>

            <div className="action-card">
              <h3>Get Prize Alloted</h3>
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
                    () => getPrizeAllowed(account!, parseInt(cratesId)),
                    'Get Prize Allowed',
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Get Prizes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Full Inventory */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">My Full Inventory</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Load Inventory</h3>
              <button
                onClick={handleFetchFullInventory}
                disabled={loadingFullInventory || !account}
                className="action-button"
              >
                {loadingFullInventory ? 'Loading...' : 'Get Full Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Configuration & Views */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">Configuration & Views</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Configuration</h3>
              <button
                onClick={() => handleAction(() => getConfigCopy(), 'Get Config')}
                disabled={loading}
                className="action-button"
              >
                Get Config
              </button>
            </div>

            <div className="action-card">
              <h3>My Daily Crate Limits</h3>
              <button
                onClick={() =>
                  handleAction(
                    () => getUserCrateLimitDaily(account!, Math.floor(Date.now() / 1000)),
                    'Get Daily Limits',
                  )
                }
                disabled={loading || !account}
                className="action-button"
              >
                Get Daily Limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Events & History */}
      {isConnected && (
        <div className="section">
          <h2 className="section-title">Events & History</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>My Crate Purchases</h3>
              <button
                onClick={handleFetchCratePurchases}
                disabled={loadingPurchases || !account}
                className="action-button"
              >
                {loadingPurchases ? 'Loading...' : 'Fetch Purchases'}
              </button>
            </div>

            <div className="action-card">
              <h3>My Raffle Tickets</h3>
              <button
                onClick={handleFetchRafflePurchases}
                disabled={loadingRafflePurchases || !account}
                className="action-button"
              >
                {loadingRafflePurchases ? 'Loading...' : 'Fetch Tickets'}
              </button>
            </div>

            <div className="action-card">
              <h3>My Claimed Prizes</h3>
              <button
                onClick={handleFetchClaimedPrizes}
                disabled={loadingClaimedPrizes || !account}
                className="action-button"
              >
                {loadingClaimedPrizes ? 'Loading...' : 'Fetch Claimed Prizes'}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {cratePurchases.length > 0 && (
        <div className="crate-purchases-section">
          <h3>Crate Purchases ({cratePurchases.length})</h3>
          <div className="purchases-list">
            {cratePurchases.map((purchase, index) => (
              <div key={index} className="purchase-item">
                <div className="purchase-header">
                  <span className="purchase-id">Crate ID: {purchase.crate_id}</span>
                  <span className="purchase-tier">Tier {purchase.tier}</span>
                </div>
                <div className="purchase-details">
                  <div className="detail-row">
                    <span className="detail-label">Month Slot:</span>
                    <span className="detail-value">{purchase.month_slot}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Paid ZAP:</span>
                    <span className="detail-value">{purchase.paid_zap}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(purchase.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transaction:</span>
                    <span className="detail-value transaction-hash">
                      {purchase.transaction_hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rafflePurchases.length > 0 && (
        <div className="crate-purchases-section">
          <h3>Raffle Tickets ({rafflePurchases.length})</h3>
          <div className="purchases-list">
            {rafflePurchases.map((purchase, index) => (
              <div key={index} className="purchase-item">
                <div className="purchase-header">
                  <span className="purchase-id">Raffle ID: {purchase.raffle_id}</span>
                  <span className="purchase-tier">Type {purchase.raffle_type_id}</span>
                </div>
                <div className="purchase-details">
                  <div className="detail-row">
                    <span className="detail-label">Type ID:</span>
                    <span className="detail-value">{purchase.raffle_type_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Paid ZAP:</span>
                    <span className="detail-value">{purchase.paid_zap}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(purchase.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transaction:</span>
                    <span className="detail-value transaction-hash">
                      {purchase.transaction_hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {claimedPrizes.length > 0 && (
        <div className="crate-purchases-section">
          <h3>Claimed Prizes ({claimedPrizes.length})</h3>
          <div className="purchases-list">
            {claimedPrizes.map((prize, index) => (
              <div key={index} className="purchase-item">
                <div className="purchase-header">
                  <span className="purchase-id">Crate ID: {prize.crate_id}</span>
                  <span className="purchase-tier">Claimed</span>
                </div>
                <div className="purchase-details">
                  <div className="detail-row">
                    <span className="detail-label">Prize SUPRA Claimed:</span>
                    <span className="detail-value">{prize.prize_supra_claimed}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(prize.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Transaction:</span>
                    <span className="detail-value transaction-hash">
                      {prize.transaction_hash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Inventory Display */}
      {fullInventory && (
        <div className="section">
          <h2 className="section-title">Inventory Items</h2>
          <div className="crate-purchases-section">
            {/* Raffles */}
            {fullInventory[0] && fullInventory[0].length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4>Raffle Tickets ({fullInventory[0].length})</h4>
                <div className="purchases-list">
                  {fullInventory[0].map((raffleId: string, index: number) => (
                    <div 
                      key={index} 
                      className="purchase-item clickable-item"
                      onClick={() => handleItemClick('raffle', raffleId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="purchase-id">Raffle ID: {String(raffleId)}</span>
                      <span style={{ marginLeft: '10px', color: '#666' }}>Click for details</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crates */}
            {fullInventory[1] && fullInventory[1].length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4>Crates ({fullInventory[1].length})</h4>
                <div className="purchases-list">
                  {fullInventory[1].map((crate: any, index: number) => (
                    <div 
                      key={index} 
                      className="purchase-item clickable-item"
                      onClick={() => handleItemClick('crate', crate.id, crate)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="purchase-header">
                        <span className="purchase-id">Crate ID: {String(crate.id)}</span>
                        <span className="purchase-tier">Tier {crate.tier}</span>
                      </div>
                      <div className="purchase-details">
                        <div className="detail-row">
                          <span className="detail-label">Month Slot:</span>
                          <span className="detail-value">{crate.month_slot}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Opened:</span>
                          <span className="detail-value">{crate.opened ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-row">
                          <span style={{ color: '#666', fontStyle: 'italic' }}>Click for full details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merchandise */}
            {fullInventory[2] && fullInventory[2].length > 0 && (
              <div>
                <h4>Merchandise ({fullInventory[2].length})</h4>
                <div className="purchases-list">
                  {fullInventory[2].map((merch: any, index: number) => (
                    <div 
                      key={index} 
                      className="purchase-item clickable-item"
                      onClick={() => handleItemClick('merch', merch.type_id, merch)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="purchase-header">
                        <span className="purchase-id">Type ID: {String(merch.type_id)}</span>
                        <span className="purchase-tier">Qty: {merch.quantity}</span>
                      </div>
                      <div className="purchase-details">
                        <div className="detail-row">
                          <span className="detail-label">Price:</span>
                          <span className="detail-value">{String(merch.price)} ZAP</span>
                        </div>
                        <div className="detail-row">
                          <span style={{ color: '#666', fontStyle: 'italic' }}>Click for full details</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!fullInventory[0] || fullInventory[0].length === 0) &&
             (!fullInventory[1] || fullInventory[1].length === 0) &&
             (!fullInventory[2] || fullInventory[2].length === 0) && (
              <p>No items in inventory</p>
            )}
          </div>
        </div>
      )}

      {/* Item Details Modal/View */}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedItem.type === 'crate' && 'Crate Details'}
                {selectedItem.type === 'merch' && 'Merchandise Details'}
                {selectedItem.type === 'raffle' && 'Raffle Details'}
              </h3>
              <button className="close-button" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              {loadingDetails ? (
                <p>Loading details...</p>
              ) : itemDetails ? (
                <div className="item-details">
                  {selectedItem.type === 'crate' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Crate ID:</span>
                        <span className="detail-value">{String(itemDetails.id)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Owner:</span>
                        <span className="detail-value">{String(itemDetails.owner)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tier:</span>
                        <span className="detail-value">{itemDetails.tier}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Month Slot:</span>
                        <span className="detail-value">{itemDetails.month_slot}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">{String(itemDetails.price)} ZAP</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Purchased:</span>
                        <span className="detail-value">
                          {new Date(Number(itemDetails.purchased_ts) * 1000).toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Unlock Time:</span>
                        <span className="detail-value">
                          {new Date(Number(itemDetails.unlock_ts) * 1000).toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Opened:</span>
                        <span className="detail-value">{itemDetails.opened ? 'Yes' : 'No'}</span>
                      </div>
                      {itemDetails.opened && itemDetails.opened_ts && (
                        <div className="detail-row">
                          <span className="detail-label">Opened At:</span>
                          <span className="detail-value">
                            {new Date(Number(itemDetails.opened_ts) * 1000).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {itemDetails.prize && (
                        <div className="detail-row">
                          <span className="detail-label">Prize:</span>
                          <span className="detail-value">{String(itemDetails.prize)} SUPRA</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Prize Claimed:</span>
                        <span className="detail-value">{itemDetails.is_prize_claimed ? 'Yes' : 'No'}</span>
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'merch' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Type ID:</span>
                        <span className="detail-value">{String(itemDetails.type_id)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{String(itemDetails.quantity)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">{String(itemDetails.price)} ZAP</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Purchase Time:</span>
                        <span className="detail-value">
                          {new Date(Number(itemDetails.purchase_time) * 1000).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'raffle' && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Raffle ID:</span>
                        <span className="detail-value">{String(itemDetails.raffle_id)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Note:</span>
                        <span className="detail-value">Raffle details are stored in events. Check Events & History section.</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p>No details available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZapShopInterface

