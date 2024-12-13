"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "@/src/components/Chat/ChatPresence";
import ChatAbout from "@/src/components/Chat/ChatAbout";
import toast from "react-hot-toast";

interface ChatHeaderProps {
  user: User | undefined;
  roomId: string;
}

export default function ChatHeader({ user, roomId }: ChatHeaderProps) {
  const [roomName, setRoomName] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the room name
  const getRoomName = async (roomId: string): Promise<string | null> => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.from("rooms").select("name").eq("id", roomId).single();

      if (error) {
        console.error("Error fetching room name:", error.message);
        return null;
      }

      return data?.name || null;
    } catch (error) {
      console.error("Unexpected error fetching room name:", error);
      return null;
    }
  };

  // Leave the room
  const handleLeaveGroup = async (roomId: string) => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("room_participants")
        .delete()
        .eq("room_id", roomId)
        .eq("profile_id", user?.id);

      if (error) {
        console.error("Error leaving room:", error.message);
        toast.error("Failed to leave the chat.");
        return;
      }

      //   if (data.length === 0) {
      //     toast.error("You were not part of this chat.");
      //   } else {
      toast.success("You have successfully left the chat.");
      router.push("/messages"); // Redirect to the chatrooms page
      //   }
    } catch (error) {
      console.error("Unexpected error leaving the room:", error);
      toast.error("An error occurred while leaving the chat.");
    }
  };

  useEffect(() => {
    const fetchRoomName = async () => {
      const name = await getRoomName(roomId);
      setRoomName(name);
    };

    fetchRoomName();
  }, [roomId]);

  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          <h1 className="text-xl font-bold">{roomName || "Chat Room"}</h1>
          <ChatPresence />
        </div>
        {user ? (
          <Button color="danger" onPress={() => handleLeaveGroup(roomId)}>
            Leave Chat
          </Button>
        ) : (
          <ChatAbout />
        )}
      </div>
    </div>
  );
}
