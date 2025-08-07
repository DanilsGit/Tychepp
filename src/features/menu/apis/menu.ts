import { CategoryForProduct } from "../../../types/rowTypes";
import api from "../../../lib/api";

export const generateProductsByAI = async (
  base64String: string | undefined,
  menu_id: string,
  categories: CategoryForProduct[]
) =>
  api.post("/create-ai-products-menu", { base64String, menu_id, categories });
