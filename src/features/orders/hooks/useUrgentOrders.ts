import { useEffect, useRef } from "react";
import { Conversations, ProfileEmployee } from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";
import { supabase } from "../../../lib/supabase";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export const useUrgentOrders = () => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const {
    isLoading,
    setUrgentOrders,
    setStatus,
    addUrgentOrder,
    handleAttendedBy,
  } = useUrgentOrderStore();
  const retryCountRef = useRef(0);
  const router = useRouter();
  const maxRetries = 5;
  const retryDelay = 2000;

  useEffect(() => {
    if (!profile || !profile.employee) {
      return;
    }

    const subscribe = () => {
      const conversations = supabase
        .channel("conversations_update")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
            filter: `to=eq.${profile.employee.restaurant.whatsapp_number}`,
          },
          async (payload: any) => {
            const incomingData = payload.new as Conversations;

            if (incomingData.attended_by) {
              handleAttendedBy(incomingData.id, incomingData.attended_by);
              return;
            }

            if (incomingData.request_human && !incomingData.attended_by) {
              addUrgentOrder(incomingData);

              Alert.alert(
                "Nuevo chat",
                "Tienes un nuevo chat que necesita atención.",
                [
                  {
                    text: "Ir a los chats",
                    onPress: () => {
                      router.push("/atencion");
                    },
                  },
                  {
                    text: "Ignorar",
                    style: "cancel",
                  },
                ]
              );
            }
          }
        )
        .subscribe((status: string) => {
          console.log("Subscription status:", status);

          if (status === "SUBSCRIBED") {
            retryCountRef.current = 0;
            getUrgentOrders();
            setStatus("");
          }

          if (status === "TIMED_OUT") {
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current += 1;
              setStatus(
                `Reconectanto... (${retryCountRef.current}/${maxRetries})`
              );
              setTimeout(() => {
                subscribe();
              }, retryDelay);
            } else {
              console.error("Máximo de reintentos alcanzado");
            }
          }

          if (status === "CLOSED") {
            setStatus(
              "Conexión cerrada, comprueba tu conexión a internet y reinicia la aplicación."
            );
            setUrgentOrders([]);
          }
        });
      return conversations;
    };

    const conversations = subscribe();

    return () => {
      supabase.removeChannel(conversations);
      setUrgentOrders([]);
    };
  }, [profile]);

  const getUrgentOrders = async () => {
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("conversations")
      .select("*, restaurant!inner()")
      .eq("restaurant.id", profile.employee.restaurant_id)
      .eq("request_human", true)
      .gte("updated_at", sixHoursAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching urgent orders:", error);
      return;
    }

    setUrgentOrders(data || []);
  };

  return { isLoading };
};
