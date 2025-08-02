import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Alert } from "react-native";
import { OrderProductsProduct } from "../../../types/rowTypes";
import { PlatformAlert } from "../../../components/PlatformAlert";

export const useOrderDetails = (orderId: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderProducts, setOrderProducts] = useState<OrderProductsProduct[]>(
    []
  );

  useEffect(() => {
    if (!orderId) {
      return;
    }
    getOrderDetails();
  }, [orderId]);

  const getOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders_products")
      .select("*, product(*, category_for_product(*))")
      .eq("order_id", orderId);

    if (error) {
      PlatformAlert(
        "Error",
        "No se pudieron cargar los detalles de la orden. Por favor, inténtalo de nuevo más tarde."
      );
      console.error("Error fetching order details:", error);
      setIsLoading(false);
    }
    if (data) {
      setOrderProducts(data);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    orderProducts,
  };
};
