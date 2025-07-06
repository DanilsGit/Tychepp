import { Database } from "./supabase";
export type Restaurant = Database["public"]["Tables"]["restaurant"]["Row"];
export type Menu = Database["public"]["Tables"]["menu"]["Row"];
export type Product = Database["public"]["Tables"]["product"]["Row"];
export type CategoryForProduct = Database["public"]["Tables"]["category_for_product"]["Row"];
export type MenuWithRestaurantName = Menu & { restaurant: { name: string } } 