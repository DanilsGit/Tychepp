import { FlatList, View } from "react-native";
import { Text } from "@rneui/themed";
import { useGetMenu } from "../hooks/useGetMenu";
import MenuItem from "./MenuItem";

export default function MenuList() {
  const { isLoading, menus } = useGetMenu();

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={menus}
      renderItem={({ item }) => <MenuItem menu={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <View style={{ padding: 30, alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>Aún no has agregado menús</Text>
        </View>
      }
      scrollEnabled={false}
    />
  );
}
