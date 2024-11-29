import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const schema = process.env.NODE_ENV === 'test' ? 'testing' : 'public';
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: schema } }
  );
}