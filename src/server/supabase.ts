import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";

const project_url = env.NEXT_PUBLIC_PROJECT_URL;
const anon_key = env.NEXT_PUBLIC_ANON_KEY;

export const supabase = createClient(project_url, anon_key);
