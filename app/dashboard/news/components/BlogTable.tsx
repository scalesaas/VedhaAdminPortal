import React from "react";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteAlert from "./DeleteAlert";
import { readnewsbyadmin, updateBlogById } from "@/lib/actions/blog";
import supabase from "@/utils/supabase/supabase";
export default async function NewsTable() {

    const { data: newses } = await readnewsbyadmin();
	return (
		<>
			<div className="rounded-md bg-graident-dark border-[0.5px] overflow-y-scroll ">
				<div className="w-[800px] md:w-full">
					<div className="grid grid-cols-5 border-b p-5 dark:text-gray-500">
						<h1 className=" col-span-2">Title</h1>
					</div>
					<div className="space-y-10 p-5">
						{newses?.map((news, index) => {
							
							return (
								<div className="grid grid-cols-5" key={index}>
									<h1 className="dark:text-gray-200 col-span-2 font-lg font-medium">
										{news.title}
									</h1>

									<Actions id={news.id } slug={news.slug} />
								</div>
							);	
						})}
					</div>
				</div>
			</div>
		</>
	);
}

const Actions = ({ id, slug }: { id: string; slug: string } ) => {
	return (
		<div className="flex items-center gap-2 md:flex-wrap">
			{/* TODO: change to id */}
			<Link href={`/blog/${slug}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<EyeOpenIcon />
					View
				</Button>
			</Link>
			<DeleteAlert id={id} />

			<Link href={`/dashboard/news/edit/${slug}`}>
				<Button className="flex gap-2 items-center" variant="outline">
					<Pencil1Icon />
					Edit
				</Button>
			</Link>
		</div>
	);
};
