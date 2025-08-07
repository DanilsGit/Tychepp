import { Database } from "./supabase";

export type Restaurant = Database["public"]["Tables"]["restaurant"]["Row"];

export type Menu = Database["public"]["Tables"]["menu"]["Row"];

export type Product = Database["public"]["Tables"]["product"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Employee = Database["public"]["Tables"]["employee"]["Row"];

export type CategoryForProduct =
  Database["public"]["Tables"]["category_for_product"]["Row"];

export type Order = Database["public"]["Tables"]["order"]["Row"];

// ? Mixed types for better type inference

export type EmployeeProfile = Employee & { profiles: Profile };

export type MenuWithRestaurantName = Menu & { restaurant: { name: string } };

export type MenuWithProducts = Menu & {
  product: Product[];
};

export type RestaurantWithMenu = Restaurant & {
  menu: MenuWithProducts[];
};

export type ProfileEmployee = Profile & {
  employee: Employee & {
    restaurant: Restaurant;
  };
};

export type OrderProductsProduct =
  Database["public"]["Tables"]["orders_products"]["Row"] & {
    product: Product & { category_for_product: CategoryForProduct };
  };

export type MenuProductsCategory =
  Database["public"]["Tables"]["menu"]["Row"] & {
    product: Product & { category_for_product: CategoryForProduct };
  };

export type ProductCategory = Database["public"]["Tables"]["product"]["Row"] & {
  category_for_product: CategoryForProduct;
};

export type Conversations =
  Database["public"]["Tables"]["conversations"]["Row"] & {
    newMessage?: boolean;
  };

export interface Message {
  role: string;
  content: string;
}
