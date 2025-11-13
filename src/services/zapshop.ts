import { appEnv, SUPRA_RPC_URL, ZAPSHOP_CONTRACT } from './config'
import { BCS } from 'aptos'

export const checkZapsBalance = async (UserAddress: string) => {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_zap_balance`,
        type_arguments: [],
        arguments: [UserAddress],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const registerUserOnChain = async (walletAddress: string) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'register_user',
      [],
      [BCS.bcsSerializeUint64(6000000000000000)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in registerUserOnChain:', error)
    throw error
  }
}

export const buyRafflesTickets = async (walletAddress: string, ticketQuantity: number, typeId: number) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'buy_raffles',
      [],
      [BCS.bcsSerializeUint64(ticketQuantity), BCS.bcsSerializeU8(typeId)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in buyRafflesTickets:', error)
    throw error
  }
}

export const buyCratesOnChain = async (
  walletAddress: string,
  tier: number,
  monthSlot: number,
  cratesQuantity: number,
) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'buy_crates',
      [],
      [BCS.bcsSerializeU8(tier), BCS.bcsSerializeU8(monthSlot), BCS.bcsSerializeU8(cratesQuantity)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in buyCratesOnChain:', error)
    throw error
  }
}

export const openCratesOnChain = async (walletAddress: string, cratesId: number) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'open_crate',
      [],
      [BCS.bcsSerializeUint64(cratesId)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in openCratesOnChain:', error)
    throw error
  }
}

export const openCratesForRandomPrize = async (walletAddress: string, cratesId: number) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'open_crate_finalize',
      [],
      [BCS.bcsSerializeUint64(cratesId)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in openCratesForRandomPrize:', error)
    throw error
  }
}

export const buyMerchOnChain = async (walletAddress: string, merchTypeId: number, merchQuantity: number) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60 // 60 seconds
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'buy_merch',
      [],
      [BCS.bcsSerializeUint64(merchTypeId), BCS.bcsSerializeUint64(merchQuantity)],
      optionalTransactionPayloadArgs,
    ])

    const params = {
      data,
      from: walletAddress,
      to: moduleAddress,
      chainId: '',
      value: '',
      options: { waitForTransaction: true },
    }

    const txHash = await supraProvider.sendTransaction(params)

    return txHash
  } catch (error) {
    console.error('~ Error in buyMerchOnChain:', error)
    throw error
  }
}

