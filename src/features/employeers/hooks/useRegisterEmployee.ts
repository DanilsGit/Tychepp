import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { PlatformAlert } from "../../../components/PlatformAlert";

export const useRegisterEmployee = () => {
  const [parameters, setParameters] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    restaurantCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const signUpWithEmail = async () => {
    setLoading(true);

    const { email, password, restaurantCode, username } = parameters;

    if (!email || !password || !restaurantCode || !username.trim()) {
      PlatformAlert("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (password !== parameters.repeatPassword) {
      PlatformAlert("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      PlatformAlert("Por favor, introduce un email válido.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      PlatformAlert("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    // Buscar el restaurante por código
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurant")
      .select("id")
      .eq("restaurant_code", parameters.restaurantCode.toUpperCase())
      .single();

    if (restaurantError || !restaurant) {
      PlatformAlert("Código de restaurante inválido o no encontrado.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      if (error.message.includes("already registered")) {
        PlatformAlert(
          "El email ya está registrado",
          "Intenta iniciar sesión o recuperar tu contraseña."
        );
        return;
      }

      PlatformAlert(
        "Error al registrar, por favor intenta de nuevo más tarde."
      );
      setLoading(false);
      return;
    }

    if (!data.user) {
      PlatformAlert("No se pudo crear el usuario.");
      setLoading(false);
      return;
    }

    await createEmployeeProfile(data.user.id, restaurant.id);

    setLoading(false);
  };

  const createEmployeeProfile = async (
    user_id: string,
    restaurant_id: string
  ) => {
    if (!user_id) {
      PlatformAlert("No se pudo crear el perfil del empleado.");
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
      PlatformAlert("Error perfil del empleado: " + error.message);
      return;
    }

    // Vincular al empleado con el restaurante
    const { error: restaurantError } = await supabase.from("employee").insert({
      id: user_id,
      restaurant_id: restaurant_id,
    });

    if (restaurantError) {
      PlatformAlert("Error al vincular: " + restaurantError.message);
      return;
    }

    // Iniciar sesión automáticamente
    const { error: sessionError } = await supabase.auth.signInWithPassword({
      email: parameters.email,
      password: parameters.password,
    });

    if (sessionError) {
      PlatformAlert("Error al iniciar sesión: " + sessionError.message);
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
