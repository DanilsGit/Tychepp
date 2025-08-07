import { FlatList, TouchableOpacity, View } from "react-native";
import { Product } from "../../../types/rowTypes";
import { Text } from "@rn-vui/base";
import ProductItem from "./ProductItem";
import { global_styles } from "../../../styles/global";
import { useState } from "react";

type Props = {
  item: {
    categoryName: string;
    data: Product[];
  };
};


export default function ProductsByCategoryOptimized({ item }: Props) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  return (
    <>
      {!expanded && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={global_styles.subTitleDivider}>
            {item.categoryName}
            {expanded ? " ▼" : " ▲"}
          </Text>
        </TouchableOpacity>
      )}
      {expanded && (
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={global_styles.subTitleDivider}>
              {item.categoryName}
              {expanded ? " ▼" : " ▲"}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={item.data}
            keyExtractor={(product) => product.id.toString()}
            renderItem={({ item: product }) => (
              <ProductItem product={product} />
            )}
            ListEmptyComponent={
              <View style={{ padding: 30, alignItems: "center" }}>
                <Text style={{ textAlign: "center" }}>
                  No hay productos en esta categoría
                </Text>
              </View>
            }
          />
        </View>
      )}
    </>
  );
}
