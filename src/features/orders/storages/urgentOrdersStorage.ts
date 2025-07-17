import { create } from "zustand";
import { Conversations } from "../../../types/rowTypes";

interface UrgentOrderState {
  urgentOrders: Conversations[];
  isLoading: boolean;
  status: string;
  setUrgentOrders: (orders: Conversations[]) => void;
  setStatus: (status: string) => void;
  addUrgentOrder: (order: Conversations) => void;
  handleAttendedBy: (orderId: number, attendedBy: string) => void;
}

export const useUrgentOrderStore = create<UrgentOrderState>((set, get) => ({
  urgentOrders: [],
  isLoading: true,
  status: "",
  setUrgentOrders: (orders) => set({ urgentOrders: orders, isLoading: false }),
  setStatus: (status) => set({ status }),
  addUrgentOrder: (order) =>
    set((state) => ({
      urgentOrders: [...state.urgentOrders, order],
    })),
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
}));
