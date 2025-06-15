import { StyleSheet, View } from "react-native";
import { Restaurant } from "../../../types/rowTypes";
import { Icon, Text } from "@rneui/themed";
import { global_styles } from "../../../styles/global";
import { Link } from "expo-router";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantItem({ restaurant }: Props) {
  return (
    <Link href={`/(tabs-manager)/dashboard`} style={styles.container}>
      <View style={styles.container2}>
        <View>
          <Text style={global_styles.itemTitle}>{restaurant.name}</Text>
          <Text>Whatsapp: +{restaurant.whatsapp_number}</Text>
          <Text style={restaurant.ready ? {} : styles.notReady}>
            Desabilitado
          </Text>
        </View>
        <Icon name="pencil" type="font-awesome" />
      </View>
    </Link>
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
    color: "red",
    fontWeight: "bold",
  },
});
