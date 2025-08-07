import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import { Order } from "../../../types/rowTypes";
import { useOrderDetails } from "../hooks/useOrderDetails";
import LoaderSpinner from "../../../components/LoaderSpinner";
import { useOrderStatus } from "../hooks/useOrderStatus";
import { OrderDetailsListMobile } from "../components/OrderDetailsListMobile";
import { OrderDetailsListWeb } from "../components/OrderDetailsListWeb";

interface Props {
  onCancel: () => void;
  visible: boolean;
  order: Order;
}

export default function OrderDetailsModal({ onCancel, visible, order }: Props) {
  const { isLoading, orderProducts } = useOrderDetails(order.id);
  const { height } = useWindowDimensions();

  if (isLoading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <LoaderSpinner />
      </Modal>
    );
  }

  const handleTotalPrice = () => {
    if (order.delivery_price) {
      return order.total_price + order.delivery_price;
    }
    return order.total_price;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={global_styles.title}>Detalles de la Orden</Text>
          </View>

          <View style={{ gap: 5, width: "100%" }}>
            {order.status === "CANCELLED" && (
              <Text style={global_styles.cancelled_title}>
                Esta orden ha sido cancelada
              </Text>
            )}
            {order.status === "PENDING" && (
              <Text style={global_styles.pending_title}>
                Esta orden está pendiente
              </Text>
            )}
            {order.status === "CONFIRMED" && (
              <Text style={global_styles.confirmed_title}>
                Esta orden ha sido confirmada
              </Text>
            )}
            {order.status === "DELIVERED" && (
              <Text style={global_styles.delivered_title}>
                Esta orden ha sido despachada
              </Text>
            )}
            {order.status === "WAITING_RESPONSE" && (
              <Text style={global_styles.waiting_title}>
                Esta orden está en espera de respuesta
              </Text>
            )}

            <Text style={{ fontWeight: "bold" }}>#00{order.id}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_name}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_number}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.address}</Text>
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 10,
              height: height - 300,
            }}
          >
            <View style={{ flex: 1, height: "100%" }}>
              {Platform.OS === "web" ? (
                <OrderDetailsListWeb orderProducts={orderProducts} />
              ) : (
                <OrderDetailsListMobile orderProducts={orderProducts} />
              )}
            </View>

            {order.delivery_price === 0 && (
              <Text style={styles.totalPriceText}>
                Total: $
                {order.total_price.toLocaleString("es-CO", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            )}

            {order.delivery_price > 0 && (
              <>
                <Text style={styles.totalPriceText}>
                  SubTotal: $
                  {order.total_price.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <Text style={styles.totalPriceText}>
                  Domicilio: $
                  {order.delivery_price.toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
                <Text style={styles.totalPriceText}>
                  Total: $
                  {handleTotalPrice().toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </>
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
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 10,
    width: "100%",
  },
});
