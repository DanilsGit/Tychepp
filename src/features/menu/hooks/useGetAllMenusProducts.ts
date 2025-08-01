import { useEffect, useState } from "react";
import { Product, ProfileEmployee } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../login/stores/authStore";

export const useGetAllMenusProducts = () => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();

    return () => {
      setProducts([]);
      setLoading(true);
    };
  }, []);

  const getProducts = async () => {
    const { data, error, status } = await supabase
      .from("menu")
      .select(`*, product(*)`)
      .eq("restaurant_id", profile.employee.restaurant_id)
      .order("name", { ascending: true });

    if (error && status !== 406) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }

    const allProducts = data?.flatMap((menu) => menu.product) || [];

    if (data && allProducts.length > 0) {
      setProducts(allProducts as Product[]);
      setLoading(false);
    }
  };

  return {
    products,
    loading,
  };
};
