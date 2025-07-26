import { Database } from "./supabase";

export type Restaurant = Database["public"]["Tables"]["restaurant"]["Row"];

export type Menu = Database["public"]["Tables"]["menu"]["Row"];

export type Product = Database["public"]["Tables"]["product"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Employee = Database["public"]["Tables"]["employee"]["Row"];

export type CategoryForProduct =
  Database["public"]["Tables"]["category_for_product"]["Row"];

export type Conversations =
  Database["public"]["Tables"]["conversations"]["Row"] & {
    newMessage?: boolean;
  };

export type Order = Database["public"]["Tables"]["order"]["Row"];

export type OrderProductsProduct =
  Database["public"]["Tables"]["orders_products"]["Row"] & {
    product: Product;
  };

// ? Mixed types for better type inference

export type ProfileEmployee = Profile & {
  employee: Employee & {
    restaurant: Restaurant;
  };
};

export type EmployeeProfile = Employee & { profiles: Profile };

export type MenuWithRestaurantName = Menu & { restaurant: { name: string } };

export interface Message {
  role: string;
  content: string;
}
