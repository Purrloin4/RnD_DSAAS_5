import { createBrowserClient } from '@supabase/ssr'
import {Database} from "@/types/supabase"



const schema = process.env.NODE_ENV === 'test' ? 'testing' : 'public';
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: schema } }
  );
}