"use client";

import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
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

export default function ChatListItem({ name, lastMessage, time, isOnline, isActive, id, type }: ChatListItemProps) {
  const isGroupChat = type === "gc";
  const supabase = createClient();
  // Function to fetch the other user's username for direct messages
  const [chatName, setChatName] = useState(name); // Dynamically displayed chat name

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

  // Fetch the other user's username for DMs when the component mounts
  useEffect(() => {
    if (!isGroupChat) {
      fetchOtherUsername(id); // Only fetch for direct messages
    }
  }, [id, isGroupChat]);

  return (
    <Link href={`/messages/${id}`} replace>
      <div
        className={`cursor-pointer flex items-center p-4 overflow-hidden rounded-lg hover:bg-gray-200 mb-2 ${isActive ? "bg-gray-200" : ""}`}
      >
        <Avatar
          size="lg"
          isBordered={isOnline}
          color={isOnline ? "success" : undefined}
          className="mr-4 flex-shrink-0"
        />
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
