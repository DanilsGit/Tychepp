import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { PlatformAlert } from "../../../components/PlatformAlert";

export const useRegisterManager = () => {
  const [parameters, setParameters] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setParameters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const signUpWithEmail = async () => {
    setLoading(true);

    const { email, password, repeatPassword, fullname, phone } = parameters;

    if (password !== repeatPassword) {
      PlatformAlert("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!email || !password || !repeatPassword || !fullname.trim()) {
      PlatformAlert("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (!phone.includes("+")) {
      PlatformAlert(
        "Teléfono sin código de país.",
        "Por favor, incluye el código de país ejemplo +57"
      );
      setLoading(false);
      return;
    }

    if (phone.includes(" ")) {
      PlatformAlert("El número de teléfono no debe contener espacios.");
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

    // Ver si alguien ya está registrado con ese numero
    const { data: existingUsers, error: fetchError } = await supabase
      .from("profiles")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();

      console.log("Existing Users:", existingUsers);

    if (fetchError) {
      PlatformAlert("Error al verificar el teléfono", fetchError.message);
      setLoading(false);
      return;
    }

    if (existingUsers) {
      PlatformAlert(
        "El número de teléfono ya está registrado",
        "Intenta iniciar sesión o recuperar tu contraseña."
      );
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setLoading(false);

      if (error.message.includes("already registered")) {
        PlatformAlert(
          "El email ya está registrado",
          "Intenta iniciar sesión o recuperar tu contraseña."
        );
        return;
      }

      PlatformAlert("Error al registrar", error.message);
      return;
    }

    if (!data.user) {
      PlatformAlert("No se pudo registrar el usuario.");
      setLoading(false);
      return;
    }

    await createManagerProfile(data.user.id);

    setLoading(false);
  };

  const createManagerProfile = async (user_id: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        id: user_id,
        full_name: parameters.fullname.trim(),
        username: parameters.email.split("@")[0],
        role: 2,
        phone: parameters.phone,
      })
      .eq("id", user_id);

    if (error) {
      PlatformAlert("Error al crear el perfil del gerente", error.message);
      return;
    }

    // Iniciar sesión automáticamente
    const { error: sessionError } = await supabase.auth.signInWithPassword({
      email: parameters.email,
      password: parameters.password,
    });

    if (sessionError) {
      PlatformAlert("Error al iniciar sesión", sessionError.message);
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
