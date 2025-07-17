import { Icon, Text } from "@rn-vui/themed";
import { MenuWithRestaurantName } from "../../../types/rowTypes";
import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { global_styles } from "../../../styles/global";

interface Props {
  menu: MenuWithRestaurantName;
}
export default function MenuItem({ menu }: Props) {
  return (
    <Link href={`/menus/${menu.id}`} style={[global_styles.card, styles.container]}>
      <View style={styles.container2}>
        <View>
          <Text style={global_styles.itemTitle}>{menu.name}</Text>
          <Text>
            Aosiado a:{" "}
            <Text style={styles.asociated}>{menu.restaurant.name}</Text>
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
  asociated: {
    fontWeight: "bold",
  },
});
