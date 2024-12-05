"use client";
import { create } from "zustand";
import { Database } from "@/types/supabase";

export type INotification = {
  id: string;
  content: string;
  created_at: string;
  from_who: string;
  to_who: string;
  notification_type: Database["public"]["Enums"]["NotificationType"];
  profiles: {
    avatar_url: string | null
    birthday: string | null
    disability: string[] | null
    display_disability: boolean | null
    full_name: string | null
    gender: Database["public"]["Enums"]["Gender"] | null
    hobbies: string[] | null
    id: string
    need_assistance: boolean | null
    role: string
    sex_positive: boolean | null
    sexual_orientation: string | null
    smoker: boolean | null
    updated_at: string | null
    username: string | null
    organization_id: string | null

} | null;

};

interface NotificationState {
  notifications: INotification[];
  page: number;
  hasMore: boolean;
  addNotification: (notification: INotification) => void;
  setNotifications: (notifications: INotification[]) => void;
  clearNotifications: () => void;
}

export const useNotifications = create<NotificationState>((set) => ({
    hasMore: true,
	page: 1,
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  setNotifications: (notifications) => set(() => ({ notifications })),
  clearNotifications: () => set(() => ({ notifications: [] })),
}));
