import React from "react";
import {Button } from "@nextui-org/button";
import { createClient } from "@/utils/supabase/client";
import { LIMIT_NOTIFICATION } from "@/utils/constant/constants";
import { getFromAndTo } from "@/utils/utils";
import { useNotifications } from "@/utils/store/notifications";
import { toast } from "sonner";

export default function LoadMoreNotifications() {
	const page = useNotifications((state) => state.page);
	const setMesssages = useNotifications((state) => state.setNotifications);
	const hasMore = useNotifications((state) => state.hasMore);

	const fetchMore = async () => {
		const { from, to } = getFromAndTo(page, LIMIT_NOTIFICATION);

		const supabase = createClient()
		const { data, error } = await supabase
			.from("notifications")
			.select("*,profiles(*)")
			.range(from, to)
			.order("created_at", { ascending: false });

		if (error) {
			toast.error(error.message);
		} else {
			setMesssages(data.reverse());
		}
	};

	if (hasMore) {
		return (
			<Button variant="flat" className="w-full" onClick={fetchMore}>
				Load More
			</Button>
		);
	}
	return <></>;
}