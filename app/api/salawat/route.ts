/**
 * Salawat Campaign API Route
 * 
 * This API route uses Supabase for persistent storage. Stats are saved to
 * `salawat_campaign` table (global totals) and `contributions` table
 * (individual submissions with optional names). Contributions are inserted by
 * the store layer; campaign totals are updated atomically via RPC. Real-time
 * updates are handled via Supabase subscriptions in the client.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getStats, incrementStats } from '@/lib/salawatStore'

// Load initial stats from persistent backend
export async function GET() {
  try {
    const stats = await getStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

// Increment salawat counter
// Accepts optional `name` field for contributor tracking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, name } = body

    // Validate amount (name is optional, no validation needed)
    if (!amount || typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: 'Amount must be a positive integer' },
        { status: 400 }
      )
    }

    // Update stats using persistent backend
    const updatedStats = await incrementStats(amount, name)

    return NextResponse.json({
      totalCount: updatedStats.totalCount,
      contributionCount: updatedStats.contributionCount,
    })
  } catch (error) {
    // Handle validation errors from incrementStats
    if (error instanceof Error && error.message.includes('Amount must be')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    )
  }
}

