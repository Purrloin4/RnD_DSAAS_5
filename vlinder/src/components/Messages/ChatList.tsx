"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/store/user";
import { useRouter, useParams } from "next/navigation";
import ChatListItem from "@/src/components/Messages/ChatListItem";
import ChatListSuspense from "./ChatListSuspense";
import { ReactNode } from "react";

type ChatListProps = {
  children?: ReactNode;
  className?: string;
};

interface Room {
  id: string;
  name: string | null;
  created_at: string;
}

interface User {
  id: string;
}

export default function ChatList({ children, className }: ChatListProps) {
  const user = useUser((state) => state.user);
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { Id } = useParams();

  const fetchUserRooms = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_user_rooms", { user_id: user?.id });

      if (error) {
        console.error("Error fetching user rooms:", error);
        return;
      }

      if (data.length > 0) {
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("id, name, created_at")
          .in(
            "id",
            data.map((room: { room_id: string }) => room.room_id)
          );

        if (roomError) {
          console.error("Error fetching room details:", roomError);
          return;
        }
        setRooms(roomData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserRooms();
    }
  }, [user]);

  if (loading) {
    return <ChatListSuspense className={className} />;
  }

  const createNewRoom = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("create_new_room", { room_name: "New Room" });

      if (error) {
        console.error("Error creating new room:", error);
        return;
      }

      fetchUserRooms();
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <h2 className="">Chats</h2>
      <div className="flex-1 max-h-screen overflow-y-auto">
        {rooms.map((room, index) => (
          <ChatListItem
            key={index}
            name={room.name || "Unnamed Chat"}
            lastMessage={""}
            time={""}
            isOnline={false}
            isActive={room.id === Id}
            isGroupChat={false}
            id={room.id}
          />
        ))}
      </div>
    </div>
  );
}
