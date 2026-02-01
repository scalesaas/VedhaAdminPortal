"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function uploadAudioAction(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // 1. Validate File Type
  if (!file.type.startsWith("audio/")) {
    return { error: "Invalid file type. Please upload an audio file." };
  }

  const supabase = await createSupabaseServerClient();
  const uniqueId = nanoid(6);
  // Clean filename to remove spaces
  const filename = `${uniqueId}-${file.name.replace(/\s+/g, "-")}`;

  // 2. Upload to Supabase 'steno-audio' bucket
  const { data, error } = await supabase.storage
    .from("steno-audio") // Make sure this bucket exists!
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload Error:", error);
    return { error: "Failed to upload audio." };
  }

  // 3. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from("steno-audio")
    .getPublicUrl(filename);

  return { success: true, url: publicUrlData.publicUrl };
}