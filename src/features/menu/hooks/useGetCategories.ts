import { useEffect, useState } from "react";
import { CategoryForProduct } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";

export const useGetCategories = () => {
  const [categories, setCategories] = useState<CategoryForProduct[]>([]);
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
      setLoading(false);
    }
  };

  return {
    categories,
    setCategories,
    loading,
  };
};
