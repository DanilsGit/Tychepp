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
  const [retries, setRetries] = useState(0);
  const retryCountRef = useRef(0);
  const maxRetries = 10;
  const retryDelay = 2000;

  useEffect(() => {
    if (!profile || !profile.employee) {
      return;
    }

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
        await statusController(status);
      });

    return () => {
      supabase.removeChannel(orders);
      setOrders([]);
    };
  }, [profile, retries]);

  const getOrders = async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const isoTimestamp = sixHoursAgo.toISOString();

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
    console.log("Orders status:", status);

    if (status === "SUBSCRIBED") {
      retryCountRef.current = 0;
      await getOrders();
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
