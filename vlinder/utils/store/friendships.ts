import { create } from 'zustand';

// Adjust the interface to include the required properties
export type IFriendship = {
  id: string; // Unique identifier for the friendship
  username: string | null; // The friend's username
  friend_id: string; // The friend's profile ID
  friend_avatar: string | null; // The friend's avatar URL
};

// Define the Zustand store
interface FriendshipState {
  friendships: IFriendship[]; // List of friendships
  addFriendship: (friendship: IFriendship) => void; // Add a new friendship
  setFriendships: (friendships: IFriendship[]) => void; // Set all friendships
  removeFriendship: (friendshipId: string) => void; // Remove a friendship by ID
}

export const useFriendships = create<FriendshipState>()((set) => ({
  friendships: [],
  addFriendship: (friendship) =>
    set((state) => ({
      friendships: [...state.friendships, friendship], // Add a new friendship to the array
    })),
  setFriendships: (friendships) =>
    set(() => ({
      friendships, // Replace the entire friendships array
    })),
  removeFriendship: (friendshipId) =>
    set((state) => ({
      friendships: state.friendships.filter(
        (friendship) => friendship.id !== friendshipId // Filter out the friendship by ID
      ),
    })),
}));
