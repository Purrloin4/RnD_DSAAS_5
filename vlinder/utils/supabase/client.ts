import { createBrowserClient } from '@supabase/ssr'
<<<<<<< HEAD
import {Database} from "@/types/supabase"
=======
import EnviromentStrings from '@/src/enums/envStrings';
import schemeStrings from '@/src/enums/schemeStrings';
>>>>>>> development



const schema = process.env.NODE_ENV === 'test' ? 'testing' : 'public';
export function createClient() {
<<<<<<< HEAD
=======
  const schema = process.env.NODE_ENV === EnviromentStrings.TEST ? schemeStrings.TEST : schemeStrings.DEVELOPMENT;
>>>>>>> development
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: schema } }
  );
}