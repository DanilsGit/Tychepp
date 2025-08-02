import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { router } from "expo-router";
import { useAuthStore } from "../../login/stores/authStore";
import { PlatformAlert } from "../../../components/PlatformAlert";

export const useCreateRestaurant = () => {
  const { session } = useAuthStore();

  const [parameters, setParameters] = useState({
    name: "",
    welcome_message: "",
    whatsapp_number: "",
    owner: session?.user.id,
  });
  const [createLoading, setCreateLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [field]: field === "whatsapp_number" ? value.replace(/\s/g, "") : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !parameters.name ||
      !parameters.welcome_message ||
      !parameters.whatsapp_number
    ) {
      PlatformAlert("Advertencia", "Todos los campos son obligatorios.");
      return;
    }

    if (!parameters.whatsapp_number.startsWith("+")) {
      PlatformAlert(
        "Advertencia",
        "El número de WhatsApp debe comenzar con '+'. Por ejemplo: +57..."
      );
      return;
    }

    setCreateLoading(true);
    try {
      const { error } = await supabase.from("restaurant").insert(parameters);
      if (error) throw error;
      PlatformAlert("Éxito", "Restaurante creado exitosamente.");
      router.back();
    } catch (error) {
      PlatformAlert(
        "Error",
        "Ocurrió un error al crear el restaurante. Por favor, inténtalo de nuevo."
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
