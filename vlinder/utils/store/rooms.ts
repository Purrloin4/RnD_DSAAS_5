import { create } from 'zustand';
import { Database } from '@/types/supabase';

export type IRoom = {
  id: string;
  name: string | null;
  created_at: string | null;
};

interface RoomState {
  rooms: IRoom[];
  addRoom: (room: IRoom) => void;
  setRooms: (rooms: IRoom[]) => void;
  removeRoom: (roomId: string) => void;
}

export const useRooms = create<RoomState>()((set) => ({
  rooms: [],
  addRoom: (room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),
  setRooms: (rooms) =>
    set(() => ({
      rooms,
    })),
  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),
}));