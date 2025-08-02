import { create } from "zustand";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { PlatformAlert } from "../../../components/PlatformAlert";

interface MenuProducts {
  products: Product[];
  annotations: string;
  categories: CategoryForProduct[];
  setCategories: (categories: CategoryForProduct[]) => void;
  setAnnotations: (annotations: string) => void;
  saveAnnotations: (annotations: string, menuId: number) => Promise<void>;
  setProducts: (products: Product[]) => void;
  addProduct: (menuId: number) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (product: Product) => Promise<void>;
  saveProduct: (product: Product) => Promise<void>;
  saveAndAddProduct: (product: Product, menuId: number) => Promise<void>;
}

export const useMenuProductsStore = create<MenuProducts>((set, get) => ({
  products: [],

  annotations: "",

  categories: [],

  setCategories: (categories) => set({ categories }),

  setAnnotations: (annotations) => set({ annotations }),

  saveAnnotations: async (annotations, menuId) => {
    set({ annotations });
    try {
      const { error } = await supabase
        .from("menu")
        .update({ annotations })
        .eq("id", menuId);

      if (error) {
        throw new Error("Error updating annotations");
      }
      console.log("Annotations updated successfully");
    } catch (error) {
      console.error("Error setting annotations:", error);
      PlatformAlert(
        "Error",
        "Hubo un problema al guardar las anotaciones. Por favor, inténtalo de nuevo."
      );
    }
  },

  setProducts: (products) => set({ products }),

  addProduct: (menuId: number) => {
    if (get().products.some((p) => !p.name || !p.price || !p.category_id)) {
      PlatformAlert(
        "Producto incompleto",
        "Por favor, completa todos los campos del producto previo antes de agregar uno nuevo."
      );
      return;
    }

    const newProduct = {
      id: 0,
      name: "",
      price: 0,
      menu_id: menuId,
    } as Product;
    set((state) => ({
      products: [...state.products, newProduct],
    }));
  },

  editProduct: (product) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    }));
  },

  deleteProduct: async (product) => {
    try {
      if (!product.id) {
        set((state) => ({
          products: state.products.filter((p) => p !== product),
        }));
        return;
      }

      const { error } = await supabase
        .from("product")
        .update({ deleted: true })
        .eq("id", product.id);

      if (error) {
        throw new Error("Error deleting product");
      }

      set((state) => ({
        products: state.products.filter((p) => p.id !== product.id),
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
      PlatformAlert(
        "Error",
        "Hubo un problema al eliminar el producto. Por favor, inténtalo de nuevo."
      );
    }
  },

  saveProduct: async (product) => {
    try {
      if (!product.id) {
        if (get().products.some((p) => p.name === product.name)) {
          PlatformAlert(
            "Producto duplicado",
            `El producto "${product.name}" ya existe en el menú. Por favor, elige un nombre diferente.`
          );
          return;
        }
        const { id, ...productToSave } = product;
        const { data, error } = await supabase
          .from("product")
          .insert([productToSave])
          .select();
        if (error) {
          throw new Error("Error saving product");
        }
        const products = get().products.filter((p) => p.id);
        set({ products: [...products, data[0]] });
        return;
      }

      const { error } = await supabase
        .from("product")
        .update(product)
        .eq("id", product.id);

      if (error) {
        throw new Error("Error saving product");
      }
      // Actualizar el producto en el estado
      set((state) => ({
        products: state.products.map((p) =>
          p.id === product.id ? product : p
        ),
      }));
    } catch (error) {
      console.error("Error saving product:", error);
      PlatformAlert(
        "Error",
        "Hubo un problema al guardar el producto. Por favor, inténtalo de nuevo."
      );
    }
  },

  saveAndAddProduct: async (product, menuId) => {
    try {
      // Quitar el id del producto
      const { id, menu_id, ...productToSave } = product;

      console.log("Saving product:", productToSave);

      const { data, error } = await supabase
        .from("product")
        .insert({
          menu_id: menuId,
          ...productToSave,
        })
        .select();

      if (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
        throw new Error("Error saving and adding product");
      }

      // Agregar el nuevo producto a la lista
      if (data) {
        const newProduct = data[0] as Product;
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      }
    } catch (error) {
      console.error("Error saving and adding product:", error);
    }
  },
}));
