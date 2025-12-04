import { createClient } from '@supabase/supabase-js'

// Schema defined in supabase/migrations/reset_and_recreate_schema.sql
// Database schema types
export interface Database {
  public: {
    Tables: {
      salawat_campaign: {
        Row: {
          id: string
          total_count: number
          contribution_count: number
          updated_at: string
        }
        Insert: {
          id?: string
          total_count?: number
          contribution_count?: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_count?: number
          contribution_count?: number
          updated_at?: string
        }
      }
      contributions: {
        Row: {
          id: string
          name: string | null
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          amount?: number
          created_at?: string
        }
      }
    }
    Functions: {
      increment_salawat_stats: {
        Args: {
          increment_amount: number
        }
        Returns: {
          total_count: number
          contribution_count: number
        }
      }
    }
  }
}

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Create typed Supabase client instance (singleton pattern)
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

