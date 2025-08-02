import { useEffect, useRef, useState } from "react";
import {
  Conversations,
  Message,
  ProfileEmployee,
} from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";
import { supabase } from "../../../lib/supabase";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";
import { Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

export const useUrgentOrders = () => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [isLoading, setIsLoading] = useState(true);
  const [retries, setRetries] = useState(0);

  const {
    setUrgentOrders,
    setStatus,
    addUrgentOrder,
    handleAttendedBy,
    handleNewMessage,
  } = useUrgentOrderStore();

  const retryDelay = 2000;
  const router = useRouter();

  const lastMessageByClient = (msgs: Message[]) => {
    if (!Array.isArray(msgs) || msgs.length === 0) return false;

    const lastMessage = msgs[msgs.length - 1];
    return lastMessage.content?.includes("[TRABAJADOR]") ? false : true;
  };

  useEffect(() => {
    if (!profile || !profile.employee) {
      return;
    }

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

          if (
            incomingData.attended_by === profile.id &&
            lastMessageByClient(incomingData.messages as unknown as Message[])
          ) {
            handleNewMessage(incomingData.id, true);
          }

          if (incomingData.attended_by) {
            handleAttendedBy(incomingData.id, incomingData.attended_by);
            return;
          }

          if (incomingData.request_human && !incomingData.attended_by) {
            addUrgentOrder(incomingData);

            if (Platform.OS === "web") {
              const confirmed = window.confirm(
                "Nuevo chat urgente. ¿Deseas ir a los chats?"
              );
              if (confirmed) {
                router.push("/atencion");
              }
            } else {
              Alert.alert(
                "Nuevo chat urgente",
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
        }
      )
      .subscribe(async (status: string) => {
        await statusController(status);
      });

    return () => {
      supabase.removeChannel(conversations);
      setUrgentOrders([]);
    };
  }, [profile, retries]);

  const getUrgentOrders = async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const isoTimestamp = sixHoursAgo.toISOString();

    const { data, error } = await supabase
      .from("conversations")
      .select("*, restaurant!inner()")
      .eq("restaurant.id", profile.employee.restaurant_id)
      .eq("request_human", true)
      .gte("updated_at", isoTimestamp)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching urgent orders:", error);
      return;
    }
    setUrgentOrders(data || []);
  };

  const retryConnection = async () => {
    setRetries((prev) => prev + 1);
    setStatus(
      `Reintentando (${retries} veces) Si tarda reinicia la aplicación`
    );
    setTimeout(() => {
      setRetries((prev) => prev + 1);
    }, retryDelay);
  };

  const statusController = async (status: string) => {
    console.log("UrgentOrders status:", status);

    if (status === "SUBSCRIBED") {
      await getUrgentOrders();
      setIsLoading(false);
      setStatus("");
    }

    if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
      retryConnection();
    }

    if (status === "CLOSED") {
      setStatus("Reconectando... Si tarda reinicia la aplicación");
    }
  };

  return {
    isLoading,
  };
};
