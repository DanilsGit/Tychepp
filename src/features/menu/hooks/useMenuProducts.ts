import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Product } from "../../../types/rowTypes";
import { Alert } from "react-native";

export const useMenuProducts = (menuId: string) => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();

    // Cleanup function to reset state when component unmounts
    return () => {
      setCurrentProducts([]);
      setProducts([]);
      setLoading(true);
    };
  }, [menuId]);

  const getProducts = async () => {
    const { data, error, status } = await supabase
      .from("product")
      .select(`*`)
      .eq("menu_id", menuId)
      .order("created_at", { ascending: true });

    if (error && status !== 406) {
      console.error("Error fetching products:", error);
      setLoading(false);
      return;
    }

    if (data) {
      setCurrentProducts(data as Product[]);
      setProducts(data as Product[]);
      setLoading(false);
    }
  };

  const saveProduct = async (product: Product) => {
    if (!product.name || !product.price) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, completa todos los campos del producto antes de guardarlo.",
        [{ text: "OK" }]
      );
      return;
    }
    const existingProduct = currentProducts.some((p) => p.id === product.id);
    if (existingProduct) {
      return editProduct(product);
    }

    if (currentProducts.some((p) => p.name === product.name)) {
      Alert.alert(
        "Producto duplicado",
        `El producto "${product.name}" ya existe en el menú. Por favor, elige un nombre diferente.`,
        [{ text: "OK" }]
      );
      return;
    }

    const { id, ...rest } = product; // Remover el id

    const newProduct: Product = {
      ...rest,
      menu_id: Number(menuId),
    } as Product;

    const { data, error } = await supabase
      .from("product")
      .insert([newProduct])
      .select();

    if (error) {
      console.error("Error saving product:", error);
      return;
    }

    if (data) {
      console.log("Product saved:", data);
      setCurrentProducts((prev) => [...prev, ...data]);
      const cleanedProducts = products.filter((p) => p.id);
      const newProducts = [...cleanedProducts, ...data];
      setProducts(newProducts);

      Alert.alert(
        "Producto guardado",
        `El producto "${data[0].name}" se ha guardado correctamente.`,
        [{ text: "OK" }]
      );
    }
  };

  const addProduct = () => {
    if (products.some((p) => !p.id)) {
      Alert.alert(
        "Producto en edición",
        "Por favor, guarda o descarta el producto que estás editando antes de agregar uno nuevo.",
        [{ text: "OK" }]
      );
      return;
    }

    const newProduct: Product = {
      name: "",
      price: 0,
    } as Product;

    setProducts((prev) => [...prev, newProduct]);
  };

  const editProduct = async (product: Product) => {
    if (!product.id) {
      console.error("Product must have an id to be edited");
      return;
    }

    if (!hasChanges(product)) {
      Alert.alert(
        "No se han realizado cambios",
        "No se han realizado cambios en el producto.",
        [{ text: "OK" }]
      );
      return;
    }

    const { data, error } = await supabase
      .from("product")
      .update(product)
      .eq("id", product.id)
      .select();

    if (error) {
      console.error("Error updating product:", error);
      return;
    }

    if (data) {
      const newProducts = currentProducts.map((p) =>
        p.id === product.id ? data[0] : p
      );
      setCurrentProducts(newProducts);
      setProducts(newProducts);
      Alert.alert(
        "Producto actualizado",
        "El producto se ha actualizado correctamente.",
        [{ text: "OK" }]
      );
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!product.id) {
      setProducts(currentProducts);
      return;
    }

    Alert.alert(
      "¿Estás seguro?",
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        {
          text: "No",
        },
        {
          text: "Sí",
          onPress: () => deleteConfirmation(),
        },
      ],
      {
        cancelable: true,
      }
    );

    const deleteConfirmation = async () => {
      const { error } = await supabase
        .from("product")
        .delete()
        .eq("id", product.id);

      if (error) {
        console.error("Error deleting product:", error);
        return;
      }

      const newProducts = currentProducts.filter((p) => p.id !== product.id);
      setCurrentProducts(newProducts);
      setProducts(newProducts);

      Alert.alert(
        "Producto eliminado",
        `El producto "${product.name}" ha sido eliminado correctamente.`,
        [{ text: "OK" }]
      );
    };
  };

  const hasChanges = (product: Product) => {
    if (!product.id) return true;
    const originalProduct = currentProducts.find((p) => p.id === product.id);
    if (!originalProduct) return true;
    return (
      originalProduct.name !== product.name ||
      originalProduct.price !== product.price ||
      originalProduct.description !== product.description ||
      originalProduct.category_id !== product.category_id
    );
  };

  return {
    products,
    loading,
    addProduct,
    saveProduct,
    hasChanges,
    deleteProduct,
  };
};
