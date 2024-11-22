import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/utils/store/InitMessages";
import { LIMIT_MESSAGE } from "@/utils/constant";
export default async function ChatMessages() {
	const supabase = createClient();

	const { data } = await supabase
		.from("messages")
		.select("*,profiles(*)")
		.range(0, LIMIT_MESSAGE)
		.order("created_at", { ascending: false });

	return (
		<Suspense fallback={"loading.."}>
			<ListMessages />
			<InitMessages messages={data?.reverse() || []} />
		</Suspense>
	);
}