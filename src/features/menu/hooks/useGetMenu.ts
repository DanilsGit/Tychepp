import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../login/stores/authStore";
import { MenuWithRestaurantName } from "../../../types/rowTypes";

export const useGetMenu = () => {
  const { session } = useAuthStore();
  const [menus, setMenus] = useState<MenuWithRestaurantName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("menu")
        .select("*, restaurant!inner(*)")
        .eq("restaurant.owner", session?.user.id);

      if (error) throw new Error(`Error fetching menus: ${error.message}`);

      if (data) {
        setMenus(data as MenuWithRestaurantName[]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(
        "Unexpected error fetching menus:",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    menus,
    isLoading,
    refetch: getMenus,
  };
};
