import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import NotificationMessages from "@/src/components/NotificationMessages";
import ChatAbout from "@/src/components/ChatAbout";
import NotificationHeader from "@/src/components/NotificationHeader";
export default async function Chat() {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    return (
        <>
            <div className="max-w-3xl mx-auto md:py-10 h-screen">
                <div className="h-full border rounded-md flex flex-col relative">
                    {<NotificationHeader/>}

                    {sessionData.session?.user ? (
                        <>
                            <NotificationMessages/>
                            {/* <ChatInput /> */}
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