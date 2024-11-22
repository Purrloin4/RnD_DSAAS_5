"use client";
import React from "react";
import {Input} from "@nextui-org/input";
   
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/utils/store/user";
import { Imessage, useMessage } from "@/utils/store/messages";

export default function ChatInput() {
	const user = useUser((state) => state.user);
	const addMessage = useMessage((state) => state.addMessage);
	const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
	const supabase = createClient();


	const handleSendMessage = async (content: string) => {
		if (content.trim()) {
			const id = uuidv4();
            // const room_id = uuidv4();
			const newMessage = {
				id,
				content,
				profile_id: user?.id,
				is_edit: false,
				created_at: new Date().toISOString(),
                // room_id,
				profiles: {
					id: user?.id,
					avatar_url: user?.user_metadata.avatar_url,
					updated_at: new Date().toISOString(),
					username: user?.user_metadata.user_name,
                    birthday: null,
                    disability:  null,
                    display_disability: null,
                    full_name:  null,
                    gender:  null,
                    hobbies:  null,
                    need_assistance: null,
                    role: user?.role,
                    sex_positive: null,
                    sexual_orientation:  null,
                    smoker: null,
				},
			};
			addMessage(newMessage as Imessage);
			setOptimisticIds(newMessage.id);
			const { error } = await supabase
				.from("messages")
				.insert({ content, id });
			if (error) {
				toast.error(error.message);
			}
		} else {
			toast.error("Message can not be empty!!");
		}
	};

	return (
		<div className="p-5">
			<Input
				placeholder="send message"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSendMessage(e.currentTarget.value);
						e.currentTarget.value = "";
					}
				}}
			/>
		</div>
	);
}