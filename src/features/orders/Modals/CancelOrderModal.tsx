import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import { Order } from "../../../types/rowTypes";
import { useOrderStatus } from "../hooks/useOrderStatus";

interface Props {
  onExit: () => void;
  visible: boolean;
  order: Order;
}

export default function CancelOrderModal({ onExit, visible, order }: Props) {
  const { loading, cancelOrder, setCancellationReason, cancelationReason } =
    useOrderStatus(order);

  const handleCancelOrder = async () => {
    await cancelOrder();
    onExit();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onExit}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onExit} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={global_styles.title}>Cancelar la orden</Text>
          </View>

          <View style={{ gap: 5, width: "100%" }}>
            <Text style={{ fontWeight: "bold" }}>#00{order.id}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_name}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_number}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.address}</Text>
          </View>

          <View style={{ gap: 5, width: "100%" }}>
            <Text style={global_styles.subTitle}>
              Motivo de la cancelación:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe un motivo"
              value={cancelationReason}
              onChangeText={setCancellationReason}
              placeholderTextColor={colors.gray}
            />
          </View>

          <View style={styles.buttonContainer}>
            {order.status === "PENDING" && (
              <Button
                color="error"
                onPress={handleCancelOrder}
                loading={loading}
                disabled={loading}
              >
                CANCELAR LA ORDEN
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    padding: 10,
    gap: 10,
  },
  backButton: {
    paddingHorizontal: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  itemsContainer: {
    width: "100%",
    marginTop: 10,
    height: "65%",
    borderBottomColor: colors.warning,
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderTopColor: colors.warning,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 10,
    width: "100%",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
