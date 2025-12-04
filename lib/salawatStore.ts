/**
 * Salawat Campaign Stats Store
 * 
 * This module provides storage for salawat campaign statistics.
 * Uses Supabase for persistent storage. Contributions are inserted by this module;
 * campaign totals are updated atomically via RPC to prevent race conditions under concurrent submissions.
 */

import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'
import type { Database } from './supabase'

interface CampaignStats {
  totalCount: number
  contributionCount: number
}

/**
 * Ensures a salawat_campaign row exists, creating one with zero totals if needed.
 * 
 * @returns Promise resolving to the campaign row ID
 * @throws Error if operation fails
 */
async function ensureCampaignExists(): Promise<string> {
  // Try to get existing row
  const { data: existing, error: fetchError } = await supabase
    .from('salawat_campaign')
    .select('id')
    .single() as { data: Database['public']['Tables']['salawat_campaign']['Row'] | null; error: PostgrestError | null }
  
  const typedFetchError: PostgrestError | null = fetchError

  // If row exists, return its ID
  if (!typedFetchError && existing) {
    return existing.id
  }

  // If no row exists (PGRST116 error code for "no rows"), create one
  if (typedFetchError && typedFetchError.code === 'PGRST116') {
    const insertPayload: Database['public']['Tables']['salawat_campaign']['Insert'] = {
      total_count: 0,
      contribution_count: 0,
      updated_at: new Date().toISOString(),
    }
    const { data: newRow, error: insertError } = await (supabase
      .from('salawat_campaign')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type inference limitation
      .insert(insertPayload as any)
      .select('id')
      .single() as unknown as Promise<{ data: Database['public']['Tables']['salawat_campaign']['Row'] | null; error: PostgrestError | null }>)
    
    const typedInsertError: PostgrestError | null = insertError

    if (typedInsertError) {
      throw new Error(`Failed to create initial campaign row: ${typedInsertError.message}`)
    }

    if (!newRow) {
      throw new Error('Insert succeeded but returned no data')
    }
    return newRow.id
  }

  // Other errors should be thrown
  if (!typedFetchError) {
    throw new Error('Failed to ensure campaign exists: unknown error')
  }
  throw new Error(`Failed to ensure campaign exists: ${typedFetchError.message}`)
}

/**
 * Retrieves the current campaign statistics from Supabase.
 * Returns default zeros if no campaign row exists yet.
 * 
 * @returns Promise resolving to the current stats
 * @throws Error if query fails (other than missing row)
 */
export async function getStats(): Promise<CampaignStats> {
  const { data, error } = await supabase
    .from('salawat_campaign')
    .select('total_count, contribution_count')
    .single() as { data: Pick<Database['public']['Tables']['salawat_campaign']['Row'], 'total_count' | 'contribution_count'> | null; error: PostgrestError | null }

  // If no rows exist, return default zeros
  if (error && error.code === 'PGRST116') {
    return {
      totalCount: 0,
      contributionCount: 0,
    }
  }

  if (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to fetch stats: no data returned')
  }

  return {
    totalCount: data.total_count,
    contributionCount: data.contribution_count,
  }
}

/**
 * Increments the campaign statistics by the specified amount and records the contribution.
 * Uses atomic database operations via Postgres RPC function to prevent race conditions.
 * 
 * @param amount - The number of salawat to add (must be positive integer)
 * @param name - Optional contributor name
 * @returns Promise resolving to the updated stats
 * @throws Error if amount is invalid or database operation fails
 */
export async function incrementStats(amount: number, name?: string): Promise<CampaignStats> {
  // Validate amount
  if (!amount || typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('Amount must be a positive integer')
  }

  // Step 1: Ensure campaign row exists (creates if missing)
  await ensureCampaignExists()

  // Step 2: Insert new contribution
  const contributionPayload: Database['public']['Tables']['contributions']['Insert'] = {
    name: name || null,
    amount,
  }
  const { data: _contributionData, error: contributionError } = await (supabase
    .from('contributions')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type inference limitation
    .insert(contributionPayload as any)
    .select()
    .single() as unknown as Promise<{ data: Database['public']['Tables']['contributions']['Row'] | null; error: PostgrestError | null }>)

  if (contributionError) {
    throw new Error(`Failed to record contribution: ${contributionError.message}`)
  }

  // Step 3: Update campaign totals atomically via RPC (contribution already inserted above,
  // RPC only updates counters to prevent race conditions)
  const rpcArgs: Database['public']['Functions']['increment_salawat_stats']['Args'] = {
    increment_amount: amount,
  }
  const { data: rpcData, error: rpcError } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase type inference limitation
    supabase.rpc('increment_salawat_stats', rpcArgs as any) as unknown as Promise<{ data: Database['public']['Functions']['increment_salawat_stats']['Returns'] | null; error: PostgrestError | null }>
  )

  if (rpcError) {
    throw new Error(`Failed to update campaign totals via RPC: ${rpcError.message}`)
  }

  // RPC succeeded, return the updated stats
  if (!rpcData) {
    throw new Error('RPC call succeeded but returned no data')
  }

  return {
    totalCount: rpcData.total_count,
    contributionCount: rpcData.contribution_count,
  }
}

