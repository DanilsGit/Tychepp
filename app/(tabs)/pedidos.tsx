import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import Screen from "../../src/components/Screen";
import { Text } from "@rn-vui/base";
import { global_styles } from "../../src/styles/global";
import { useOrderStore } from "../../src/features/orders/storages/ordersStorage";
import OrdersList from "../../src/features/orders/components/OrderList";
import { useRef, useState } from "react";

export default function Pedidos() {
  const { orders, status } = useOrderStore();

  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      0,
      orders.filter((order) => order.status === "DELIVERED").length * 150,
    ],
  });

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Pedidos</Text>
      <Text style={global_styles.subTitle}>
        Aquí puedes ver todos los pedidos realizados en las últimas 6 horas. Los
        pedidos se actualizan en tiempo real.
      </Text>

      <Text style={styles.status}>{status}</Text>

      <View>
        <Text style={global_styles.cancelled_title}>Pedidos Cancelados</Text>
        <OrdersList
          orders={orders.filter((order) => order.status === "CANCELLED")}
        />
      </View>
      <View>
        <Text style={global_styles.pending_title}>Pedidos Pendientes</Text>
        <OrdersList
          orders={orders.filter((order) => order.status === "PENDING")}
        />
      </View>
      <View>
        <Text style={global_styles.confirmed_title}>Pedidos Confirmados</Text>
        <OrdersList
          orders={orders.filter((order) => order.status === "CONFIRMED")}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={toggleExpand}
          style={global_styles.row_between}
        >
          <Text style={global_styles.delivered_title}>Pedidos Despachados</Text>
          <Text>{expanded ? "▼" : "▲"}</Text>
        </TouchableOpacity>

        <Animated.View
          style={{ height: heightInterpolate, overflow: "hidden" }}
        >
          <OrdersList
            orders={orders.filter((order) => order.status === "DELIVERED")}
          />
        </Animated.View>
      </View>
      <View>
        <Text style={global_styles.waiting_title}>Pedidos En Espera de Respuesta</Text>
        <OrdersList
          orders={orders.filter((order) => order.status === "WAITING_RESPONSE")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  status: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
