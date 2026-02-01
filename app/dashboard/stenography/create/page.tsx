"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { CreateStenoData , createStenoExercise } from "@/lib/actions/blog";
import StenoForm from "../components/stenoform";

interface CreateStenoFormProps {
  initialData: any;
}

export default function CreateStenoForm({ initialData }: CreateStenoFormProps) {
  const router = useRouter();

  const onHandleSubmit = async (data: CreateStenoData) => {
    try {
      // 1. Call Server Action
      const result = await createStenoExercise(data);

	  console.log("Result from createStenoExercise:", result);

      // 2. Handle Error
      if (result?.error) {
        toast({
          title: "Failed to create dictation 😢",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">some thing went wrong</code>
            </pre>
          ),
          variant: "destructive",
        });
      } else {
        // 3. Handle Success
        toast({
          title: "Dictation published! 🎙️",
          description: `"${data.title}" is now live.`,
        });
        
        router.push("/steno/dashboard"); // Redirect to steno dashboard
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error occurred while submitting:", error);
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <StenoForm 
      onHandleSubmit={onHandleSubmit} 
      defaultData={initialData} 
    />
  );
}