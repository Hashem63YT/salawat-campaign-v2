/**
 * Salawat Campaign Stats Store
 * 
 * This module provides storage for salawat campaign statistics.
 * Uses Supabase for persistent storage. Contributions are inserted by this module;
 * campaign totals are updated atomically via RPC to prevent race conditions under concurrent submissions.
 */

import { supabase } from './supabase'

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
    .single()

  // If row exists, return its ID
  if (existing && !fetchError) {
    return existing.id
  }

  // If no row exists (PGRST116 error code for "no rows"), create one
  if (fetchError && fetchError.code === 'PGRST116') {
    const { data: newRow, error: insertError } = await supabase
      .from('salawat_campaign')
      .insert({
        total_count: 0,
        contribution_count: 0,
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError) {
      throw new Error(`Failed to create initial campaign row: ${insertError.message}`)
    }

    return newRow.id
  }

  // Other errors should be thrown
  throw new Error(`Failed to ensure campaign exists: ${fetchError.message}`)
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
    .single()

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
  const { data: contributionData, error: contributionError } = await supabase
    .from('contributions')
    .insert({ name: name || null, amount })
    .select()
    .single()

  if (contributionError) {
    throw new Error(`Failed to record contribution: ${contributionError.message}`)
  }

  // Step 3: Update campaign totals atomically via RPC (contribution already inserted above,
  // RPC only updates counters to prevent race conditions)
  const { data: rpcData, error: rpcError } = await supabase.rpc('increment_salawat_stats', {
    increment_amount: amount,
  })

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

