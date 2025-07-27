import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useMenuProductsStore } from "../storages/menuProductsStorage";

export const useGetMenuProductsById = (menuId: string) => {
  const [loading, setLoading] = useState(true);
  const { setProducts, setAnnotations } = useMenuProductsStore();

  useEffect(() => {
    getProducts();
    return () => {
      setLoading(true);
    };
  }, [menuId]);

  const getProducts = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select(`*, product(*)`)
      .eq("id", menuId)
      .eq("product.deleted", false)
      .maybeSingle();

    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setAnnotations(data.annotations || "");
      setProducts(data.product || []);
      setLoading(false);
    }
  };

  return {
    loading,
  };
};
