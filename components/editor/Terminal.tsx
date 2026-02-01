"use client";
import { useEffect, useRef } from "react";
// @ts-ignore
import "asciinema-player/dist/bundle/asciinema-player.css";

type TerminalProps = {
  src: string;
  rows?: number;
  cols?: number;
  autoPlay?: boolean;
  loop?: boolean;
};

export default function Terminal({ 
  src, 
  rows = 20, 
  cols = 80, 
  autoPlay = false, 
  loop = false 
}: TerminalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is still on screen

    const initPlayer = async () => {
      if (!ref.current) return;

      // 1. Load the library
      // @ts-ignore
      const AsciinemaPlayer = (await import("asciinema-player")).create;

      // 2. Safety Check: If user left the page while loading, stop here.
      if (!isMounted) return;

      // 3. CRITICAL FIX: Clear the div before adding a new player.
      // This removes any "ghost" players from previous renders.
      ref.current.innerHTML = '';

      // 4. Create the player
      playerRef.current = AsciinemaPlayer(src, ref.current, {
        cols: cols,
        rows: rows,
        autoPlay: autoPlay,
        loop: loop,
        theme: 'dracula', 
        terminalFontFamily: "'JetBrains Mono', Consolas, monospace",
      });
    };

    initPlayer();

    // Cleanup function
    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, rows, cols, autoPlay, loop]);

  return (
    <div className="my-10 overflow-hidden rounded-lg border border-zinc-800 bg-[#282a36] shadow-2xl">
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-2">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-zinc-500">zsh — {cols}x{rows}</div>
        <div className="w-12" />
      </div>

      {/* The Player Container */}
      <div ref={ref} />
    </div>
  );
}