import { Alert } from "react-native";
import {
  Conversations,
  Message,
  ProfileEmployee,
} from "../../../types/rowTypes";
import { useAuthStore } from "../../login/stores/authStore";
import { getProductsFromChat, sendMessageToWhatsapp } from "../api/messages";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";

import { useGetAllMenusProducts } from "../../menu/hooks/useGetAllMenusProducts";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";
import { PlatformAlert } from "../../../components/PlatformAlert";

export interface ProductFromChat {
  id: number | undefined | null;
  price: number;
  comments: string;
  uuid: string;
}

export const useOrderFromChat = (
  conversation: Conversations | undefined | null,
  messages: Message[]
) => {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const { removeUrgentOrder } = useUrgentOrderStore();
  const [orderItems, setOrderItems] = useState<ProductFromChat[]>([]);
  const [isGeneratingItems, setIsGeneratingItems] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [called, setCalled] = useState(false);
  const [visible, setVisible] = useState(false);
  const { products: productsAvailable } = useGetAllMenusProducts();
  const [information, setInformation] = useState({
    address: "",
    client_name: "",
  });

  const createOrderFromChat = async () => {
    if (called) {
      setVisible(true);
      return;
    }

    if (!conversation) {
      PlatformAlert(
        "Error",
        "No hay conversación disponible para crear la orden."
      );
      return;
    }

    const firstWorkerMessage = messages.findIndex((message) =>
      message.content.includes("[TRABAJADOR]")
    );

    if (firstWorkerMessage === -1) {
      PlatformAlert("Escribe al menos un mensaje para crear la orden");
      return;
    }

    const messagesAfterWorker = messages.slice(firstWorkerMessage);

    try {
      setIsGeneratingItems(true);
      const res = await getProductsFromChat(
        messagesAfterWorker,
        profile.employee.restaurant_id,
        conversation.client_name
      );
      const data = JSON.parse(res.data);

      let counter = 0;
      const orderItems: ProductFromChat[] = data.products.map(
        (product: ProductFromChat) => ({
          ...product,
          uuid: `${Date.now()}-${counter++}`,
        })
      );

      setOrderItems(orderItems);
      setInformation({
        address: data.address,
        client_name: data.name,
      });
      setVisible(true);
      setCalled(true);
    } catch (error) {
      console.error("Error getting products from chat:", error);
      setVisible(true);
      setCalled(false);
      return;
    } finally {
      setIsGeneratingItems(false);
    }
  };

  const onAddItem = () => {
    setOrderItems((prevItems) => [
      ...prevItems,
      { id: null, price: 0, comments: "", uuid: `${Date.now()}` },
    ]);
  };

  const handleEditField = (id: number, field: string, value: any) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditFieldAtIndex = (
    index: number,
    updatedItem: ProductFromChat
  ) => {
    setOrderItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  const handleEditInformation = (field: string, value: string) => {
    setInformation((prev) => ({ ...prev, [field]: value }));
  };

  const onOk = async () => {
    if (!conversation) {
      return;
    }

    if (orderItems.length === 0) {
      PlatformAlert("No hay productos en la orden");
      return;
    }

    const nullItems = orderItems.filter((item) => item.id === null);
    if (nullItems.length > 0) {
      PlatformAlert(
        "Faltan productos",
        "Por favor, asegúrate de que todos los productos tengan un precio asignado."
      );
      return;
    }

    // Insertar la orden en la tabla 'orders'
    try {
      setIsCreatingOrder(true);

      const total_price = orderItems.reduce(
        (total, product) => total + product.price,
        0
      );
      const { data: orderData, error: orderError } = await supabase
        .from("order")
        .insert({
          address: information.address,
          total_price,
          restaurant_id: profile.employee.restaurant_id,
          conversation: messages,
          client_number: conversation.from,
          status: "CONFIRMED",
          client_name: information.client_name || null,
        })
        .select("id, created_at")
        .single();

      if (orderError) throw new Error(orderError.message);
      if (!orderData) throw new Error("Order creation failed");
      const orderId = orderData.id;

      // Insertar los productos de la orden en la tabla 'orders_products'
      const orderProducts = orderItems.map((product) => ({
        order_id: orderId,
        product_id: product.id,
        price_sold: product.price,
        comments: product.comments || "",
      }));
      const { error: orderProductsError } = await supabase
        .from("orders_products")
        .insert(orderProducts);

      if (orderProductsError) throw new Error(orderProductsError.message);

      // Actualizar la conversación para marcarla como atendida
      const { error: updateConversationError } = await supabase
        .from("conversations")
        .update({
          attended_by: null,
          request_human: false,
        })
        .eq("id", conversation.id);
      if (updateConversationError) {
        throw new Error(updateConversationError.message);
      }

      // Eliminar la orden urgente si existe
      removeUrgentOrder(conversation.id);

      await sendMessageToWhatsapp(
        conversation.id,
        `La orden #00${orderId} ha sido creada y confirmada. Muchas gracias por tu pedido.`,
        conversation.to,
        conversation.from
      );

      PlatformAlert("Éxito", "La orden ha sido creada y confirmada.");

      setOrderItems([]);
      setVisible(false);
      setCalled(false);
    } catch (error) {
      console.error("Error creating order:", error);
      PlatformAlert(
        "Error al crear la orden",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const handleDeleteItem = (uuid: string) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.uuid !== uuid)
    );
  };

  return {
    createOrderFromChat,
    isGeneratingItems,
    orderItems,
    onAddItem,
    onOk,
    onCancel,
    handleEditFieldAtIndex,
    handleEditField,
    productsAvailable,
    visible,
    information,
    handleEditInformation,
    handleDeleteItem,
    isCreatingOrder,
  };
};
