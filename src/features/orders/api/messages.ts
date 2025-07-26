import api from "../../../lib/api";
import { Message } from "../../../types/rowTypes";

export const sendMessageToWhatsapp = async (
  conversationId: number,
  message: string,
  restaurant_number: number,
  client_number: number
) =>
  api.post("/whatsapp-response", {
    conversationId,
    message,
    restaurant_number,
    client_number,
  });

export const getProductsFromChat = async (
  conversation: Message[],
  restaurantId: string,
  client_name: string
) =>
  api.post(`/generate-ai-order/`, {
    client_name,
    conversation,
    restaurantId,
  });

export const sendConfirmOrder = async (
  orderId: number,
  restaurant_number: number,
  client_number: number
) =>
  api.post(`/confirm_order/`, {
    orderId,
    restaurant_number,
    client_number,
  });

export const sendRejectOrder = async (
  orderId: number,
  reason: string,
  restaurant_number: number,
  client_number: number
) =>
  api.post(`/reject_order/`, {
    orderId,
    reason,
    restaurant_number,
    client_number,
  });
