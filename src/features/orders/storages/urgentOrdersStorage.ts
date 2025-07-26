import { create } from "zustand";
import { Conversations } from "../../../types/rowTypes";

interface UrgentOrderState {
  urgentOrders: Conversations[];
  status: string;
  setUrgentOrders: (orders: Conversations[]) => void;
  setStatus: (status: string) => void;
  addUrgentOrder: (order: Conversations) => void;
  handleAttendedBy: (orderId: number, attendedBy: string) => void;
  handleNewMessage: (orderId: number, newMessage: boolean) => void;
  removeUrgentOrder: (orderId: number) => void;
}

export const useUrgentOrderStore = create<UrgentOrderState>((set, get) => ({
  urgentOrders: [],
  status: "",
  setUrgentOrders: (orders) => set({ urgentOrders: orders }),
  setStatus: (status) => set({ status }),
  addUrgentOrder: (order) => {
    const existingOrder = get().urgentOrders.find((o) => o.id === order.id);
    if (existingOrder) {
      console.warn("Order already exists in urgent orders:", order.id);
      return;
    }
    set((state) => ({
      urgentOrders: [...state.urgentOrders, order],
    }));
  },
  handleAttendedBy: (orderId, attendedBy) => {
    // Revisar si ya estaba atendido
    const orderExists = get().urgentOrders.find(
      (order) => order.id === orderId
    );

    if (orderExists?.attended_by) {
      return;
    }

    set((state) => ({
      urgentOrders: state.urgentOrders.map((order) =>
        order.id === orderId ? { ...order, attended_by: attendedBy } : order
      ),
    }));
  },
  handleNewMessage: (orderId: number, newMessage: boolean) => {
    set((state) => ({
      urgentOrders: state.urgentOrders.map((order) =>
        order.id === orderId ? { ...order, newMessage } : order
      ),
    }));
  },
  removeUrgentOrder: (orderId) => {
    set((state) => ({
      urgentOrders: state.urgentOrders.filter((order) => order.id !== orderId),
    }));
  },
}));
