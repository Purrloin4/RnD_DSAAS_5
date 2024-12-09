"use client";
import { create } from "zustand";
import { Database } from "@/types/supabase";

export type INotification = {
  content: string;
  created_at: string;
  from_who: string;
  id: string;
  notification_type:string;
  to_who: string;
  from_who_details: {
    id: string;
    username: string | null;
    avatar_url: string | null;
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
