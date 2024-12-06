import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constant/constants";
import { Database } from "@/types/supabase";

export type Imessage = { 
	created_at: string;
	id: string;
	is_edit: boolean;
	profile_id: string;
	content: string;
	room_id:string;
	rooms:{
		id:string
		created_at: string | null
		name:string | null
	}|null;
		profiles: {
			avatar_url: string | null
			birthday: string | null
			disability: string[] | null
			display_disability: boolean | null
			full_name: string | null
			gender: Database["public"]["Enums"]["Gender"] | null
			id: string
			need_assistance: boolean | null
			organization_id: string | null
			role: string
			sex_positive: boolean | null
			sexual_orientation: string | null
			smoker: boolean | null
			updated_at: string | null
			username: string | null
	
	} | null;

};

interface MessageState {
	hasMore: boolean;
	page: number;
	messages: Imessage[];
	actionMessage: Imessage | undefined;
	optimisticIds: string[];
	addMessage: (message: Imessage) => void;
	setActionMessage: (message: Imessage | undefined) => void;
	optimisticDeleteMessage: (messageId: string) => void;
	optimisticUpdateMessage: (message: Imessage) => void;
	setOptimisticIds: (id: string) => void;
	setMesssages: (messages: Imessage[]) => void;
}

export const useMessage = create<MessageState>()((set) => ({
	hasMore: true,
	page: 1,
	messages: [],
	optimisticIds: [],
	actionMessage: undefined,
	setMesssages: (messages) =>
		set((state) => ({
			messages: [...messages, ...state.messages],
			page: state.page + 1,
			hasMore: messages.length >= LIMIT_MESSAGE,
		})),
	setOptimisticIds: (id: string) =>
		set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
	addMessage: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, newMessages],
		})),
	setActionMessage: (message) => set(() => ({ actionMessage: message })),
	optimisticDeleteMessage: (messageId) =>
		set((state) => {
			return {
				messages: state.messages.filter(
					(message) => message.id !== messageId
				),
			};
		}),
	optimisticUpdateMessage: (updateMessage) =>
		set((state) => {
			return {
				messages: state.messages.filter((message) => {
					if (message.id === updateMessage.id) {
						(message.content = updateMessage.content),
							(message.is_edit = updateMessage.is_edit);
					}
					return message;
				}),
			};
		}),
}));