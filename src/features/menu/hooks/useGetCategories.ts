import { useEffect, useState } from "react";
import { CategoryForProduct } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { useMenuProductsStore } from "../storages/menuProductsStorage";

export const useGetCategories = () => {
  const [categories, setCategories] = useState<CategoryForProduct[]>([]);
  const { setCategories: setStoreCategories } = useMenuProductsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const { data, error, status } = await supabase
      .from("category_for_product")
      .select(`*`);

    if (error && status !== 406) {
      console.error("Error fetching categories:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setCategories(data);
      setStoreCategories(data);
      setLoading(false);
    }
  };

  return {
    categories,
    setCategories,
    loading,
  };
};
