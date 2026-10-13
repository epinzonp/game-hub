import { createBrowserClient } from "@supabase/ssr";

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = requiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
