import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ListNotifications from "@/src/components/Notification/ListNotifications";
import ChatAbout from "@/src/components/Chat/ChatAbout";
import NotificationHeader from "@/src/components/Notification/NotificationHeader";
export default async function Chat() {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full rounded-md flex flex-col relative">
          {<NotificationHeader />}

          {sessionData.session?.user ? (
            <>
              <ListNotifications />
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
