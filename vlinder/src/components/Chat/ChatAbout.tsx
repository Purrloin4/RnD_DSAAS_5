
"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
export default function ChatAbout() {

	const router = useRouter();
	const handleLogin = async () => {
		router.push("/login");
	  };
	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="text-center space-y-5">
				<h1 className="text-3xl font-bold">Welcome to Mothim</h1>
				<Button color = "primary" onPress={handleLogin}>Login</Button>

				<p className="w-96">

				</p>
			</div>
		</div>
	);
}