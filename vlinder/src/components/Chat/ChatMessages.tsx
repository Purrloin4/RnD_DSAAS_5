import React, { Suspense } from "react";
import ListMessages from "@/src/components/Chat/ListMessages";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/utils/store/InitMessages";
import { LIMIT_MESSAGE } from "@/utils/constant/constants";

export default async function ChatMessages({ roomId }: { roomId: string }) {
  const supabase = createClient();

  const { data } = await supabase
    .from("messages")
    .select("*,profiles(*),rooms(*)")
    .eq("room_id", roomId)
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"loading.."}>
      <ListMessages roomId={roomId} />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
