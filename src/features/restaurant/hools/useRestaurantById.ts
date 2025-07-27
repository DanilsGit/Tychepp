import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Restaurant } from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";

export const useRestaurantById = (restaurantId: string) => {
  const { session } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRestaurant();
  }, []);

  const getRestaurant = async () => {
    try {
      const { data } = await supabase
        .from("restaurant")
        .select(`*`)
        .eq("owner", session?.user.id)
        .eq("id", restaurantId);
      setIsLoading(false);
      if (!data) return;
      setRestaurant(data[0]);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRestaurant = async (updatedData: Partial<Restaurant>) => {
    try {
      const {
        id,
        owner,
        state,
        created_at,
        icon_url,
        ready,
        restaurant_code,
        ...data
      } = updatedData;
      const { error } = await supabase
        .from("restaurant")
        .update(data)
        .eq("id", restaurantId)
        .eq("owner", session?.user.id);

      if (error) throw error;
      console.log("Restaurant updated successfully", data);
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  return { restaurant, isLoading, updateRestaurant };
};
