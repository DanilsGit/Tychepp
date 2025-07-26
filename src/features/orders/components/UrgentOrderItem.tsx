import { Alert, StyleSheet, View } from "react-native";
import { Conversations } from "../../../types/rowTypes";
import { Button, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../login/stores/authStore";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { useUrgentOrderStore } from "../storages/urgentOrdersStorage";

interface Props {
  conversation: Conversations;
}

export default function UrgentOrderItem({ conversation }: Props) {
  const { session } = useAuthStore();
  const { handleNewMessage } = useUrgentOrderStore();
  const [time, setTime] = useState<string>("");
  const late = useRef("on time");
  const router = useRouter();

  const handleAttend = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .update({ attended_by: session?.user.id })
      .eq("id", conversation.id)
      .is("attended_by", null)
      .select();

    if (error) {
      console.error("Error updating conversation:", error);
    }

    if (data?.length === 0) {
      Alert.alert(
        "Pedido atendido",
        "El pedido ya ha sido atendido por otro usuario."
      );
      return;
    }

    router.push({
      pathname: "/chatUrgentOrder/[id]",
      params: {
        id: String(conversation.id),
        recipientName: conversation.client_name,
      },
    });
  };

  const handleGoToChat = () => {
    handleNewMessage(conversation.id, false);
    router.push({
      pathname: "/chatUrgentOrder/[id]",
      params: {
        id: String(conversation.id),
        recipientName: conversation.client_name,
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const requiredAgo = new Date(conversation.updated_at);
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
  }, [conversation]);

  return (
    <View style={global_styles.card}>
      <View style={styles.container_texts}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>
              Nombre:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {conversation.client_name}
              </Text>
            </Text>
            {conversation.newMessage && <View style={styles.red_dot} />}
          </View>
          <Text>
            Whatsapp:{" "}
            <Text style={{ fontWeight: "bold" }}>{conversation.from}</Text>
          </Text>
        </View>
        {!conversation.attended_by && (
          <Text
            style={
              late.current === "late"
                ? styles.late
                : late.current === "on time"
                ? styles.onTime
                : styles.early
            }
          >
            {time}
          </Text>
        )}
      </View>

      {conversation.attended_by &&
        session?.user.id === conversation.attended_by && (
          <Button
            title="Volver al chat"
            color="primary"
            onPress={handleGoToChat}
          />
        )}

      {conversation.attended_by &&
        !(session?.user.id === conversation.attended_by) && (
          <Button title="Otra persona lo ha atendido" disabled />
        )}

      {!conversation.attended_by && (
        <Button title="Atender" onPress={handleAttend} color="success" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container_texts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  early: {
    color: colors.success,
  },
  onTime: {
    color: colors.warning,
  },
  late: {
    color: colors.danger,
  },
  red_dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginLeft: 8,
  },
});
