import { create } from 'zustand';
import { Database } from '@/types/supabase';

export type IRoomParticipant = {
  created_at: string;
  profile_id: string;
  room_id: string;
  profile: {
    avatar_url: string | null;
    username: string | null;
    id: string;
  } | null;
};

interface RoomParticipantState {
  participants: IRoomParticipant[];
  addParticipant: (participant: IRoomParticipant) => void;
  setParticipants: (participants: IRoomParticipant[]) => void;
  removeParticipant: (profile_id: string) => void;
}

export const useRoomParticipant = create<RoomParticipantState>()((set) => ({
  participants: [],
  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant],
  })),
  setParticipants: (participants) => set(() => ({
    participants,
  })),
  removeParticipant: (profile_id) => set((state) => ({
    participants: state.participants.filter(
      (participant) => participant.profile_id !== profile_id
    ),
  })),
}));
