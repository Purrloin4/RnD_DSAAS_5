import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SECRET_SERVICE_ROLE_KEY!,
  {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Access auth admin api
const adminAuthClient = supabase.auth.admin
