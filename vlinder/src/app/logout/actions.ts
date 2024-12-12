import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export async function logout(): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return false; // Explicitly return false on error
  }

  return true; // Explicitly return true on success
}
