// import { createClient } from '@supabase/supabase-js'
// const url = process.env.NEXT_PUBLIC_SUPABASE_URL
// const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// if (!url || !anonKey) {
//   throw new Error('Bloody TypeScript!')
// }
// const supabase = createClient(url, anonKey)
// export default supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase