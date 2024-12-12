import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import ChatMessagesContainer from "Components/Messages/ChatMessagesContainer";
import LoadMessages from "Components/Messages/LoadMessages";
import InitMessages from "@/utils/store/InitMessages";
import { LIMIT_MESSAGE } from "@/utils/constant/constants";
import Loading from "./loading";

export default async function Page({ params }: { params: { Id: string } }) {
  const supabase = createClient();
  // const { data: sessionData } = await supabase.auth.getSession();

  const { data: userData } = await supabase.auth.getUser();

  const { data: roomData, error: roomError } = await supabase
    .from("rooms")
    .select("id, name,chat_type")
    .eq("id", params.Id)
    .single();

  const { data: messageData, error: messageError } = await supabase
    .from("messages")
    .select("*,profiles(*),rooms(*)")
    .eq("room_id", params.Id)
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  if (roomError || !roomData) {
    //
    //  Send to 404
    //
    return <></>;
  }

  //
  //  Messages
  //

  return (
    <Suspense fallback={<Loading />}>
      <ChatMessagesContainer
        roomId={roomData.id}
        className="flex-1 h-screen max-h-screen overflow-x-hidden"
        name={roomData.name || "Unnamed Chat"}
        user = {userData.user?.id || ""}
        type={roomData.chat_type}
      >
        <LoadMessages userId={userData.user?.id || ""} roomId={roomData.id} />
        <InitMessages messages={messageData?.reverse() || []} />
      </ChatMessagesContainer>
    </Suspense>
  );
}
