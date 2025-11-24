import { ChainConfig, EnvironmentProps, IContractConfigProps } from './types'

export const apiUrl = '/blastoff/api/graphql'
export const appUrl = process.env.REACT_APP_APP_URL
export const BFF_API_URL = process.env.REACT_APP_BO_API_URL
export const publicApiUrl = process.env.REACT_APP_API_URL
export const basePath = process.env.REACT_APP_BASE_PATH
// Use REACT_APP_VERCEL_ENV if set, otherwise use NODE_ENV (development/production)
export const appEnv: any = process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV || 'development'
export const isProd = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'production'
export const isDev = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'development'
export const isQA = (process.env.REACT_APP_VERCEL_ENV || process.env.NODE_ENV) === 'staging'
export const assetsUrl = `${process.env.REACT_APP_ASSETS_URL}/spa-assets/dashboard`
export const cdnUrl = `${process.env.REACT_APP_ASSETS_URL}/blastoff-assets`
export const adminApiUrl = `${process.env.REACT_APP_ADMIN_API_URL}/assets`
export const showPasswordProtect = process.env.REACT_APP_SHOW_PASSWORD_PROTECT
export const passwordProtect = process.env.REACT_APP_PASSWORD_PROTECT
export const API_URL = process.env.REACT_APP_WORDPRESS_API_URL
export const totalSupraTokensStaked = process.env.REACT_APP_SUPRA_TOKENS_STAKED || '1000'
export const discordDreamDestinationUrl = process.env.REACT_APP_DISCORD_DREAM_DESTINATION_URL
export const discordMemeUrl = process.env.REACT_APP_DISCORD_MEME_URL
export const spaUrl = process.env.REACT_APP_APP_URL
export const apiKey = process.env.REACT_APP_PBO_API_KEY
export const showBobbleCrates = process.env.REACT_APP_SHOW_BOBBLECRATES
export const blockHeight = process.env.REACT_APP_BOBBLE_CONTRACT_BLOCK_HEIGHT_LIMIT || '150'

// Note: In Create React App, environment variables must start with REACT_APP_
export const KYC_API_SECRET = process.env.REACT_APP_KYC_API_SECRET ?? ''
export const KYC_API_KEY = process.env.REACT_APP_KYC_API_KEY ?? ''
export const KYC_API_URL = process.env.REACT_APP_KYC_API_URL ?? ''
export const KYC_API_BASE_URL = process.env.REACT_APP_KYC_API_BASE_URL ?? ''
export const KYC_API_STATUS_CHECK_URL = process.env.REACT_APP_KYC_API_STATUS_CHECK_URL ?? ''

export const SUPRA_CHAIN_ID: Record<EnvironmentProps, ChainConfig> | any = {
  development: {
    CHAIN_ID: '6',
  },
  staging: {
    CHAIN_ID: '6',
  },
  production: {
    CHAIN_ID: '8',
  },
}

export const SUPRA_RPC_URL = `${process.env.REACT_APP_SUPRA_RPC_URL || 'https://rpc.supra.com'}/rpc/v3`
export const supraScanUrl = isProd ? 'https://suprascan.io/tx' : 'https://testnet.suprascan.io/tx'

export const GAME_CONTRACT: Record<EnvironmentProps, IContractConfigProps> | any = {
  development: {
    CONTRACT_ADDRESS: '0x16aebb0e3ed12a4f3866f339a33e85041710519097bb112ce5fae39788f38935',
    DICE_CONTRACT_ADDRESS: '0xb2b373895425b7ed7cc199ca9ff5dc10cf8ec430feef018eaf529f1dc135fec3',
    ROCK_PAPER_CONTRACT_ADDRESS: '0x801fceedec3079190bf571c6913d3d6f98e91caaa64ce0a829768c72de79f5f5',
    CHAIN_ID: SUPRA_CHAIN_ID.development.CHAIN_ID,
  },
  staging: {
    CONTRACT_ADDRESS: '0xb027aeec05c7eb1aed73d1f2d4ab372cda15fcd1ace5a784e995da4136bc3533',
    DICE_CONTRACT_ADDRESS: '0xb2b373895425b7ed7cc199ca9ff5dc10cf8ec430feef018eaf529f1dc135fec3',
    ROCK_PAPER_CONTRACT_ADDRESS: '0x801fceedec3079190bf571c6913d3d6f98e91caaa64ce0a829768c72de79f5f5',
    CHAIN_ID: SUPRA_CHAIN_ID.staging.CHAIN_ID,
  },
  production: {
    CONTRACT_ADDRESS: '0xe4797885684d7eda1f05677aada85601eaff925165145db96be63eec426b1438',
    DICE_CONTRACT_ADDRESS: '0xb2b373895425b7ed7cc199ca9ff5dc10cf8ec430feef018eaf529f1dc135fec3',
    ROCK_PAPER_CONTRACT_ADDRESS: '0x801fceedec3079190bf571c6913d3d6f98e91caaa64ce0a829768c72de79f5f5',
    CHAIN_ID: SUPRA_CHAIN_ID.production.CHAIN_ID,
  },
}

export const ONBOARDING_PAYMENT_CONTRACT: Record<EnvironmentProps, IContractConfigProps> | any = {
  development: {
    PAYMENT_CONTRACT_ADDRESS: '0x9203362d20c1a9e034b1be4c979d76b6fc4cc91dda01a0f1537d169064bfcb96',
    CHAIN_ID: SUPRA_CHAIN_ID.development.CHAIN_ID,
  },
  staging: {
    PAYMENT_CONTRACT_ADDRESS: '0x9203362d20c1a9e034b1be4c979d76b6fc4cc91dda01a0f1537d169064bfcb96',
    CHAIN_ID: SUPRA_CHAIN_ID.staging.CHAIN_ID,
  },
  production: {
    PAYMENT_CONTRACT_ADDRESS: '0x9203362d20c1a9e034b1be4c979d76b6fc4cc91dda01a0f1537d169064bfcb96',
    CHAIN_ID: SUPRA_CHAIN_ID.production.CHAIN_ID,
  },
}

export const ONBOARDING_SUPRA_STAKE_CONTRACT: Record<EnvironmentProps, IContractConfigProps> | any = {
  development: {
    PAYMENT_CONTRACT_ADDRESS: '0x8ea97fb363dff1f1f6b33ae44c6cae2966b1a32c8aa60876eae29caaf8b1f951',
    CHAIN_ID: SUPRA_CHAIN_ID.development.CHAIN_ID,
  },
  staging: {
    PAYMENT_CONTRACT_ADDRESS: '0x8ea97fb363dff1f1f6b33ae44c6cae2966b1a32c8aa60876eae29caaf8b1f951',
    CHAIN_ID: SUPRA_CHAIN_ID.staging.CHAIN_ID,
  },
  production: {
    PAYMENT_CONTRACT_ADDRESS: '0x9d8ed683cfe28c658df277f9f326dcd987fb553905e4e3f079ff70eac5d18bba',
    CHAIN_ID: SUPRA_CHAIN_ID.production.CHAIN_ID,
  },
}

export const STARCADE_VENDI_MACHINE_CONTRACT: Record<EnvironmentProps, IContractConfigProps> | any = {
  development: {
    CONTRACT_ADDRESS: '0xe31de15f06a011fe41ee7fffca84fe78a8552690748baeca436d31bde91bf54d',
    CHAIN_ID: SUPRA_CHAIN_ID.development.CHAIN_ID,
  },
  staging: {
    CONTRACT_ADDRESS: '0xe31de15f06a011fe41ee7fffca84fe78a8552690748baeca436d31bde91bf54d',
    CHAIN_ID: SUPRA_CHAIN_ID.staging.CHAIN_ID,
  },
  production: {
    CONTRACT_ADDRESS: '0xd35506b821c5a06f43a018fc44742376da61851a6310fa85c86e569fc5ff72aa',
    CHAIN_ID: SUPRA_CHAIN_ID.production.CHAIN_ID,
  },
}

export const ZAPSHOP_CONTRACT: Record<EnvironmentProps, IContractConfigProps> | any = {
  development: {
    CONTRACT_ADDRESS: '0x08bc5d8336d5a3f5043ef720da9d84342eea31adeb95e8e13b701d9fd4cc7baf',
    CHAIN_ID: SUPRA_CHAIN_ID.development.CHAIN_ID,
  },
  staging: {
    CONTRACT_ADDRESS: '0x08bc5d8336d5a3f5043ef720da9d84342eea31adeb95e8e13b701d9fd4cc7baf',
    CHAIN_ID: SUPRA_CHAIN_ID.staging.CHAIN_ID,
  },
  production: {
    CONTRACT_ADDRESS: '0x08bc5d8336d5a3f5043ef720da9d84342eea31adeb95e8e13b701d9fd4cc7baf',
    CHAIN_ID: SUPRA_CHAIN_ID.production.CHAIN_ID,
  },
}

export const totalDiceGamePlayCount = 20

export const starKeyWalletLink =
  process.env.REACT_APP_STARKEY_WALLET_LINK ||
  'https://chromewebstore.google.com/detail/starkey-wallet-qa-test/hcjhpkgbmechpabifbggldplacolbkoh'

export const starKeyIOSLink =
  process.env.REACT_APP_STARKEY_WALLET_LINK || 'https://apps.apple.com/us/app/starkey-wallet/id6636478764'

export const starKeyAndroidLink =
  process.env.REACT_APP_STARKEY_WALLET_LINK || 'https://play.google.com/store/apps/details?id=com.StarKey&hl=en'
