import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Restaurant } from "../../../types/rowTypes";

export const useGetRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRestaurants();
  }, []);

  const getRestaurants = async () => {
    try {
      const { data } = await supabase.from("restaurant").select(`*`);
      setIsLoading(false);
      if (!data) return;
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { restaurants, isLoading };
};
