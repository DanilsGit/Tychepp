import { FlatList, View } from "react-native";
import { Text} from "@rn-vui/base";
import { useGetMyEmployees } from "../hooks/useGetMyEmployees";
import EmployeeItem from "./EmployeeItem";

interface Props {
  restaurantId: string;
}

export default function EmployeeList({ restaurantId }: Props) {
  const { isLoading, employees } = useGetMyEmployees(restaurantId);

  if (isLoading) {
    return null;
  }

  return (
    <FlatList
      data={employees}
      renderItem={({ item }) => <EmployeeItem employee={item} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={{ padding: 30, alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>Aún no se han vinculado empleados aquí</Text>
        </View>
      }
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}
