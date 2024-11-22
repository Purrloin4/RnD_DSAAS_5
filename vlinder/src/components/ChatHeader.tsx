"use client";
import React from "react";
import {Button, ButtonGroup} from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
// import ChatPresence from "./ChatPresence";
import {login} from "@/src/app/login/actions";

export default function ChatHeader({ user }: { user: User | undefined }) {
	const router = useRouter();
    const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.refresh();
	};

	return (
		<div className="h-20">
			<div className="p-5 border-b flex items-center justify-between h-full">
				<div>
					<h1 className="text-xl font-bold">Daily Chat</h1>
					{/* <ChatPresence /> */}
				</div>
				{/* {user ? (
					<Button formAction={handleLogout}>Logout</Button>
				) : ( 
					<Button formAction={login}>Login</Button>
				)} */}
			</div>
		</div>
	);
}