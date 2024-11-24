import React from "react";
import ChatHeader from "@/src/components/ChatHeader";
import { createClient } from "@/utils/supabase/server";
import InitUser from "@/utils/store/InitUser";
import ChatInput from "@/src/components/ChatInput";
import ListMessages from "@/src/components/ListMessages";
import ChatMessages from "@/src/components/ChatMessages";
import ChatAbout from "@/src/components/ChatAbout";

export default async function Page() {
	const supabase = createClient();
	const { data } = await supabase.auth.getSession();

	return (
		<>
			<div className="max-w-3xl mx-auto md:py-10 h-screen">
				<div className=" h-full border rounded-md flex flex-col relative">
					<ChatHeader user={data.session?.user} />

					{data.session?.user ? (
						<>
							<ChatMessages />
							<ChatInput />
						</>
					) : (
						<ChatAbout />
					)}
				</div>
			</div>
			<InitUser user={data.session?.user} />
		</>
	);
}