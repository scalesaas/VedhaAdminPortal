"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { defaultBookData } from "@/lib/data"; // Updated to your new default book object
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import BookForm from "../compoennts/Booksform";
import { createBook } from "../../../../lib/actions/blog"; // Assuming you renamed the action
import { useRouter } from "next/navigation";
import { IBookSubmit } from "@/lib/types";

export default function CreateBookPage() {
    const router = useRouter();

    const onHandleSubmit = async (data: IBookSubmit) => {
        try {
            // Calling the server action to insert into the spiritual library
            const result = await createBook(data as any);    
            
            if (!result) {
                throw new Error("No response received from server.");
            }
    
            const { error } = result as PostgrestSingleResponse<null>;
            
            if (error?.message) {
                toast({
                    variant: "destructive",
                    title: "Failed to publish scripture 😢",
                    description: (
                        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                            <code className="text-white">{error.message}</code>
                        </pre>
                    ),
                });
            } else {
                toast({
                    title: "Scripture Published 🎉",
                    description: `${data.title} has been added to the library.`,
                });
                
                // Redirecting to the book library list
                router.push("/dashboard/books");
                router.refresh();
            }
        } catch (error) {
            console.error("Submission Error:", error);
            toast({
                variant: "destructive",
                title: "System Error",
                description: "Could not connect to the database. Please try again.",
            });
        }
    };

    return (
        <div className="min-h-screen pt-12 bg-orange-50/20">
            <BookForm
                onHandleSubmit={onHandleSubmit}
                defaultBook={defaultBookData} 
            />
        </div>
    );
}