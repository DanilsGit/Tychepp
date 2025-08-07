import { useState } from "react";
import { MenuUpdate } from "../../../types/updateTypes";
import { router } from "expo-router";
import { AxiosError } from "axios";
import { PlatformAlert } from "../../../components/PlatformAlert";
import { supabase } from "../../../lib/supabase";

export const useCreateMenu = () => {
  const [parameters, setParameters] = useState<MenuUpdate>({
    name: "",
    restaurant_id: "",
  });

  const [createLoading, setCreateLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setParameters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setCreateLoading(true);
    try {
      if (!parameters.name?.trim() || !parameters.restaurant_id) {
        PlatformAlert("Error", "Por favor, completa todos los campos.");
        return;
      }
      // Check if restaurant exists
      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurant")
        .select("id")
        .eq("id", parameters.restaurant_id)
        .single();

      if (restaurantError || !restaurant) {
        PlatformAlert("Error", "Restaurante no encontrado.");
        return;
      }

      const { data: menu, error } = await supabase
        .from("menu")
        .insert({
          name: parameters.name,
          restaurant_id: parameters.restaurant_id,
        })
        .select("*")
        .single();

      if (error) throw error;

      router.back();
      router.push(`/menus/${menu.id}`);
    } catch (error) {
      PlatformAlert(
        "Error",
        error instanceof AxiosError
          ? error.response?.data.error
          : "Ocurrió un error al crear el menú."
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return {
    parameters,
    handleChange,
    handleSubmit,
    createLoading,
  };
};
