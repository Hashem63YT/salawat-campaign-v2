import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client with proper error handling
const createSupabaseClient = () => {
  // Check if we have valid environment variables
  const hasValidUrl = supabaseUrl && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')
  const hasValidKey = supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 50
  
  if (hasValidUrl && hasValidKey) {
    // Use actual Supabase credentials
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Using Supabase URL:', supabaseUrl.substring(0, 30) + '...')
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  }
  
  // Fallback for build time only - should never be used at runtime on Vercel
  if (typeof window !== 'undefined') {
    // We're in the browser but env vars are missing - this is a configuration error
    console.error('❌ Missing Supabase environment variables at runtime!')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  }
  
  // Use a valid Supabase URL format for build-time only
  // This should never be used in production runtime
  const fallbackUrl = 'https://placeholder-project.supabase.co'
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  
  return createClient(fallbackUrl, fallbackKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })
}

export const supabase = createSupabaseClient()

// ============================================================================
// Database Schema Types
// ============================================================================

/**
 * Database row type for the salawat_counter table
 * Matches the PostgreSQL table schema (snake_case)
 */
export interface SalawatCounter {
  id: number
  total_count: number
  contribution_count: number
  updated_at: string
}

/**
 * Client-side campaign statistics type
 * Uses camelCase for JavaScript conventions
 */
export interface CampaignStats {
  totalCount: number
  contributionCount: number
}

/**
 * Return type from the increment_salawat RPC function
 * Matches the JSON object returned by the PostgreSQL function
 */
export interface IncrementResult {
  total_count: number
  contribution_count: number
  contribution_id: number
}

/**
 * Database row type for the salawat_contributions table
 * Matches the PostgreSQL table schema (snake_case)
 */
export interface SalawatContribution {
  id: number
  contributor_name: string
  amount: number
  created_at: string
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Custom database error class with additional context
 */
export class DatabaseError extends Error {
  code?: string
  details?: string
  hint?: string

  constructor(message: string, code?: string, details?: string, hint?: string) {
    super(message)
    this.name = 'DatabaseError'
    this.code = code
    this.details = details
    this.hint = hint
  }
}

/**
 * Transforms Supabase errors into structured DatabaseError objects
 * Provides better error handling and debugging information
 */
function handleSupabaseError(error: any): DatabaseError {
  if (error instanceof DatabaseError) {
    return error
  }

  const message = error?.message || 'An unknown database error occurred'
  const code = error?.code || error?.error_code
  const details = error?.details
  const hint = error?.hint

  // Log error details for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Database error details:', {
      message,
      code,
      details,
      hint,
      fullError: error,
    })
  }

  return new DatabaseError(message, code, details, hint)
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Retrieves the current campaign statistics from the database
 * 
 * Fetches both total_count and contribution_count from the salawat_counter table.
 * Uses .single() to get the single row (id = 1).
 * 
 * @returns Promise resolving to an object with data and error properties
 * @returns data - Campaign statistics in camelCase format, or null if error
 * @returns error - DatabaseError object if an error occurred, or null if successful
 * 
 * @example
 * ```typescript
 * const { data, error } = await getCampaignStats()
 * if (error) {
 *   console.error('Failed to fetch stats:', error.message)
 * } else {
 *   console.log('Total count:', data?.totalCount)
 *   console.log('Contributions:', data?.contributionCount)
 * }
 * ```
 */
export async function getCampaignStats(): Promise<{
  data: CampaignStats | null
  error: DatabaseError | null
}> {
  try {
    const { data, error } = await supabase
      .from('salawat_counter')
      .select('total_count,contribution_count')
      .eq('id', 1)
      .single<SalawatCounter>()

    if (error) {
      // Log the full error for debugging
      console.error('Supabase query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return {
        data: null,
        error: handleSupabaseError(error),
      }
    }

    if (!data) {
      return {
        data: null,
        error: new DatabaseError('No campaign data found'),
      }
    }

    // Transform snake_case database fields to camelCase for client-side use
    const stats: CampaignStats = {
      totalCount: data.total_count,
      contributionCount: data.contribution_count,
    }

    return {
      data: stats,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Increments the Salawat counter by a specified amount and saves the contribution
 * 
 * Uses the Supabase RPC function to atomically increment both counters and save
 * the individual contribution with the contributor's name.
 * The RPC function ensures atomic operations and server-side validation.
 * 
 * @param amount - Number of Salawat to add (must be a positive integer)
 * @param contributorName - Name of the person making the contribution (required)
 * @returns Promise resolving to an object with data and error properties
 * @returns data - Updated campaign statistics in camelCase format, or null if error
 * @returns error - DatabaseError object if an error occurred, or null if successful
 * 
 * @throws {DatabaseError} If amount is not a positive integer or name is empty
 * 
 * @example
 * ```typescript
 * const { data, error } = await incrementSalawat(10, 'Ahmed')
 * if (error) {
 *   console.error('Failed to increment:', error.message)
 * } else {
 *   console.log('New total:', data?.totalCount)
 *   console.log('New contributions:', data?.contributionCount)
 * }
 * ```
 */
export async function incrementSalawat(
  amount: number,
  contributorName: string
): Promise<{
  data: CampaignStats | null
  error: DatabaseError | null
}> {
  try {
    // Validate that amount is a positive integer
    if (!Number.isInteger(amount) || amount <= 0) {
      return {
        data: null,
        error: new DatabaseError(
          'Amount must be a positive integer',
          'INVALID_AMOUNT'
        ),
      }
    }

    // Validate that contributor name is provided
    if (!contributorName || contributorName.trim().length === 0) {
      return {
        data: null,
        error: new DatabaseError(
          'Contributor name is required',
          'INVALID_NAME'
        ),
      }
    }

    // Call the RPC function with the amount and contributor name
    // RPC functions provide atomic operations and server-side logic
    const { data, error } = await supabase.rpc(
      'increment_salawat',
      {
        amount: amount,
        contributor_name: contributorName.trim(),
      }
    ) as { data: IncrementResult | null; error: any }

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error),
      }
    }

    if (!data) {
      return {
        data: null,
        error: new DatabaseError('RPC function returned no data'),
      }
    }

    // Supabase RPC already returns parsed JSON, so data is typed as IncrementResult
    const result: IncrementResult = data

    // Transform snake_case database fields to camelCase for client-side use
    const stats: CampaignStats = {
      totalCount: result.total_count,
      contributionCount: result.contribution_count,
    }

    return {
      data: stats,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    }
  }
}

// ============================================================================
// Optimistic Update Helper
// ============================================================================

/**
 * Calculates optimistic campaign statistics for immediate UI updates
 * 
 * This is a client-side utility function that immediately calculates what
 * the stats would be after an increment, without waiting for the database
 * response. Use this for optimistic UI updates to improve user experience.
 * 
 * Note: This does NOT update the database. You must still call incrementSalawat()
 * to persist the changes. The optimistic update should be reverted if the
 * database operation fails.
 * 
 * @param currentStats - Current campaign statistics
 * @param amount - Number of Salawat to add
 * @returns Calculated campaign statistics after increment
 * 
 * @example
 * ```typescript
 * // Optimistic update
 * const optimisticStats = calculateOptimisticStats(currentStats, 10)
 * setStats(optimisticStats) // Update UI immediately
 * 
 * // Then perform actual database operation
 * const { data, error } = await incrementSalawat(10)
 * if (error) {
 *   // Revert optimistic update on error
 *   setStats(currentStats)
 * } else {
 *   // Use actual data from database
 *   setStats(data)
 * }
 * ```
 */
export function calculateOptimisticStats(
  currentStats: CampaignStats,
  amount: number
): CampaignStats {
  return {
    totalCount: currentStats.totalCount + amount,
    contributionCount: currentStats.contributionCount + 1,
  }
}