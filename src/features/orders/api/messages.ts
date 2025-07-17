import api from "../../../lib/api";

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
