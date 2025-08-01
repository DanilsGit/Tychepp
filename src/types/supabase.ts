export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      category_for_product: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          attended_by: string | null
          client_name: string
          created_at: string
          from: number
          id: number
          messages: Json[]
          request_human: boolean
          to: number
          updated_at: string
        }
        Insert: {
          attended_by?: string | null
          client_name?: string
          created_at?: string
          from: number
          id?: number
          messages: Json[]
          request_human?: boolean
          to: number
          updated_at?: string
        }
        Update: {
          attended_by?: string | null
          client_name?: string
          created_at?: string
          from?: number
          id?: number
          messages?: Json[]
          request_human?: boolean
          to?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_attended_by_fkey"
            columns: ["attended_by"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["whatsapp_number"]
          },
        ]
      }
      employee: {
        Row: {
          authorized: boolean
          created_at: string
          id: string
          rejected: boolean
          restaurant_id: string
        }
        Insert: {
          authorized?: boolean
          created_at?: string
          id: string
          rejected?: boolean
          restaurant_id?: string
        }
        Update: {
          authorized?: boolean
          created_at?: string
          id?: string
          rejected?: boolean
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      menu: {
        Row: {
          created_at: string
          id: number
          name: string
          restaurant_id: string
          state: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          restaurant_id?: string
          state?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          restaurant_id?: string
          state?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          address: string
          client_name: string | null
          client_number: number
          conversation: Json[]
          created_at: string
          id: number
          reason: string | null
          restaurant_id: string
          status: string
          total_price: number
        }
        Insert: {
          address: string
          client_name?: string | null
          client_number: number
          conversation: Json[]
          created_at?: string
          id?: number
          reason?: string | null
          restaurant_id?: string
          status?: string
          total_price: number
        }
        Update: {
          address?: string
          client_name?: string | null
          client_number?: number
          conversation?: Json[]
          created_at?: string
          id?: number
          reason?: string | null
          restaurant_id?: string
          status?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_products: {
        Row: {
          comments: string | null
          created_at: string
          id: number
          order_id: number | null
          price_sold: number
          product_id: number | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: number
          order_id?: number | null
          price_sold: number
          product_id?: number | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: number
          order_id?: number | null
          price_sold?: number
          product_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      plan: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      product: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          menu_id: number
          name: string
          price: number
          state: boolean
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          menu_id: number
          name: string
          price: number
          state?: boolean
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          menu_id?: number
          name?: string
          price?: number
          state?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category_for_product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_plan: {
        Row: {
          created_at: string
          id: number
          plan_id: number | null
          profile_id: string | null
          state: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          plan_id?: number | null
          profile_id?: string | null
          state?: boolean
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          plan_id?: number | null
          profile_id?: string | null
          state?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_plan_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_plan_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: number | null
          status: boolean
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: number | null
          status?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: number | null
          status?: boolean
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant: {
        Row: {
          address: string | null
          created_at: string
          icon_url: string | null
          id: string
          name: string
          owner: string
          ready: boolean
          restaurant_code: string
          state: boolean
          welcome_message: string | null
          whatsapp_number: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          owner?: string
          ready?: boolean
          restaurant_code?: string
          state?: boolean
          welcome_message?: string | null
          whatsapp_number: number
        }
        Update: {
          address?: string | null
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          owner?: string
          ready?: boolean
          restaurant_code?: string
          state?: boolean
          welcome_message?: string | null
          whatsapp_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      schedule: {
        Row: {
          created_at: string
          day: string | null
          end: string | null
          id: number
          restaurant_id: string
          start: string | null
        }
        Insert: {
          created_at?: string
          day?: string | null
          end?: string | null
          id?: number
          restaurant_id?: string
          start?: string | null
        }
        Update: {
          created_at?: string
          day?: string | null
          end?: string | null
          id?: number
          restaurant_id?: string
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_conversation_message: {
        Args: { p_conversation_id: number; p_new_message: Json }
        Returns: boolean
      }
      append_message: {
        Args:
          | { p_conversation_id: number; p_new_message: Json }
          | { p_conversation_id: number; p_new_message: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
