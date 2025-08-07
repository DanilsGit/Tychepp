import { FlatList, View } from "react-native";
import { Button, Text } from "@rn-vui/base";
import { useGetMenu } from "../hooks/useGetMenu";
import MenuItem from "./MenuItem";

export default function MenuList() {
  const { isLoading, menus, refetch } = useGetMenu();

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ gap: 10 }}>
      <Button title={"Refrescar Cambios"} onPress={refetch} color={"secondary"} />

      <FlatList
        data={menus}
        renderItem={({ item }) => <MenuItem menu={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center" }}>Aún no has agregado menús</Text>
        }
        scrollEnabled={false}
      />
    </View>
  );
}
