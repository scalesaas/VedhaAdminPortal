"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// 1. DELETE any "import type ..." lines related to Excalidraw here.

// 2. We use <any> here. This tells TypeScript to stop looking for specific 
//    type definitions that are causing the "Cannot find module" error.
const Excalidraw = dynamic<any>(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    ),
  }
);

interface DiagramViewerProps {
  data: any;
}

export default function DiagramViewer({ data }: DiagramViewerProps) {
  if (!data) return null;

  return (
    <div className="group relative my-10 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-between border-b border-zinc-100 bg-white/80 px-4 py-2 backdrop-blur-sm pointer-events-none">
        <div className="flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-zinc-300" />
           <span className="text-xs font-medium text-zinc-500 font-mono">THINKING BOARD</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[500px] w-full">
        <Excalidraw
          initialData={{
            elements: data.elements,
            appState: {
              ...data.appState,
              viewModeEnabled: true,
              zenModeEnabled: true,
              gridModeEnabled: false,
            },
            scrollToContent: true,
          }}
          viewModeEnabled={true}
          zenModeEnabled={true}
          gridModeEnabled={false}
        />
      </div>
    </div>
  );
}