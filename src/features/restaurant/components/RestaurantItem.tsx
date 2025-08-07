import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Restaurant } from "../../../types/rowTypes";
import { Icon, Text } from "@rn-vui/base";
import { colors, global_styles } from "../../../styles/global";
import { useRouter } from "expo-router";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantItem({ restaurant }: Props) {
  const router = useRouter();
  const handleEditRestaurant = () => {
    router.push({
      pathname: "/editRestaurant/[id]",
      params: {
        id: String(restaurant.id),
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, global_styles.card]}
      onPress={handleEditRestaurant}
      activeOpacity={0.8}
    >
      <View style={styles.container2}>
        <View>
          <Text style={global_styles.itemTitle}>{restaurant.name}</Text>
          <Text>Whatsapp: +{restaurant.whatsapp_number}</Text>
          {!restaurant.ready && (
            <Text style={styles.notReady}>NO COMPLETADO</Text>
          )}
          {!restaurant.state && (
            <Text style={styles.notReady}>NO VERIFICADO</Text>
          )}
        </View>
        <Icon name="pencil" type="font-awesome" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    paddingVertical: 10,
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  notReady: {
    color: colors.danger,
    fontWeight: "bold",
  },
  ready: {
    color: colors.success,
    fontWeight: "bold",
  },
});
