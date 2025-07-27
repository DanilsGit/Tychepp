import { MenuUpdate } from "../../../types/updateTypes";
import { CategoryForProduct, Menu } from "../../../types/rowTypes";
import api from "../../../lib/api";

export const createMenu = async (menuData: MenuUpdate) =>
  api.post<Menu>("/create-menu", menuData);

export const generateProductsByAI = async (
  base64String: string | undefined,
  menu_id: string,
  categories: CategoryForProduct[]
) =>
  api.post("/create-ai-products-menu", { base64String, menu_id, categories });
