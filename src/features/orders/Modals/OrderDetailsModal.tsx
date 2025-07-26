import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import { Order } from "../../../types/rowTypes";
import { useOrderDetails } from "../hooks/useOrderDetails";
import LoaderSpinner from "../../../components/LoaderSpinner";
import { useOrderStatus } from "../hooks/useOrderStatus";

interface Props {
  onCancel: () => void;
  visible: boolean;
  order: Order;
}

export default function OrderDetailsModal({ onCancel, visible, order }: Props) {
  const { isLoading, orderProducts } = useOrderDetails(order.id);
  const { loading, confirmOrder } = useOrderStatus(order);

  const onOk = async () => {
    await confirmOrder();
    onCancel();
  };

  if (isLoading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <LoaderSpinner />
      </Modal>
    );
  }

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

            <Text style={{ fontWeight: "bold" }}>#00{order.id}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_name}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.client_number}</Text>
            <Text style={{ fontWeight: "bold" }}>{order.address}</Text>
          </View>

          <View style={styles.itemsContainer}>
            <FlatList
              data={orderProducts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={global_styles.card}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  {item.comments && <Text>Observaciones: {item.comments}</Text>}
                  <Text style={styles.priceText}>
                    $
                    {item.price_sold.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay productos</Text>
              }
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={true}
            />
            <Text style={{ fontWeight: "bold", marginTop: 10, fontSize: 16 }}>
              Total: $
              {order.total_price.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {order.status === "PENDING" && (
              <Button
                color="success"
                onPress={onOk}
                loading={loading}
                disabled={loading}
              >
                CONFIRMAR ORDEN
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
