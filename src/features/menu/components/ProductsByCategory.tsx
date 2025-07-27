import { FlatList, View } from "react-native";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { Text } from "@rn-vui/base";
import ProductItem from "./ProductItem";
import { global_styles } from "../../../styles/global";
import ProductsByCategoryOptimized from "./ProductsByCategoryOptimized";

type Props = {
  products: Product[];
  categories: CategoryForProduct[];
};

export default function ProductByCategoryList({ products, categories }: Props) {
  // Agrupar productos por categoría
  const productsByCategory = categories
    .map((category) => ({
      categoryName: category.name,
      data: products.filter((product) => product.category_id === category.id),
    }))
    .filter((group) => group.data.length > 0); // Filtrar categorías vacías

  // También podrías añadir los productos sin categoría (category_id === null || category_id === undefined)
  const uncategorized = products.filter((p) => !p.category_id);

  if (uncategorized.length > 0) {
    productsByCategory.push({
      categoryName: "Sin categoría",
      data: uncategorized,
    });
  }

  return (
    <FlatList
      data={productsByCategory}
      keyExtractor={(item) => item.categoryName}
      renderItem={({ item }) => <ProductsByCategoryOptimized item={item} />}
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
