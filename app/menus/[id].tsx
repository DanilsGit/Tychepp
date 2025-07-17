import { StyleSheet, View } from "react-native";
import Screen from "../../src/components/Screen";
import { global_styles } from "../../src/styles/global";
import { useLocalSearchParams } from "expo-router";
import { Button, Icon, Image, Text } from "@rn-vui/themed";
import { useState } from "react";
import { CustomAlert } from "../../src/components/CustomAlert";
import { useAIProducts } from "../../src/features/menu/hooks/useAIProducts";
import { useMenuProducts } from "../../src/features/menu/hooks/useMenuProducts";
import ProductList from "../../src/features/menu/components/ProductList";
import { useGetCategories } from "../../src/features/menu/hooks/useGetCategories";

export default function AddProduct() {
  const { id } = useLocalSearchParams();
  const { categories } = useGetCategories();
  const [alertVisible, setAlertVisible] = useState(false);
  const { products, saveProduct, addProduct, deleteProduct } = useMenuProducts(
    id.toString()
  );

  const {
    pickImage,
    images,
    loading: loadingAI,
    status,
    productsGenerated,
    saveAIProducts,
    deleteAIProduct,
  } = useAIProducts({
    menu_id: id.toString(),
    saveProduct,
    categories,
  });

  const showAlert = () => {
    setAlertVisible(true);
  };

  const handleOk = () => {
    setAlertVisible(false);
    pickImage();
  };

  const handleCancel = () => {
    setAlertVisible(false);
  };

  if (loadingAI) {
    return (
      <Screen style={styles.container}>
        <Text style={global_styles.title}>{status}</Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Productos del menú</Text>

      <Button onPress={showAlert}>
        <Icon type="font-awesome" name="camera" /> Utiliza la IA sin
        complicaciones
      </Button>

      <CustomAlert
        visible={alertVisible}
        imageSource={"wrong_menu"}
        title="Selecciona una buena foto"
        message="Sube el menú legible, sin reflejos y sin objetos que lo tapen."
        warningMessage="Evita esto"
        onOk={handleOk}
        onCancel={handleCancel}
      />

      {images && images.length > 0 && (
        <View style={{ gap: 20 }}>
          <Text style={global_styles.subTitle}>Imágenes seleccionadas</Text>
          <View style={styles.images_container}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width: 170, height: 170, marginTop: 20 }}
              />
            ))}
          </View>
          <Text style={global_styles.subTitle}>Productos generados</Text>
          <Text>
            La IA puede cometer errores, por favor revisa los productos antes de
            guardarlos con el botón azul de cada producto.
          </Text>
          <ProductList
            saveProduct={saveAIProducts}
            products={productsGenerated}
            categories={categories}
            deleteProduct={deleteAIProduct}
          />
        </View>
      )}

      <View>
        <Text style={global_styles.subTitle}>Productos actuales</Text>
        <Text>
          Puedes editar los productos actuales, o agregar nuevos productos
        </Text>
        <ProductList
          saveProduct={saveProduct}
          products={products}
          categories={categories}
          deleteProduct={deleteProduct}
        />
        <Button
          onPress={addProduct}
          icon={<Icon type="font-awesome" name="plus" />}
          title="Agregar nuevo producto"
        />
      </View>
      <View style={{ marginBottom: 500 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "space-between",
    gap: 10,
  },
  images_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
});
