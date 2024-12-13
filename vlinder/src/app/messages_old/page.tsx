import React from "react";
import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatAbout from "@/src/components/Chat/ChatAbout";
import ChatRooms from "@/src/components/Chat/ChatRooms";
export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();

  return (
    <main>
      {/* <div className="max-w-3xl mx-auto md:py-10 h-screen"> */}
      <div className=" h-full border rounded-md flex flex-col relative">
        {/* <div className="flex items-center justify-center h-screen">
           <h1 className="text-gray-800 font-bold text-4xl">Messages</h1> */}
        {/* </div> */}
        {data.session?.user ? <ChatRooms /> : <ChatAbout />}
      </div>
      {/* </div> */}
      <InitUser user={data.session?.user} />
    </main>
  );
}

// export default function Page() {
//     return (
//         <div className="flex items-center justify-center h-screen">
//           <h1 className="text-gray-800 font-bold text-4xl">Messages</h1>
//         </div>
//       );
//   }