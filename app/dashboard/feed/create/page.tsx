"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import FeedForm from "../components/feedform"; // Updated import name
// Assuming you update these action names in your blog.ts file
import { createFeedPost, type IFeedItem } from "../../../../lib/actions/blog"; 

export default function CreateFeedPage() {
    const router = useRouter();

    const onHandleSubmit = async (data: IFeedItem) => {
        console.log("Submitting feed post...");
        
        try {
            // Updated to call your feed-specific server action
            const result = await createFeedPost(data);  
            
            if (!result) {
                throw new Error("No response received from server.");
            }
    
            const { error } = result as PostgrestSingleResponse<null>;
            
            if (error?.message) {
                toast({
                    variant: "destructive",
                    title: "Failed to create feed post 😢",
                    description: (
                        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                            <code className="text-white">{error.message}</code>
                        </pre>
                    ),
                });
            } else {
                toast({
                    title: "Feed post published 🎉",
                    description: `Post "${data.title}" is now live on the mobile app.`,
                });
                
                // Refresh the page and redirect to the feed list
                router.push("/dashboard/feed"); 
                router.refresh();
            }
        } catch (error) {
            console.error("Critical error during submission:", error);
            toast({
                variant: "destructive",
                title: "System Error",
                description: "An unexpected error occurred. Please try again.",
            });
        }
    };

    return (
        <div className="min-h-screen mt-12 bg-slate-50">
            <FeedForm
                onHandleSubmit={onHandleSubmit}
                // defaultFeed can be passed if you want to pre-fill content
            />
        </div>
    );
}