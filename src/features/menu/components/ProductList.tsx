import { FlatList, View } from "react-native";
import { Text } from "@rneui/themed";
import MenuItem from "./MenuItem";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import ProductItem from "./ProductItem";

interface Props {
  products: Product[];
  saveProduct: (product: Product) => void;
  categories: CategoryForProduct[];
  deleteProduct: (product: Product) => void;
}
export default function ProductList({
  products,
  saveProduct,
  categories,
  deleteProduct,
}: Props) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductItem
          product={item}
          saveProduct={saveProduct}
          deleteProduct={deleteProduct}
          categories={categories}
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
    />
  );
}
