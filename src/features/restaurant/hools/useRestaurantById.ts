import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { RestaurantWithMenu } from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";

export const useRestaurantById = (restaurantId: string) => {
  const { session } = useAuthStore();
  const [restaurant, setRestaurant] = useState<RestaurantWithMenu>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRestaurant();
  }, []);

  const getRestaurant = async () => {
    try {
      const { data } = await supabase
        .from("restaurant")
        .select(`*, menu(*, product(*))`)
        .eq("owner", session?.user.id)
        .eq("id", restaurantId)
        .eq("menu.product.deleted", false)
        .single();

      setIsLoading(false);
      if (!data) return;
      setRestaurant(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRestaurant = async (updatedData: Partial<RestaurantWithMenu>) => {
    try {
      const {
        id,
        owner,
        state,
        created_at,
        icon_url,
        restaurant_code,
        menu,
        ...data
      } = updatedData;

      const { error } = await supabase
        .from("restaurant")
        .update(data)
        .eq("id", restaurantId)
        .eq("owner", session?.user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  return { restaurant, isLoading, updateRestaurant };
};
