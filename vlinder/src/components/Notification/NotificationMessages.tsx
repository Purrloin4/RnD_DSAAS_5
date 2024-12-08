import React, { Suspense } from "react";
import ListNotifications from "./ListNotifications";
import { createClient } from "@/utils/supabase/server";
import InitNotifications from "@/utils/store/InitNotifications";
// import { LIMIT_MESSAGE } from "@/utils/constant";

export default async function NotificationMessages() {
	const supabase = createClient();

	const { data } = await supabase
		.from("notifications")
		.select("*,profiles(*)")
		// .range(0, LIMIT_MESSAGE)
		.order("created_at", { ascending: false });

	return (
		<Suspense fallback={"loading.."}>
			<ListNotifications />
			<InitNotifications notifications={data?.reverse() || []} />
		</Suspense>
	);
}