import { Database } from "./supabase";
export type Restaurant = Database["public"]["Tables"]["restaurant"]["Row"];
export type Menu = Database["public"]["Tables"]["menu"]["Row"];