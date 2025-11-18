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
    if (typeof supraProvider.getGasPrice === 'function') {
      const gp = Number(await supraProvider.getGasPrice());
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


