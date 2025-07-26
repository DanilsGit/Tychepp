import { useEffect, useRef, useState } from "react";
import { Order, ProfileEmployee } from "../../../types/rowTypes";
import { supabase } from "../../../lib/supabase";
import { Alert } from "react-native";
import { sendConfirmOrder } from "../api/messages";
import { useAuthStore } from "../../login/stores/authStore";

export const useOrderItem = (order: Order) => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const [time, setTime] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const late = useRef("on time");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const requiredAgo = new Date(order.created_at);
      const diff = Math.floor((now.getTime() - requiredAgo.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTime(`${minutes} min ${seconds} seg`);
      if (minutes > 5) {
        late.current = "late";
      } else if (minutes < 5 && minutes > 0) {
        late.current = "on time";
      } else {
        late.current = "early";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  return {
    time,
    visible,
    late: late.current,
    setVisible,
  };
};
