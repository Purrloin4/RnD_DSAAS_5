export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accessToken: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_used: boolean
          Last_name: string | null
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_used?: boolean
          Last_name?: string | null
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_used?: boolean
          Last_name?: string | null
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accessToken_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accessToken_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          organization_id: string | null
          picture_url: string | null
          place: string | null
          time: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          picture_url?: string | null
          place?: string | null
          time?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string | null
          picture_url?: string | null
          place?: string | null
          time?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_organization: {
        Row: {
          activity_id: string | null
          created_at: string
          id: number
          organization_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: number
          organization_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: number
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_organization_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          profile_1_id: string
          profile_2_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          profile_1_id: string
          profile_2_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          profile_1_id?: string
          profile_2_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_profile_1_id_fkey"
            columns: ["profile_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_profile_2_id_fkey"
            columns: ["profile_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          profile_1_id: string
          profile_2_id: string
        }
        Insert: {
          created_at?: string | null
          profile_1_id: string
          profile_2_id: string
        }
        Update: {
          created_at?: string | null
          profile_1_id?: string
          profile_2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_profile_1_id_fkey"
            columns: ["profile_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_profile_2_id_fkey"
            columns: ["profile_2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      healthcare_workers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "healthcare_workers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hobbies: {
        Row: {
          emoji: string | null
          id: number
          name: string
        }
        Insert: {
          emoji?: string | null
          id?: number
          name: string
        }
        Update: {
          emoji?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_edit: boolean
          profile_id: string
          room_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_edit?: boolean
          profile_id?: string
          room_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_edit?: boolean
          profile_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          from_who: string
          id: string
          notification_type: string | null
          to_who: string
        }
        Insert: {
          content?: string
          created_at?: string
          from_who?: string
          id?: string
          notification_type?: string | null
          to_who?: string
        }
        Update: {
          content?: string
          created_at?: string
          from_who?: string
          id?: string
          notification_type?: string | null
          to_who?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_from_who_fkey"
            columns: ["from_who"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_to_who_fkey"
            columns: ["to_who"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          phone_number?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          object_id: string
          post_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          object_id: string
          post_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          object_id?: string
          post_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_post_by_fkey"
            columns: ["post_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_hobbies: {
        Row: {
          hobby_id: number
          profile_id: string
        }
        Insert: {
          hobby_id: number
          profile_id: string
        }
        Update: {
          hobby_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_hobbies_hobby_id_fkey"
            columns: ["hobby_id"]
            isOneToOne: false
            referencedRelation: "hobbies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_hobbies_profile_id_fkey"
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
          birthday: string | null
          description: string | null
          disability: string[] | null
          display_disability: boolean | null
          full_name: string | null
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          location: string | null
          need_assistance: boolean | null
          organization_id: string | null
          role: string
          sex_positive: boolean | null
          sexual_orientation: string | null
          smoker: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          description?: string | null
          disability?: string[] | null
          display_disability?: boolean | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id: string
          location?: string | null
          need_assistance?: boolean | null
          organization_id?: string | null
          role?: string
          sex_positive?: boolean | null
          sexual_orientation?: string | null
          smoker?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          description?: string | null
          disability?: string[] | null
          display_disability?: boolean | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          location?: string | null
          need_assistance?: boolean | null
          organization_id?: string | null
          role?: string
          sex_positive?: boolean | null
          sexual_orientation?: string | null
          smoker?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          created_at: string
          profile_id: string
          room_id: string
        }
        Insert: {
          created_at?: string
          profile_id: string
          room_id: string
        }
        Update: {
          created_at?: string
          profile_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          chat_type: Database["public"]["Enums"]["ChatType"]
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          chat_type?: Database["public"]["Enums"]["ChatType"]
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          chat_type?: Database["public"]["Enums"]["ChatType"]
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_friend_request: {
        Args: {
          requester: string
          recipient: string
        }
        Returns: undefined
      }
      create_individual_room: {
        Args: {
          room_name: string
          other_user_id: string
        }
        Returns: {
          id: string
          name: string
          created_at: string
        }[]
      }
      create_new_room: {
        Args: {
          room_name: string
        }
        Returns: {
          id: string
          name: string
          created_at: string
        }[]
      }
      end_friendship: {
        Args: {
          user_1: string
          user_2: string
        }
        Returns: undefined
      }
      get_friend_status: {
        Args: {
          other_user_id: string
        }
        Returns: string
      }
      get_other_username: {
        Args: {
          input_room_id: string
        }
        Returns: string
      }
      get_user_rooms: {
        Args: {
          user_id: string
        }
        Returns: {
          room_id: string
        }[]
      }
      is_room_participant: {
        Args: {
          room_id: string
          profile_id: string
        }
        Returns: boolean
      }
      reject_friend_request: {
        Args: {
          requester: string
          recipient: string
        }
        Returns: undefined
      }
      send_friend_request: {
        Args: {
          profile_2_id: string
        }
        Returns: undefined
      }
      show_friends: {
        Args: Record<PropertyKey, never>
        Returns: {
          profile_id: string
          username: string
          avatar_url: string
        }[]
      }
    }
    Enums: {
      ChatType: "dm" | "gc"
      Gender: "Male" | "Female" | "Other"
      LookingFor: "Friends" | "Short-term Fun" | "Long-term Partner"
      NotificationType:
        | "FriendshipRequest"
        | "Other"
        | "FriendshipRejection"
        | "FriendshipAccept"
      visibility: "all" | "specific"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
