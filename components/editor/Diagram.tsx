import { createClient } from "@supabase/supabase-js"; // Use the core library directly for public data
import DiagramViewer from "./DiagramViewer";
import { AlertCircle, FileQuestion } from "lucide-react";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getDiagramData(id: string) {
  try {
    const { data, error } = await supabase
      .from("diagrams")
      .select("scene_data")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Supabase Error [${id}]:`, error.message);
      return null;
    }
    return data?.scene_data;
  } catch (err) {
    console.error(`Unexpected Error [${id}]:`, err);
    return null;
  }
}

export default async function Diagram({ id }: { id: string }) {
  if (!id) return null;

  // 1. Fetch data
  const sceneData = await getDiagramData(id);

  // 2. Handle missing data (Prevent 500 crash)
  if (!sceneData) {
    return (
      <div className="my-8 flex h-32 w-full flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
        <FileQuestion className="mb-2 h-6 w-6 text-zinc-400" />
        <p className="text-sm font-medium text-zinc-600">Diagram Unavailable</p>
        <p className="text-xs text-zinc-400 font-mono mt-1">ID: {id}</p>
      </div>
    );
  }

  // 3. Render
  return <DiagramViewer data={sceneData} />;
}