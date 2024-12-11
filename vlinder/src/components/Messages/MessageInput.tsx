"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/utils/store/user";
import { Imessage, useMessage } from "@/utils/store/messages";

import { PaperAirplaneIcon } from "Components/Icons/PaperAirplaneIcon";

export default function MessageInput({ roomId }: { roomId: string }) {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const supabase = createClient();

  const [message, setMessage] = React.useState("");
  const [suggestedMessage, setSuggestedMessage] = useState("");
  const handleSendMessage = async () => {
    const content = message;
    setMessage("");
    if (content.trim()) {
      const id = uuidv4();
      // const room_id = uuidv4();
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
      const { error } = await supabase.from("messages").insert({ content, id, profile_id: user?.id, room_id: roomId });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Message can not be empty!!");
    }
  };

  // Function to fetch the last message and calculate time difference
  const fetchLastMessage = async () => {
    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, created_at, content")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching last message: ", error);
      return;
    }
    if (messages && messages.length > 0) {
      const lastMessage = messages[0];
      const lastMessageTime = new Date(lastMessage.created_at);
      const currentTime = new Date();
      const timeDifference = (currentTime.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60 * 24); // time difference in days
      console.log("Time difference: ", timeDifference);
      // Suggest message based on time difference
      if (timeDifference > 1) {
        // More than a day
        setSuggestedMessage("It's been a while, how have you been?");
      } else if (timeDifference > 0.5 && timeDifference < 1) {
        // Within a day
        setSuggestedMessage("That sounds great! How do you feel about it?");
      }
    }
  };
  useEffect(() => {
    fetchLastMessage();
  }, []);

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
      <Button isIconOnly onClick={handleSendMessage} color="primary" aria-label="send" className="p-2 rounded-lg">
        <PaperAirplaneIcon />
      </Button>
    </>
  );
}
