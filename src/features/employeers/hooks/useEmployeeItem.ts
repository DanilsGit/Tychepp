import { useState } from "react";
import { EmployeeProfile } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { Alert } from "react-native";

export const useEmployeeItem = (initialEmployee: EmployeeProfile) => {
  const [employee, setEmployee] = useState(initialEmployee);

  const handleAuthorization = async () => {
    const { error } = await supabase
      .from("employee")
      .update({ authorized: true, rejected: false })
      .eq("id", employee.id);

    if (error) {
      Alert.alert("Error", "No se pudo autorizar al empleado.");
      console.error("Error authorizing employee:", error);
      return;
    }

    Alert.alert("Éxito", "Empleado autorizado correctamente.");
    setEmployee((prev) => ({ ...prev, authorized: true, rejected: false }));
  };

  const handleCancellation = async () => {
    const { error } = await supabase
      .from("employee")
      .update({ authorized: false, rejected: true })
      .eq("id", employee.id);

    if (error) {
      Alert.alert("Error", "No se pudo cancelar la solicitud del empleado.");
      console.error("Error canceling employee request:", error);
      return;
    }

    Alert.alert("Éxito", "Solicitud del empleado cancelada correctamente.");
    setEmployee((prev) => ({ ...prev, authorized: false, rejected: true }));
  };

  const removeRejected = async () => {
    const { error } = await supabase
      .from("employee")
      .update({ rejected: false })
      .eq("id", employee.id);

    if (error) {
      console.error("Error removing rejection:", error);
    }

    setEmployee((prev) => ({ ...prev, rejected: false }));
    Alert.alert("Éxito", "Rechazo del empleado eliminado correctamente.");
  };

  return {
    employee,
    handleAuthorization,
    handleCancellation,
    removeRejected,
  };
};
