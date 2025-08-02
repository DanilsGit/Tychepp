import { useState } from "react";
import { EmployeeProfile } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { Alert } from "react-native";
import { PlatformAlert } from "../../../components/PlatformAlert";

export const useEmployeeItem = (initialEmployee: EmployeeProfile) => {
  const [employee, setEmployee] = useState(initialEmployee);

  const handleAuthorization = async () => {
    const { error } = await supabase
      .from("employee")
      .update({ authorized: true, rejected: false })
      .eq("id", employee.id);

    if (error) {
      PlatformAlert("Error", "No se pudo autorizar al empleado.");
      console.error("Error authorizing employee:", error);
      return;
    }

    PlatformAlert("Éxito", "Empleado autorizado correctamente.");
    setEmployee((prev) => ({ ...prev, authorized: true, rejected: false }));
  };

  const handleCancellation = async () => {
    const { error } = await supabase
      .from("employee")
      .update({ authorized: false, rejected: true })
      .eq("id", employee.id);

    if (error) {
      PlatformAlert("Error", "No se pudo cancelar la solicitud del empleado.");
      console.error("Error canceling employee request:", error);
      return;
    }

    PlatformAlert("Éxito", "Solicitud del empleado cancelada correctamente.");
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
    PlatformAlert("Éxito", "Rechazo del empleado eliminado correctamente.");
  };

  return {
    employee,
    handleAuthorization,
    handleCancellation,
    removeRejected,
  };
};
