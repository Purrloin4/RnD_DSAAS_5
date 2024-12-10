"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@nextui-org/react";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useFriendships } from "@/utils/store/friendships";
import InitFriendships from "@/utils/store/InitFriendships";
import { createClient } from "@/utils/supabase/client";
export default function FriendshipList() {
  const router = useRouter();
  const { friendships, setFriendships } = useFriendships(); // Access Zustand store

  // Fetch friendships (optional, if not already initialized)
  useEffect(() => {
    const fetchFriendships = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("show_friends");

      if (error) {
        console.error("Error fetching friendships:", error);
      } else {
        const formattedData = data.map((friend: any) => ({
          id: friend.id,
          friend_id: friend.profile_id,
          friend_username: friend.username,
          friend_avatar: friend.avatar_url || null,
        }));
        setFriendships(formattedData);
      }
    };

    if (friendships.length === 0) {
      fetchFriendships();
    }
  }, [friendships, setFriendships]);

  const handleNavigation = (id: string) => {
    router.push(`/profile/${id}`);
  };

  return (
    <Listbox>
      {friendships.map((friend) => (
        <ListboxItem
          key={friend.id}
          className="cursor-pointer hover:bg-gray-100 p-3 rounded-md"
          onClick={() => handleNavigation(friend.friend_id)}
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={friend.friend_avatar || "/default-avatar.png"}
              alt={friend.username || "Friend"}
              size="md"
              className="cursor-pointer"
            />
            <span className="font-semibold">{friend.username}</span>
          </div>
        </ListboxItem>
      ))}
    </Listbox>
  );
}
