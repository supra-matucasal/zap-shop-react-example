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

export async function checkUserInitiated(walletAddress: string): Promise<{ initiated: boolean; zapBalance: number }> {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::check_user_initiated`,
        type_arguments: [],
        arguments: [walletAddress],
      }),
    })

    const data = await response.json()
    
    console.log('checkUserInitiated data:', data)
    // The function returns (bool, u64) which is a tuple
    // Move tuples are returned as arrays in RPC responses
    let result = data?.result
    
    // Handle if it's wrapped in an array (e.g., [[true, "50000000"]])
    // Check if result is an array of arrays (wrapped)
    if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
      result = result[0]
    }
    
    // The tuple should be an array [bool, u64]
    // result should now be [true, "50000000"] or similar
    if (Array.isArray(result) && result.length >= 2) {
      const initiated = result[0] === true || result[0] === 'true' || result[0] === 1 || result[0] === '1'
      const zapBalance = Number(result[1] || 0)
      
      console.log('Parsed initiation status:', { initiated, zapBalance })
      
      return {
        initiated,
        zapBalance
      }
    }
    
    console.warn('Unexpected result format:', result)
    // Fallback if format is different
    return {
      initiated: false,
      zapBalance: 0
    }
  } catch (e) {
    console.log('Error checking user initiated:', e)
    return {
      initiated: false,
      zapBalance: 0
    }
  }
}

export const registerUserOnChain = async (walletAddress: string) => {
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    // Check if user is initiated first
    const initStatus = await checkUserInitiated(walletAddress)
    if (!initStatus.initiated) {
      throw new Error(`User not initiated. Please contact admin to initiate your account first. Your account needs to be added via user_init_zap_snapshot before you can register.`)
    }

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS

    // Automatic gas configuration
    const DEFAULT_GAS_PRICE = 10_000
    let gasUnitPrice = DEFAULT_GAS_PRICE
    try {
      // Type-safe check for getGasPrice method
      if ('getGasPrice' in supraProvider && typeof (supraProvider as any).getGasPrice === 'function') {
        const gp = Number(await (supraProvider as any).getGasPrice())
        if (!Number.isNaN(gp) && gp > 0) gasUnitPrice = gp
      }
    } catch { /* ignore */ }
    gasUnitPrice = Math.floor(gasUnitPrice * 1.2) 

    const base = 200_000 // Higher base for resource creation
    const maxGas = Math.max(200_000, Math.min(base, 2_000_000))

    const txExpiryTime = Math.ceil(Date.now() / 1000) + 120 // 120 seconds for complex operation

    const optionalTransactionPayloadArgs = {
      txExpiryTime,
      gasUnitPrice,
      maxGas,
    }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'register_user',
      [],
      [],
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

export const buyRafflesTickets = async (
  walletAddress: string,
  ticketQuantity: number,
  typeId: number
) => {
  const supraProvider = (window as any)?.starkey?.supra;
  if (!supraProvider) throw new Error('Supra wallet not connected.');

  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS;

  const DEFAULT_GAS_PRICE = 10_000;
  let gasUnitPrice = DEFAULT_GAS_PRICE;
  try {
    // Type-safe check for getGasPrice method
    if ('getGasPrice' in supraProvider && typeof (supraProvider as any).getGasPrice === 'function') {
      const gp = Number(await (supraProvider as any).getGasPrice());
      if (!Number.isNaN(gp) && gp > 0) gasUnitPrice = gp;
    }
  } catch { /* ignore */ }
  gasUnitPrice = Math.floor(gasUnitPrice * 1.2);

  const base = 80_000;
  const perTicket = 1_200;
  let maxGas = base + perTicket * ticketQuantity;
  maxGas = Math.max(120_000, Math.min(maxGas, 2_000_000));

  const txExpiryTime = Math.ceil(Date.now() / 1000) + 120;

  const optionalTransactionPayloadArgs = {
    txExpiryTime,
    gasUnitPrice,
    maxGas,
  };

  const data = await supraProvider.createRawTransactionData([
    walletAddress,
    0,
    moduleAddress,
    'zap_shop_v1',
    'buy_raffles',
    [],
    [BCS.bcsSerializeUint64(ticketQuantity), BCS.bcsSerializeU8(typeId)],
    optionalTransactionPayloadArgs,
  ]);

  return supraProvider.sendTransaction({
    data,
    from: walletAddress,
    to: moduleAddress,
    chainId: '',
    value: '',
    options: { waitForTransaction: true },
  });
};

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


async function fetchEventsByTypeAndUser<T>(
  fullyQualifiedEventType: string,
  walletAddress: string,
  { limit = 100, pageSize = 100, signal }: { limit?: number; pageSize?: number; signal?: AbortSignal }
): Promise<T[]> {
  const base = SUPRA_RPC_URL;
  let cursor: string | null = null;
  const out: T[] = [];

  while (out.length < limit) {
    console.log(`${base}/events/${encodeURIComponent(fullyQualifiedEventType)}`)
    const url = new URL(`${base}/events/${encodeURIComponent(fullyQualifiedEventType)}`);
    url.searchParams.set('limit', String(Math.min(pageSize, limit - out.length)));
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Events fetch failed (${res.status}): ${body}`);
    }

    // Supra cursor comes in a response header:
    const nextCursor = res.headers.get('x-supra-cursor');
    const json = (await res.json()) as { data?: any[] };

    const batch = (json.data ?? [])
      .filter((row) => row?.event?.data?.user?.toLowerCase() === walletAddress.toLowerCase());

    out.push(...(batch as T[]));

    if (!nextCursor || (json.data?.length ?? 0) === 0) break;
    cursor = nextCursor;
  }

  return out;
}


export async function getUserCratePurchases(
  walletAddress: string,
  { limit = 200, pageSize = 100, signal }: { limit?: number; pageSize?: number; signal?: AbortSignal }
): Promise<{ user: string; crate_id: string; tier: number; month_slot: number; paid_zap: string; timestamp: number; transaction_hash: string; block_height: number }[]> {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS;
  const eventType = `${moduleAddress}::zap_shop_v1::CratePurchased`;

  const raw = await fetchEventsByTypeAndUser<any>(eventType, walletAddress, {
    limit,
    pageSize,
    signal,
  });

  return raw.map((r) => ({
    user: r.event.data.user,
    crate_id: String(r.event.data.crate_id),
    tier: Number(r.event.data.tier),
    month_slot: Number(r.event.data.month_slot),
    paid_zap: String(r.event.data.paid_zap),
    timestamp: Number(r.event.data.timestamp),
    transaction_hash: r.transaction_hash,
    block_height: Number(r.block_height),
  }));
}

export async function getUserRafflesPurchases(
  walletAddress: string,
  { limit = 200, pageSize = 100, signal }: { limit?: number; pageSize?: number; signal?: AbortSignal }
): Promise<{ user: string; raffle_id: string; raffle_type_id: number; paid_zap: string; timestamp: number; transaction_hash: string; block_height: number }[]> {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS;
  const eventType = `${moduleAddress}::zap_shop_v1::RafflesPurchased`;

  const raw = await fetchEventsByTypeAndUser<any>(eventType, walletAddress, {
    limit,
    pageSize,
    signal,
  });

  // Flatten the results - one entry per raffle_id (since raffle_ids is an array)
  const result: { user: string; raffle_id: string; raffle_type_id: number; paid_zap: string; timestamp: number; transaction_hash: string; block_height: number }[] = [];

  raw.forEach((r) => {
    const raffleIds = r.event.data.raffle_ids || [];
    const user = r.event.data.user;
    const raffleTypeId = Number(r.event.data.raffle_type_id);
    const paidZap = String(r.event.data.paid_zap);
    const timestamp = Number(r.event.data.timestamp);
    const transactionHash = r.transaction_hash;
    const blockHeight = Number(r.block_height);

    // Create one entry for each raffle_id in the array
    raffleIds.forEach((raffleId: any) => {
      result.push({
        user,
        raffle_id: String(raffleId),
        raffle_type_id: raffleTypeId,
        paid_zap: paidZap,
        timestamp,
        transaction_hash: transactionHash,
        block_height: blockHeight,
      });
    });
  });

  return result;
}

export async function getCratesPrizesClaimed(walletAddress: string) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS;
  const eventType = `${moduleAddress}::zap_shop_v1::CratePrizeClaimed`;
  const raw = await fetchEventsByTypeAndUser<any>(eventType, walletAddress, {
    limit: 100,
    pageSize: 100,
    signal: undefined,
  });
  return raw.map((r) => ({
    user: r.event.data.user,
    crate_id: String(r.event.data.crate_id),
    prize_supra_claimed: String(r.event.data.prize_supra_claimed),
    timestamp: Number(r.event.data.timestamp),
    transaction_hash: r.transaction_hash,
    block_height: Number(r.block_height),
  }));
}

export async function getMerchPurchases(walletAddress: string) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS;
  const eventType = `${moduleAddress}::zap_shop_v1::MerchPurchased`;
  const raw = await fetchEventsByTypeAndUser<any>(eventType, walletAddress, {
    limit: 100,
    pageSize: 100,
    signal: undefined,
  });

  return raw.map((r) => ({
    user: r.event.data.user,
    merch_id: String(r.event.data.merch_id),
    merch_type_id: Number(r.event.data.merch_type_id),
    quantity: Number(r.event.data.quantity),
    timestamp: Number(r.event.data.timestamp),
    transaction_hash: r.transaction_hash,
    block_height: Number(r.block_height),
  }));

}

export async function getUserCrateDetails(walletAddress: string, crateId: number) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_user_crate_details`,
        type_arguments: [],
        arguments: [walletAddress, String(crateId)],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HTTP Error:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('Full RPC response:', JSON.stringify(data, null, 2))
    
    // Check for errors in the response
    if (data?.error) {
      console.error('RPC Error:', data.error)
      throw new Error(data.error.message || 'Failed to fetch crate details')
    }
    
    if (!data?.result) {
      console.error('No result in response:', data)
      throw new Error('No result returned from RPC')
    }
    
    // The result might be the struct directly, or wrapped in an array
    // Move structs are typically returned as objects with field names
    const result = data.result
    
    // If it's an array (unlikely but possible), take the first element
    if (Array.isArray(result) && result.length > 0) {
      console.log('Result is array, using first element')
      return result[0]
    }
    
    console.log('Crate details response:', result)
    console.log('Result type:', typeof result)
    console.log('Result keys:', result ? Object.keys(result) : 'null/undefined')
    
    return result
  } catch (e) {
    console.error('Error in getUserCrateDetails:', e)
    throw e
  }
}

export async function checkCrateOpened(walletAddress: string, crateId: number) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::check_crate_opened`,
        type_arguments: [],
        arguments: [walletAddress, String(crateId)],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }

}

export async function getPrizeAllowed(walletAddress: string, crateId: number) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_prize_alloted`,
        type_arguments: [],
        arguments: [walletAddress, String(crateId)],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }

}

export async function claimCratePrize(walletAddress: string, crateId: number) {
  //claim_crate_prize 
  try {
    const supraProvider = window?.starkey?.supra
    if (!supraProvider) throw new Error('Supra wallet not connected.')

    const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
    const txExpiryTime = Math.ceil(Date.now() / 1000) + 60
    const optionalTransactionPayloadArgs = { txExpiryTime }

    const data = await supraProvider.createRawTransactionData([
      walletAddress,
      0,
      moduleAddress,
      'zap_shop_v1',
      'claim_crate_prize',
      [],
      [BCS.bcsSerializeUint64(crateId)],
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

export async function getAllMerchDetails() {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_all_merch_details`,
        type_arguments: [],
        arguments: [],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function getUserMerchQuantity(walletAddress: string, merchTypeId: number) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_user_merch_quantity`,
        type_arguments: [],
        arguments: [walletAddress, String(merchTypeId)],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function getConfigCopy() {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_config_copy`,
        type_arguments: [],
        arguments: [],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function getUserCrateLimitDaily(walletAddress: string, timestamp: number) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_user_crate_limit_daily`,
        type_arguments: [],
        arguments: [walletAddress, String(timestamp)],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

export async function getUserInventoryFull(walletAddress: string) {
  const moduleAddress = ZAPSHOP_CONTRACT[appEnv].CONTRACT_ADDRESS
  try {
    const response = await fetch(`${SUPRA_RPC_URL}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: `${moduleAddress}::zap_shop_v1::get_user_inventory_full`,
        type_arguments: [],
        arguments: [walletAddress],
      }),
    })

    const data = await response.json()
    return data?.result
  } catch (e) {
    console.log(e)
    throw e
  }
}

/**
 * Checks if a user can still purchase items based on daily limits
 * @param walletAddress User's wallet address
 * @param itemType Type of item: 'crate' | 'raffle' | 'merch'
 * @param quantity Quantity they want to purchase
 * @param tier Crate tier (1=Bronze, 2=Silver, 3=Gold) - only for crates
 * @param merchTypeId Merch type ID - only for merch
 * @returns Object with canBuy boolean, remaining count, and message
 */
export async function checkDailyLimit(
  walletAddress: string,
  itemType: 'crate' | 'raffle' | 'merch',
  quantity: number,
  tier?: number,
  merchTypeId?: number
): Promise<{ canBuy: boolean; remaining: number; limit: number; purchased: number; message: string }> {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    
    // Get user's daily purchases
    const dailyPurchasesRaw = await getUserCrateLimitDaily(walletAddress, currentTimestamp)
    // Handle array response or default to empty object if missing
    let dailyPurchases: any = {}
    if (Array.isArray(dailyPurchasesRaw)) {
      dailyPurchases = dailyPurchasesRaw[0] || {}
    } else if (dailyPurchasesRaw && typeof dailyPurchasesRaw === 'object') {
      dailyPurchases = dailyPurchasesRaw
    }
    
    // Get config to know the limits
    const configRaw = await getConfigCopy()
    // Handle array response - config is returned as an array with one object
    let config: any = {}
    if (Array.isArray(configRaw)) {
      config = configRaw[0] || {}
    } else if (configRaw && typeof configRaw === 'object') {
      config = configRaw
    }
    
    console.log('Daily purchases:', dailyPurchases)
    console.log('Config:', config)
    
    if (itemType === 'crate') {
      if (!tier) {
        return {
          canBuy: false,
          remaining: 0,
          limit: 0,
          purchased: 0,
          message: 'Tier is required for crate purchases'
        }
      }
      
      let purchased: number
      let limit: number
      let tierName: string
      
      if (tier === 1) { // Bronze
        purchased = Number(dailyPurchases.bronze || 0)
        limit = Number(config.bronze_user_cap_per_day || 0)
        tierName = 'Bronze'
      } else if (tier === 2) { // Silver
        purchased = Number(dailyPurchases.silver || 0)
        limit = Number(config.silver_user_cap_per_day || 0)
        tierName = 'Silver'
      } else if (tier === 3) { // Gold
        purchased = Number(dailyPurchases.gold || 0)
        limit = Number(config.gold_user_cap_per_day || 0)
        tierName = 'Gold'
      } else {
        return {
          canBuy: false,
          remaining: 0,
          limit: 0,
          purchased: 0,
          message: 'Invalid tier. Must be 1 (Bronze), 2 (Silver), or 3 (Gold)'
        }
      }
      
      const remaining = limit - purchased
      const canBuy = remaining >= quantity
      
      return {
        canBuy,
        remaining,
        limit,
        purchased,
        message: canBuy
          ? `You can buy ${quantity} ${tierName} crate(s). ${remaining} remaining today.`
          : `Daily limit reached for ${tierName} crates. You've purchased ${purchased}/${limit} today. ${remaining > 0 ? `Only ${remaining} remaining.` : 'No more available today.'}`
      }
    } else if (itemType === 'raffle') {
      // Note: The contract doesn't seem to have a daily limit for raffles in Config
      // But we can check the daily purchases count
      const purchased = Number(dailyPurchases.raffles || 0)
      // Since there's no explicit limit in config, we'll just show the count
      // You may want to add a limit to the contract or config
      return {
        canBuy: true, // No limit enforced in contract
        remaining: -1, // Unknown
        limit: -1, // Unknown
        purchased,
        message: `You've purchased ${purchased} raffle ticket(s) today. (No daily limit configured)`
      }
    } else if (itemType === 'merch') {
      // Merch has a season limit of 1 per type, not daily
      // Check if user already owns this merch type
      if (merchTypeId !== undefined) {
        try {
          const userMerch = await getUserMerchQuantity(walletAddress, merchTypeId)
          const owned = Number(userMerch.quantity || 0)
          
          if (owned > 0) {
            return {
              canBuy: false,
              remaining: 0,
              limit: 1,
              purchased: owned,
              message: `You already own this merchandise type. Limit: 1 per season.`
            }
          }
          
          return {
            canBuy: true,
            remaining: 1,
            limit: 1,
            purchased: owned,
            message: `You can buy this merchandise. Limit: 1 per season.`
          }
        } catch (e) {
          console.log(e)
          // If merch doesn't exist for user, they can buy it
          return {
            canBuy: true,
            remaining: 1,
            limit: 1,
            purchased: 0,
            message: `You can buy this merchandise. Limit: 1 per season.`
          }
        }
      }
      
      return {
        canBuy: false,
        remaining: 0,
        limit: 0,
        purchased: 0,
        message: 'Merch type ID is required'
      }
    }
    
    return {
      canBuy: false,
      remaining: 0,
      limit: 0,
      purchased: 0,
      message: 'Invalid item type'
    }
  } catch (e) {
    console.error('Error checking daily limit:', e)
    // On error, allow the purchase attempt (the contract will enforce limits)
    return {
      canBuy: true,
      remaining: -1,
      limit: -1,
      purchased: -1,
      message: 'Could not verify daily limit. Purchase will be attempted.'
    }
  }
}


