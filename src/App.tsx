import './App.css'
import ZapShopInterface from './components/ZapShopInterface'
import { WalletProvider } from './contexts/WalletContext'

function App() {
  return (
    <WalletProvider>
      <div className="app">
        <header className="app-header">
          <h1>Zap Shop React Example</h1>
          <p>Interact with the ZapShop smart contract</p>
        </header>
        <main className="app-main">
          <ZapShopInterface />
        </main>
      </div>
    </WalletProvider>
  )
}

export default App

