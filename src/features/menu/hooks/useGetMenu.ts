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
    const { data, error, status } = await supabase
      .from("menu")
      .select(`*, restaurant(name)`)
      .eq("restaurant.owner", session?.user.id);

    if (error && status !== 406) {
      console.error("Error fetching menus:", error);
      setIsLoading(false);
      return;
    }

    if (data) {
      setMenus(data as MenuWithRestaurantName[]);
      setIsLoading(false);
    }
  };

  return {
    menus,
    isLoading,
  };
};
