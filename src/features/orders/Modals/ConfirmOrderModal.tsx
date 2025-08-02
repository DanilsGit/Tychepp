import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
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

export default function AcceptOrderModal({ onExit, visible, order }: Props) {
  const { loading, confirmOrder, deliveryPrice, setDeliveryPrice } =
    useOrderStatus(order);

  const handleAcceptOrder = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `¿Confirmar la orden #00${order.id} con un domicilio de ${deliveryPrice} pesos?`
      );
      if (confirmed) {
        await confirmOrder();
        onExit();
      }
    } else {
      Alert.alert(
        "¿Todo listo?",
        `¿Confirmar la orden #00${order.id} con un domicilio de ${deliveryPrice} pesos?`,
        [
          {
            text: "No aún no",
            style: "destructive",
          },
          {
            text: "Claro que sí",
            style: "default",
            onPress: async () => {
              await confirmOrder();
              onExit();
            },
          },
        ]
      );
    }
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
            <Text style={global_styles.title}>Aceptar la orden</Text>
          </View>

          <View style={{ gap: 5, width: "100%" }}>
            <Text style={{ fontWeight: "bold" }}>#00{order.id}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_name}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_number}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.address}</Text>
          </View>

          <View style={{ gap: 5, width: "100%" }}>
            <Text style={global_styles.subTitle}>Costo del domicilio: </Text>
            <Text>Digite 0 para domicilio gratis o recoger en restaurante</Text>
            <TextInput
              style={styles.input}
              placeholder="Valor del domicilio"
              value={deliveryPrice.toString()}
              onChangeText={(text) => {
                setDeliveryPrice(Number(text));
              }}
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            {order.status === "PENDING" && (
              <Button
                color="success"
                onPress={handleAcceptOrder}
                loading={loading}
                disabled={loading}
              >
                ACEPTAR LA ORDEN
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
