"use client";
import { useUser } from "@/utils/store/user";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

export default function ChatPresence() {
  const user = useUser((state) => state.user);
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        const userIds = [];
        for (const id in channel.presenceState()) {
          // @ts-expect-error: I know what I'm doing
          userIds.push(channel.presenceState()[id][0].user_id);
        }
        setOnlineUsers([...new Set(userIds)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user?.id,
          });
        }
      });
  }, [user]);

  if (!user) {
    return <div className=" h-3 w-1"></div>;
  }

  const onlineText = onlineUsers === 1 ? "1 online" : `${onlineUsers} onlines`;

  return (
    <div className="flex items-center gap-1">
      <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
      <h1 className="text-sm text-gray-400">{onlineText}</h1>
    </div>
  );
}
