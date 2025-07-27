import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../login/stores/authStore";
import { Order, ProfileEmployee } from "../../../types/rowTypes";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useOrderStore } from "../storages/ordersStorage";

export const useOrders = () => {
  const { setStatus, setOrders, editOrder, addOrder } = useOrderStore();
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [isLoading, setIsLoading] = useState(true);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const retryDelay = 2000;

  useEffect(() => {
    if (!profile || !profile.employee) {
      return;
    }

    const subscribe = () => {
      const orders = supabase
        .channel("orders_channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "order",
            filter: `restaurant_id=eq.${profile.employee.restaurant.id}`,
          },
          (payload: any) => {
            const incomingData = payload.new as Order;
            console.log("New order received:", incomingData);
            addOrder(incomingData);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "order",
            filter: `restaurant_id=eq.${profile.employee.restaurant.id}`,
          },
          (payload: any) => {
            const updatedData = payload.new as Order;
            editOrder(updatedData);
          }
        )
        .subscribe(async (status: string) => {
          await statusController(status, subscribe);
        });
      return orders;
    };

    const orders = subscribe();

    return () => {
      supabase.removeChannel(orders);
      setOrders([]);
    };
  }, [profile]);

  const getOrders = async () => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const isoTimestamp = twelveHoursAgo.toISOString();
    const { data, error } = await supabase
      .from("order")
      .select("*")
      .eq("restaurant_id", profile.employee.restaurant_id)
      .gt("created_at", isoTimestamp)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }
    setOrders(data as Order[]);
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
    console.log("Orders status:", status);

    if (status === "SUBSCRIBED") {
      retryCountRef.current = 0;
      await getOrders();
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
      setOrders([]);
    }
  };

  return {
    isLoading,
  };
};
