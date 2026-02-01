"use client"
import React from "react";

import { toast } from "@/components/ui/use-toast";
import { defaultlesson } from "@/lib/data";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { createlesson } from "@/lib/actions/blog";import { useRouter } from "next/navigation";
import ChapterEditform from "../../EditLesson/ChapterEditform";
export default function CreateForm({ params }: { params: { id : string } }) {
	const router = useRouter();

	// const onHandleSubmit = async (data: Chapterformschematype) => {
	// 	console.log("submit button pressed")
	// 	try {
	// 		const result = await createlesson(data);	
	// 		if (!result) {
	// 			throw new Error("No response received from server.");
	// 		}
	
	// 		const parsedResult = result;
	
	// 		const { error } = parsedResult as PostgrestSingleResponse<null>;
	// 		if (error?.message) {
	// 			toast({
	// 				title: "Fail to create a post 😢",
	// 				description: (
	// 					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
	// 						<code className="text-white">{error.message}</code>
	// 					</pre>
	// 				),
	// 			});
	// 		} else {
	// 			toast({
	// 				title: "Successfully create a post 🎉",
	// 				description: data.chapter_name,
	// 			});
	// 			router.push(`/dashboard/course/build/${data.course_id}`);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error occurred while handling submit:", error);
	// 		// Handle error appropriately, such as displaying an error message to the user
	// 	}
	// };
	return (
		<div className="pt-[60px]">
	{/* <NewBlogForm/> */}

		<ChapterEditform/>
			</div>
	);

}
