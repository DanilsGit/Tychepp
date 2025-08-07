import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Restaurant } from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";

export const useGetRestaurants = () => {
  const { session } = useAuthStore();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRestaurants();
  }, []);

  const getRestaurants = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("restaurant")
        .select(`*`)
        .eq("owner", session?.user.id)
        .order("created_at", { ascending: true });

      setIsLoading(false);
      if (!data) return;
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { restaurants, isLoading, refresh: getRestaurants };
};
