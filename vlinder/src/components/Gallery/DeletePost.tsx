"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import {useUser} from "@/utils/store/user";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeletePost({
	post_by,
	image,
}: {
	post_by: string;
	image: string;
}) {
    const user = useUser((state) => state.user);

	// const { data: user, isFetching } = useUser();
	const router = useRouter();

	const handleDelete = async () => {
		const supabase = createClient();
		const { error } = await supabase.storage.from("images").remove([image]);

		if (error) {
			toast.error(error.message);
		} else {
			toast.success("Succcesfully remove image");
			router.refresh();
		}
	};

	
	if (user?.id === post_by) {
		return (
			<div className=" absolute top-0 right-5">
				<Button onClick={handleDelete}>Delete</Button>
			</div>
		);
	}
	else{
		return(
			<></>
		)
	}
	return <></>;
}