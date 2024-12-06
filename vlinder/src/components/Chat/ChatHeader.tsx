"use client";
import React from "react";
import {Button, ButtonGroup} from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "@/src/components/Chat/ChatPresence";
export default function ChatHeader({ user }: { user: User | undefined }) {
	const router = useRouter();

    const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.refresh();
	};
	const handleLogin = async () => {
			router.push("/login");
		  };
	
	return (
		<div className="h-20">
			<div className="p-5 border-b flex items-center justify-between h-full">
				<div>
					<h1 className="text-xl font-bold">Daily Chat</h1>
					<ChatPresence />
				</div>
				{user ? (
					<Button color = "warning" onPress={handleLogout}>Logout</Button>
				) : ( 
					<Button color = "primary" onPress={handleLogin}>Login</Button>
				)}
			</div>
		</div>
	);
}