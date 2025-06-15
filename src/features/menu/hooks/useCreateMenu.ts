import { useState } from "react";
import { createMenu } from "../apis";
import { MenuUpdate } from "../../../types/updateTypes";
import { Alert } from "react-native";
import { router } from "expo-router";
import { AxiosError } from "axios";

export const useCreateMenu = () => {
  const [parameters, setParameters] = useState<MenuUpdate>({
    name: "",
    restaurant_id: undefined,
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
        Alert.alert("Error", "Por favor, completa todos los campos.");
        return;
      }

      const res = await createMenu(parameters);

      router.back();
      router.push(`/menus/${res.data.id}`);
    } catch (error) {
      Alert.alert(
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
