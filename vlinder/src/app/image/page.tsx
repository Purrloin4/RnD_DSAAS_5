import Uploader from "@/src/components/Gallery/Uploader";
import { createClient } from "@/utils/supabase/server";
import React from "react";
import Image from "next/image";
import DeletePost from "@/src/components/Gallery/DeletePost";
export default async function page() {
	const supabase = createClient();
	const { data } = await supabase
		.from("posts")
		.select("*,profiles(*)")
		.order("created_at", { ascending: false });
	const imgeUrlHost =
		"https://abctwtskoufyjtelmfwd.supabase.co/storage/v1/object/public/images/";
		
	const posts = data?.map((post) => {
		return {
			image: `${post.post_by}/${post.id}/${post.name}`,
			...post,
		};
	});

	return (
		<div>
			<div className="grid grid-cols-3 gap-10">
				{posts?.map((post) => {
					return (
						<div
							key={post.id}
							className=" rounded-md w-full space-y-5 relative"
						>
							<div className="w-full h-96 relative rounded-md border">
								<Image
									src={imgeUrlHost + post.image}
									alt={post.description || ""}
									fill
									className=" rounded-md object-cover object-center"
								/>
							</div>
							<h1>@{post.profiles?.username}</h1>
							<DeletePost
								post_by={post.post_by}
								image={post.image}
							/>
						</div>
					);
				})}
			</div>
			<Uploader />
		</div>
	);
}