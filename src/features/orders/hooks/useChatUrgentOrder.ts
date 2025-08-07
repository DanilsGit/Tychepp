import { useEffect, useRef, useState } from "react";
import { Conversations, Message } from "../../../types/rowTypes";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { sendMessageToWhatsapp } from "../api/messages";

export const useChatUrgentOrder = (conversationId: number) => {
  const [conversation, setConversation] = useState<Conversations>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("Conectando...");
  const retryCountRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const [retries, setRetries] = useState(0);
  const retryDelay = 2000; // 2 seconds

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // UseEffect to handle listeners
  useEffect(() => {
    const conversations = supabase
      .channel("new_messages_order")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        async (payload: any) => {
          const incomingData = payload.new as Conversations;
          setConversation(incomingData);
          if (incomingData.messages) {
            setMessages(incomingData.messages as unknown as Message[]);
          }
        }
      )
      .subscribe(async (status: string) => {
        await statusController(status);
      });

    return () => {
      supabase.removeChannel(conversations);
      retryCountRef.current = 0; // Reset retry count on unmount
      setMessages([]); // Clear messages on unmount
      setStatus("Conectando..."); // Reset status on unmount
      flatListRef.current = null; // Clear scroll view reference
    };
  }, [conversationId]);

  const onBack = () => {
    router.back();
  };

  const getPreviousMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
      return;
    }

    const messagesData = data?.[0]?.messages || [];

    setMessages(messagesData);
    setConversation(data[0]);
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!conversation) return;
    setIsSending(true);

    try {
      console.log("Sending message to WhatsApp:", {
        conversationId,
        inputText,
        restaurant_number: conversation.to,
        client_number: conversation.from,
      });
      await sendMessageToWhatsapp(
        conversationId,
        inputText,
        conversation.to,
        conversation.from
      );
    } catch (error) {
      console.error("Error sending message:", error);
      return;
    } finally {
      setIsSending(false);
    }

    setInputText("");
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
    console.log("ChatUrgent status:", status);

    if (status === "SUBSCRIBED") {
      retryCountRef.current = 0;
      await getPreviousMessages();
      setIsLoading(false);
      setStatus("");
    }

    if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
      retryConnection();
    }

    if (status === "CLOSED") {
      setStatus("Reconectando... Si tarda reinicia la aplicación");
      setMessages([]);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    flatListRef,
    onBack,
    sendMessage,
    isLoading,
    isSending,
    status,
    conversation,
  };
};
