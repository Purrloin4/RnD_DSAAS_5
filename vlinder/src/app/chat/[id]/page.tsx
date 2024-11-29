import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatInput from "@/src/components/ChatInput";
import ChatMessages from "@/src/components/ChatMessages";
import ChatAbout from "@/src/components/ChatAbout";
import ChatHeader from "@/src/components/ChatHeader";

export default async function Chat({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    const { data: roomData, error } = await supabase
        .from("rooms")
        .select("id")
        .eq("id", params.id)
        .single();

    if (error || !roomData) {
        return  (
		<div className="flex items-center justify-center h-screen">
		<h1 className="text-gray-800 font-bold text-4xl">Error: Chat Room Doesn't Exist </h1>
	  </div>);
    }

    return (
        <>
            <div className="max-w-3xl mx-auto md:py-10 h-screen">
                <div className="h-full border rounded-md flex flex-col relative">
                    <ChatHeader user={sessionData.session?.user} />

                    {sessionData.session?.user ? (
                        <>
                            <ChatMessages roomId={params.id} />
                            <ChatInput />
                        </>
                    ) : (
                        <ChatAbout />
                    )}
                </div>
            </div>
            <InitUser user={sessionData.session?.user} />
        </>
    );
}