import React from "react";
import ChatHeader from "@/src/components/ChatHeader";
import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatInput from "@/src/components/ChatInput";
import ChatMessages from "@/src/components/ChatMessages";
import ChatAbout from "@/src/components/ChatAbout";
import ChatRooms from "@/src/components/ChatRooms"
export default async function Page() {
	const supabase = createClient();
	const { data } = await supabase.auth.getSession();

	return (
		<>
			{/* <div className="max-w-3xl mx-auto md:py-10 h-screen"> */}
				<div className=" h-full border rounded-md flex flex-col relative">
        {/* <div className="flex items-center justify-center h-screen">
           <h1 className="text-gray-800 font-bold text-4xl">Messages</h1> */}
        {/* </div> */}
					{data.session?.user ? (
						<>
            <ChatRooms/>
							{/* <ChatMessages />
							<ChatInput /> */}
						</>
					) : (
						<ChatAbout />
					)}
				</div>
			{/* </div> */}
			<InitUser user={data.session?.user} />
		</>
	);
}


// export default function Page() {
//     return (
//         <div className="flex items-center justify-center h-screen">
//           <h1 className="text-gray-800 font-bold text-4xl">Messages</h1>
//         </div>
//       );
//   }