import {
  NEXT_PUBLIC_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ADMIN_KEY
} from "@/constants/main";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_ANON_KEY as string,
);

export const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_ADMIN_KEY as string
);