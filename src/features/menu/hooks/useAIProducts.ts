import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { generateProductsByAI } from "../apis/menu";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { Alert } from "react-native";

interface Props {
  menu_id: string;
  saveProduct: (product: Product) => Promise<void>;
  categories: CategoryForProduct[];
}
export const useAIProducts = ({ menu_id, saveProduct, categories }: Props) => {
  const [images, setImages] = useState<string[] | null>(null);
  const [productsGenerated, setProductsGenerated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const manipulateImage = async (uris: string[]) => {
    try {
      const images = [];
      for (const uri of uris) {
        const result = await ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: 800,
              },
            },
          ],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.PNG,
            base64: true,
          }
        );
        images.push(result);
      }

      setImages(images.map((image) => image.uri));

      return images.map((image) => image.base64?.split(",")[1] || image.base64);
    } catch (error) {
      console.error(error);
      return uris;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      base64: false,
      allowsMultipleSelection: true,
      selectionLimit: 2,
    });

    if (!result.canceled) {
      const base64Images = await manipulateImage(
        result.assets.map((asset) => asset.uri)
      );

      await textFromMenus(base64Images);
    }
  };

  const textFromMenus = async (base64Images: (string | undefined)[]) => {
    setLoading(true);
    setStatus(
      "Por favor espere... Estamos extrayendo los productos de las imágenes seleccionadas."
    );
    try {
      const res = await generateProductsByAI(base64Images, menu_id, categories);

      const products = res.data as Product[];

      setProductsGenerated(
        products.map((p) => {
          const id = Math.random().toString(36).slice(2, 9);
          return {
            ...p,
            id: p.id || id, // Use existing ID or generate a new one
          } as Product;
        })
      );

      if (products.length === 0) {
        Alert.alert(
          "No se encontraron productos",
          "La IA no pudo extraer productos del menú. Por favor, intenta con otra imagen o revisa la calidad de la imagen."
        );
      } else {
        Alert.alert(
          "La IA puede cometer errores",
          `Se han generado ${products.length} productos. Por favor, revisa bien el cada uno antes de guardarlos.`
        );
      }
    } catch (error) {
      console.error("Error al obtener el texto del menú:", error);
      setImages(null);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const saveAIProducts = async (product: Product) => {
    await saveProduct(product);
    const newProducts = productsGenerated.filter((p) => p.id !== product.id);
    setProductsGenerated(newProducts);
  };

  const deleteAIProduct = (product: Product) => {
    const newProducts = productsGenerated.filter((p) => p.id !== product.id);
    setProductsGenerated(newProducts);
  };

  return {
    images,
    productsGenerated,
    loading,
    pickImage,
    status,
    saveAIProducts,
    deleteAIProduct,
  };
};
