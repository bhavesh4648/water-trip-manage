import { createClient } from '@supabase/supabase-js'

// These would be set in your Supabase project settings
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Driver {
  id: string
  name: string
  client_id: string
  phone?: string
  license_number?: string
  created_at: string
  updated_at: string
}

export interface Delivery {
  id: string
  date: string
  time: string
  driver_name: string
  client_name: string
  client_id?: string
  driver_id?: string
  signature_url?: string
  amount?: number
  notes?: string
  created_at: string
  updated_at: string
}