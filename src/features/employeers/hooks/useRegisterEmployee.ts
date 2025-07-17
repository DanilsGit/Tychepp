import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { User } from "@supabase/supabase-js";

export const useRegisterEmployee = () => {
  const [parameters, setParameters] = useState({
    username: "",
    email: "",
    password: "",
    restaurantCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field === "restaurantCode") {
      value = value.trim().toUpperCase();
    }
    setParameters((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const signUpWithEmail = async () => {
    setLoading(true);

    const { email, password, restaurantCode } = parameters;

    if (!email || !password || !restaurantCode) {
      Alert.alert("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Por favor, introduce un email válido.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      Alert.alert("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    // Buscar el restaurante por código
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurant")
      .select("id")
      .eq("restaurant_code", parameters.restaurantCode)
      .single();

    if (restaurantError || !restaurant) {
      Alert.alert("Código de restaurante inválido o no encontrado.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error al registrar, por favor intenta de nuevo más tarde.");
      setLoading(false);
      return;
    }

    await createEmployeeProfile(data.user?.id, restaurant.id);

    setLoading(false);
  };

  const createEmployeeProfile = async (
    user_id: string | undefined,
    restaurant_id: string
  ) => {
    if (!user_id) {
      Alert.alert("No se pudo crear el perfil del empleado.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: parameters.username,
        role: 3,
      })
      .eq("id", user_id);

    if (error) {
      Alert.alert("Error perfil del empleado: " + error.message);
      return;
    }

    // Vincular al empleado con el restaurante
    const { error: restaurantError } = await supabase.from("employee").insert({
      id: user_id,
      restaurant_id: restaurant_id,
    });

    if (restaurantError) {
      Alert.alert("Error al vincular: " + restaurantError.message);
      return;
    }

    // Iniciar sesión automáticamente
    const { error: sessionError } = await supabase.auth.signInWithPassword({
      email: parameters.email,
      password: parameters.password,
    });

    if (sessionError) {
      Alert.alert("Error al iniciar sesión: " + sessionError.message);
      return;
    }
  };

  return {
    parameters,
    loading,
    handleChange,
    signUpWithEmail,
  };
};
