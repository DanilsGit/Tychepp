import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";

interface AuthState {
  session: Session | null;
  profile: any;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  getProfile: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isLoading: true,

  setSession: (session) => set({ session, isLoading: false }),

  initializeAuth: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, isLoading: false });
    });
  },

  getProfile: async () => {
    const { session } = useAuthStore.getState();
    if (!session?.user) throw new Error("No user on the session!");

    const { data, error, status } = await supabase
      .from("profiles")
      .select(`username, role`)
      .eq("id", session.user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      throw new Error("No profile data found!");
    }

    set({ profile: data });
  },
}));
