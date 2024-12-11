"use client";
import { Imessage, useMessage } from "@/utils/store/messages";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ChatBubble from "./ChatBubble";

export default function LoadMessages({ roomId, userId }: { userId: string; roomId: string }) {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const { messages, addMessage, optimisticIds, optimisticDeleteMessage, optimisticUpdateMessage } = useMessage(
    (state) => state
  );
  console.log(roomId);
  const supabase = createClient();
  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${roomId}`) // Unique channel name for each room
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, async (payload) => {
        if (!optimisticIds.includes(payload.new.id)) {
          const { error, data } = await supabase.from("profiles").select("*").eq("id", payload.new.profile_id).single();
          if (error) {
            toast.error(error.message);
          } else {
            const newMessage = {
              ...payload.new,
              profiles: data,
            };

            addMessage(newMessage as Imessage);
          }
        }
        const scrollContainer = scrollRef.current;
        if (scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10) {
          setNotification((current) => current + 1);
        }
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, (payload) => {
        optimisticDeleteMessage(payload.old.id);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, (payload) => {
        optimisticUpdateMessage(payload.new as Imessage);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <>
      {messages.map((value, index) => (
        <ChatBubble
          isOwnMessage={value.profiles?.id === userId}
          timestamp={new Date(value.created_at).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
          key={index}
        >
          {value.content}
        </ChatBubble>
      ))}
    </>
  );
}
