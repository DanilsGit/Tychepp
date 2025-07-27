import { useEffect, useRef, useState } from "react";
import {
  Conversations,
  Message,
  ProfileEmployee,
} from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";
import { supabase } from "../../../lib/supabase";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useUrgentOrders = () => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [isLoading, setIsLoading] = useState(true);
  const {
    setUrgentOrders,
    setStatus,
    addUrgentOrder,
    handleAttendedBy,
    handleNewMessage,
  } = useUrgentOrderStore();

  const retryCountRef = useRef(0);
  const router = useRouter();
  const maxRetries = 5;
  const retryDelay = 2000;

  const lastMessageByClient = (msgs: Message[]) => {
    if (!Array.isArray(msgs) || msgs.length === 0) return false;

    const lastMessage = msgs[msgs.length - 1];
    return lastMessage.content?.includes("[TRABAJADOR]") ? false : true;
  };

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
        .subscribe(async (status: string) => {
          await statusController(status, subscribe);
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
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const isoTimestamp = twelveHoursAgo.toISOString();

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

  const retryConnection = async (subscribe: () => RealtimeChannel) => {
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      setStatus(`Te has desconectado, reinicia la aplicación`);
      setTimeout(() => {
        subscribe();
      }, retryDelay);
    }
  };

  const statusController = async (
    status: string,
    subscribe: () => RealtimeChannel
  ) => {
    console.log("UrgentOrders status:", status);

    if (status === "SUBSCRIBED") {
      retryCountRef.current = 0;
      await getUrgentOrders();
      setIsLoading(false);
      setStatus("");
    }

    if (status === "TIMED_OUT") {
      await retryConnection(subscribe);
    }

    if (status === "CHANNEL_ERROR") {
      await retryConnection(subscribe);
    }

    if (status === "CLOSED") {
      setStatus(
        "Conexión cerrada, comprueba tu conexión a internet y reinicia la aplicación."
      );
      setUrgentOrders([]);
    }
  };

  return { isLoading };
};
