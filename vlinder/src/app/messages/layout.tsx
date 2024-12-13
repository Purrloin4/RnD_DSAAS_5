import { Suspense, useState } from "react";
import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatListSuspense from "@/src/components/Messages/ChatListSuspense";

//Components
import ChatList from "@/src/components/Messages/ChatList";

//
//  Still need fix route user to login if user is not logged in
//
async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const { data: userData } = await supabase.auth.getUser();

  return (
    <main className="max-h-screen max-w-screen flex flex-row overflow-hidden">
      <ChatList className="lg:w-[400px] w-full border-r-2 h-screen border-grey-300" />
      {children}
      <InitUser user={userData.user} />
    </main>
  );
}

export default Layout;
