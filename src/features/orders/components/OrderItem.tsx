import { StyleSheet, View } from "react-native";
import { Order } from "../../../types/rowTypes";
import { Button, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import OrderDetailsModal from "../Modals/OrderDetailsModal";
import { useOrderItem } from "../hooks/useOrderItem";
import { useState } from "react";
import CancelOrderModal from "../Modals/CancelOrderModal";
import { useOrderStatus } from "../hooks/useOrderStatus";
import AcceptOrderModal from "../Modals/ConfirmOrderModal";

interface Props {
  order: Order;
}

export default function OrderItem({ order }: Props) {
  const { late, time, visible, setVisible } = useOrderItem(order);
  const [visibleCancel, setVisibleCancel] = useState(false);
  const [visibleAccept, setVisibleAccept] = useState(false);
  const { loading, sendDelivery } = useOrderStatus(order);

  return (
    <View style={global_styles.card}>
      <View style={styles.container_texts}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>
              Nombre:{" "}
              <Text style={{ fontWeight: "bold" }}>
                {order.client_name || "No proporcionado"}
              </Text>
            </Text>
          </View>
          <Text>
            Whatsapp:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {order.client_number || "No proporcionado"}
            </Text>
          </Text>
          <Text style={{ fontWeight: "bold" }}>{order.address}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontWeight: "bold" }}>#00{order.id}</Text>
          {order.status === "PENDING" && (
            <Text
              style={
                late === "late"
                  ? styles.late
                  : late === "on time"
                  ? styles.onTime
                  : styles.early
              }
            >
              {time}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {order.status === "PENDING" && (
          <>
            <Button
              title="Cancelar"
              color="error"
              onPress={() => setVisibleCancel(true)}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Aceptar"
              color="success"
              onPress={() => setVisibleAccept(true)}
              loading={loading}
              disabled={loading}
            />
          </>
        )}
        <Button
          title="Ver detalles"
          color="primary"
          onPress={() => setVisible(true)}
        />
        {order.status === "CONFIRMED" && (
          <Button color="secondary" onPress={sendDelivery}>
            DESPACHAR ORDEN
          </Button>
        )}
      </View>

      {visible && (
        <OrderDetailsModal
          visible={visible}
          onCancel={() => setVisible(false)}
          order={order}
        />
      )}
      {visibleCancel && (
        <CancelOrderModal
          visible={visibleCancel}
          onExit={() => setVisibleCancel(false)}
          order={order}
        />
      )}
      {visibleAccept && (
        <AcceptOrderModal
          visible={visibleAccept}
          onExit={() => setVisibleAccept(false)}
          order={order}
        />
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
  buttonsContainer: {
    width: "100%",
    gap: 8,
  },
});
