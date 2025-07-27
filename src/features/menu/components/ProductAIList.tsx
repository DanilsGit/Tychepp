import { FlatList, View } from "react-native";
import { Text } from "@rn-vui/base";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import ProductAIItem from "./ProductAIItem";

interface Props {
  products: Product[];
  saveAIProducts: (product: Product) => Promise<void>;
  deleteAIProduct: (product: Product) => void;
}
export default function ProductAIList({
  products,
  saveAIProducts,
  deleteAIProduct,
}: Props) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductAIItem
          product={item}
          saveAIProducts={saveAIProducts}
          deleteAIProduct={deleteAIProduct}
        />
      )}
      keyExtractor={(item) => JSON.stringify(item)}
      ListEmptyComponent={
        <View style={{ padding: 30, alignItems: "center" }}>
          <Text style={{ textAlign: "center" }}>
            Aún no has agregado productos
          </Text>
        </View>
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={true}
    />
  );
}
