"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/utils/store/user";
import { Imessage, useMessage } from "@/utils/store/messages";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

import { PaperAirplaneIcon } from "Components/Icons/PaperAirplaneIcon";

export default function MessageInput({ roomId }: { roomId: string }) {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = createClient();

  const [message, setMessage] = useState("");
  const [suggestedMessage, setSuggestedMessage] = useState<string>("");

  const handleSendMessage = async (overrideMessage?: string) => {
    const content = overrideMessage || message; // Use overrideMessage if provided
    setMessage("");

    if (content.trim()) {
      const id = uuidv4();
      const newMessage = {
        id,
        content,
        profile_id: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        room_id: roomId,
        rooms: {
          id: roomId,
          created_at: null,
          name: null,
        },
        profiles: {
          avatar_url: user?.user_metadata.avatar_url,
          id: user?.id,
          updated_at: new Date().toISOString(),
          username: user?.user_metadata.user_name,
          birthday: null,
          disability: null,
          display_disability: null,
          full_name: null,
          gender: null,
          need_assistance: null,
          organization_id: null,
          role: user?.role,
          sex_positive: null,
          sexual_orientation: null,
          smoker: null,
        },
      };
      addMessage(newMessage as Imessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase
        .from("messages")
        .insert({ content, id, profile_id: user?.id, room_id: roomId });
      fetchLastMessage();
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Message cannot be empty!");
    }
  };

  const fetchLastMessage = async () => {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("id, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (messages && messages.length === 0) {
        console.log("No messages found");
      }
      if (error) {
        console.error("Error fetching last message: ", error);
        return;
      }

      if (messages && messages.length > 0) {
        const lastMessage = messages[0];
        const lastMessageTime = new Date(lastMessage.created_at);
        const currentTime = new Date();
        const timeDifference =
          (currentTime.getTime() - lastMessageTime.getTime()) /
          (1000 * 60 * 60 * 24); // Time difference in days

        if (timeDifference > 1) {
          setSuggestedMessage("It's been a while, how have you been?");
        } else if (timeDifference > 0.5 && timeDifference <= 1) {
          setSuggestedMessage("That sounds great! How do you feel about it?");
        } else {
          setSuggestedMessage(""); // Clear suggestion if no condition is met
        }
      } else {
        setSuggestedMessage("Hello! How are you doing?");
      }
    } catch (error) {
      console.error("Error fetching last message: ", error);
    }
  };

  useEffect(() => {
    fetchLastMessage();
  }, [roomId]);

  return (
    <>
      <Input
        value={message}
        onValueChange={setMessage}
        size="lg"
        type="text"
        placeholder="Type a message..."
        className="flex-1 mr-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      {suggestedMessage && (
        <Button
          className="mx-2"
          onPress={() => {
            setMessage(suggestedMessage);
          }}
        >
          {suggestedMessage}
        </Button>
      )}
      <Button
        isIconOnly
        onClick={() => handleSendMessage()}
        color="primary"
        aria-label="send"
        className="p-2 rounded-lg"
      >
        <PaperAirplaneIcon />
      </Button>
    </>
  );
}
