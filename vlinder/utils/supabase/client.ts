import { createBrowserClient } from '@supabase/ssr'
import EnviromentStrings from '@/src/enums/envStrings';
import schemeStrings from '@/src/enums/schemeStrings';

export function createClient() {
  const schema = process.env.NODE_ENV === EnviromentStrings.TEST ? schemeStrings.TEST : schemeStrings.DEVELOPMENT;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: schema } }
  );
}