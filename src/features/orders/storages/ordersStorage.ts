import { create } from "zustand";
import { Order } from "../../../types/rowTypes";

interface OrderState {
  orders: Order[];
  status: string;
  setOrders: (orders: Order[]) => void;
  setStatus: (status: string) => void;
  addOrder: (order: Order) => void;
  editOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  status: "",
  setOrders: (orders) => set({ orders }),
  setStatus: (status) => set({ status }),
  addOrder: (order) => {
    const existingOrder = get().orders.find((o) => o.id === order.id);

    if (existingOrder) {
      console.warn("Order already exists:", order.id);
      return;
    }

    set((state) => ({
      orders: [...state.orders, order],
    }));
  },
  editOrder: (order) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === order.id ? order : o)),
    }));
  },
}));
