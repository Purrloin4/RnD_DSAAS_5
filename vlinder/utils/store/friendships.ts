import { create } from 'zustand';

export type IFriendship = {
  profile_1_id: string;
  profile_2_id: string;
  created_at: string | null;
  profile_1_details?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  profile_2_details?: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
};

interface FriendshipState {
  friendships: IFriendship[];
  addFriendship: (friendship: IFriendship) => void;
  setFriendships: (friendships: IFriendship[]) => void;
  removeFriendship: (friendshipId: string) => void;
}

export const useFriendships = create<FriendshipState>()((set) => ({
  friendships: [],
  addFriendship: (friendship) =>
    set((state) => ({
      friendships: [...state.friendships, friendship],
    })),
  setFriendships: (friendships) =>
    set(() => ({
      friendships,
    })),
  removeFriendship: (friendshipId) =>
    set((state) => ({
      friendships: state.friendships.filter(
        (friendship) =>
          friendship.profile_1_id !== friendshipId &&
          friendship.profile_2_id !== friendshipId
      ),
    })),
}));
