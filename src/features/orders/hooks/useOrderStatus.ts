import { Alert } from "react-native";
import { Order, ProfileEmployee } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { useState } from "react";
import { sendConfirmOrder, sendRejectOrder } from "../api/messages";
import { useAuthStore } from "../../login/stores/authStore";

export const useOrderStatus = (order: Order) => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [loading, setLoading] = useState(false);
  const [cancelationReason, setCancellationReason] = useState("");

  const confirmOrder = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("order")
        .update({ status: "CONFIRMED" })
        .eq("id", order.id);

      if (error) {
        Alert.alert(
          "Error",
          "No se pudo confirmar la orden. Por favor, inténtalo de nuevo más tarde."
        );
        return;
      }

      await sendConfirmOrder(
        order.id,
        profile.employee.restaurant.whatsapp_number,
        order.client_number
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo enviar el mensaje de confirmación al cliente. Por favor, inténtalo de nuevo más tarde."
      );
      console.error("Error sending confirmation message:", error);
      return;
    } finally {
      setLoading(false);
      Alert.alert(
        `Orden #00${order.id} Confirmada`,
        `Se le ha enviado el mensaje de confirmación al cliente.`
      );
    }
  };

  const sendDelivery = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("order")
        .update({ status: "DELIVERED" })
        .eq("id", order.id);

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert("Éxito", "La orden ha sido despachada correctamente");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al despachar la orden");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!cancelationReason.trim()) {
      Alert.alert("Error", "Por favor, escribe un motivo de cancelación.");
      return;
    }

    setLoading(true);
    try {
      await sendRejectOrder(
        order.id,
        cancelationReason,
        profile.employee.restaurant.whatsapp_number,
        order.client_number
      );

      Alert.alert("Éxito", "La orden ha sido cancelada correctamente.");
    } catch (error) {
      console.error(
        "Error al cancelar la orden:",
        error instanceof Error ? error.message : error
      );
      Alert.alert("Error", "No se pudo cancelar la orden. Inténtalo de nuevo.");
      return;
    } finally {
      setLoading(false);
      setCancellationReason("");
    }
  };

  return {
    sendDelivery,
    loading,
    cancelOrder,
    setCancellationReason,
    cancelationReason,
    confirmOrder,
  };
};
