"use client";

import { Avatar, AvatarGroup } from "@nextui-org/react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRoomParticipant } from "@/utils/store/roomParticipant";
import { i } from "framer-motion/client";

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  isOnline?: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  id: string;
  type: string;
}
interface Participants {
  created_at: string;
  profile_id: string;
  room_id: string;
  profiles: {
    avatar_url: string | null;
    username: string | null;
    id: string;
  } | null;
}

export default function ChatListItem({ name, lastMessage, time, isOnline, isActive, id, type }: ChatListItemProps) {
  const isGroupChat = type === "gc";
  const supabase = createClient();
  const [chatName, setChatName] = useState(name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participants[] | null>(null);

  // const [ participants, setParticipants ] = useRoomParticipant((state) => state);

  // Fetch friendships (optional, if not already initialized)
  const fetchParticipants = async (roomId: string) => {
    const { data, error } = await supabase
      .from("room_participants")
      .select("*,profiles(avatar_url,username,id)")
      .eq("room_id", roomId);

    if (error) {
      console.error("Error fetching participants:", error);
    } else {
      setParticipants(data as Participants[]);
    }
  };

  const fetchOtherUsername = async (roomId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_other_username", {
        input_room_id: roomId,
      });

      if (error) {
        console.error("Error fetching other user's username:", error);
        return;
      }

      if (data) {
        setChatName(data); // Update chat name to the other user's username
      }
    } catch (error) {
      console.error("Unexpected error fetching other user's username:", error);
    }
  };
  const fetchOtherAvatar = async (roomId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_other_avatar", {
        input_room_id: roomId,
      });

      if (error) {
        console.error("Error fetching other user's username:", error);
        return;
      }

      if (data) {
        setAvatarUrl(data); // Update chat name to the other user's username
      }
    } catch (error) {
      console.error("Unexpected error fetching other user's username:", error);
    }
  };

  const fetchAvatarUrl = async (roomId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("avatar_url").eq("id", roomId).single();

      if (error) {
        console.error("Error fetching avatar URL:", error);
        return;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Unexpected error fetching avatar URL:", error);
    }
  };

  useEffect(() => {
    if (!isGroupChat) {
      fetchOtherAvatar(id);
      fetchOtherUsername(id); // Only fetch for direct messages
    } else {
      fetchParticipants(id);
    }
  }, [id, isGroupChat]);

  return (
    <Link href={`/messages/${id}`} replace>
      <div
        className={`cursor-pointer flex items-center p-4 overflow-hidden rounded-lg hover:bg-gray-200 mb-2 ${isActive ? "bg-gray-200" : ""}`}
      >
        {isGroupChat ? (
          <AvatarGroup size="sm" max={3} className="mr-4 flex-shrink-0">
            {participants &&
              participants.map((participant) => (
                <Avatar key={participant.profile_id} size="sm" src={participant.profiles?.avatar_url || undefined} />
              ))}
          </AvatarGroup>
        ) : (
          <Avatar size="md" src={avatarUrl || undefined} className="mr-4 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{chatName}</h3>
          {/* <p className="text-gray-500 text-sm truncate">{lastMessage}</p> */}
        </div>
        <div className="text-gray-400 text-sm whitespace-nowrap ml-4 flex-shrink-0">
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
}
