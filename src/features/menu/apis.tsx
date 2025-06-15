import { MenuUpdate } from "../../types/updateTypes";
import { Menu } from "../../types/rowTypes";
import api from "../../lib/api";

export const createMenu = async (menuData: MenuUpdate) =>
  api.post<Menu>("/create-menu", menuData);
