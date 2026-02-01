import { MDXRemote } from 'next-mdx-remote/rsc';
import React from 'react';
import YouTubeEmbed from './YouTubeEmbed';
import Diagram from './Diagram';
import { Copy, Check, TerminalIcon } from 'lucide-react'; 
import Terminal from './Terminal';

interface Props {
  source: string;
}

// --- Custom Components ---

// 1. Clean, Minimalist Table (Notion/Airtable style)
const Table = ({ headers, data }: { headers: string[], data: string[][] }) => (
  <div className="my-8 overflow-x-auto rounded-lg border border-zinc-200 shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-50 border-b border-zinc-200">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-6 py-3 font-semibold text-zinc-900 font-sans uppercase tracking-wider text-xs">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100 bg-white">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-zinc-50/50 transition-colors">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 text-zinc-600 font-serif whitespace-nowrap">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 2. Techy but Clean Code Block (Mac Light Mode Terminal)
const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="my-10 group relative rounded-xl border border-zinc-200 bg-zinc-50/50 shadow-sm overflow-hidden">
      {/* Window Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="ml-4 flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                <TerminalIcon size={12} />
                <span>terminal</span>
            </div>
        </div>
        <div className="text-xs text-zinc-400 font-mono">bash</div>
      </div>
      
      {/* Code Content */}
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-zinc-800">
            {children}
        </pre>
      </div>
    </div>
);

export default function BlogBody({ source }: Props) {
  return (
    <article className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-20">
      <MDXRemote 
        source={source} 
        components={{
          // --- Typography (Medium.com Style) ---
          
          // Headings: Sans-serif, Bold, Tight Tracking
          h1: ({ children }) => (
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-6 mt-12 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-sans text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight leading-tight mb-4 mt-10 border-b border-zinc-100 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-sans text-xl md:text-2xl font-semibold text-zinc-900 leading-snug mb-3 mt-8">
              {children}
            </h3>
          ),
          
          // Body: Serif, Large, Breathable
          p: ({ children }) => (
            <p className="font-serif text-lg md:text-[20px] leading-[1.8] text-zinc-800 mb-7 font-light antialiased">
              {children}
            </p>
          ),

          // Lists: Serif to match body
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-8 space-y-2 font-serif text-lg text-zinc-800 leading-relaxed marker:text-zinc-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-8 space-y-2 font-serif text-lg text-zinc-800 leading-relaxed marker:text-zinc-400 marker:font-sans">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-2">{children}</li>
          ),

          // --- Interactive & Visual Elements ---

          // Inline Code: Subtle highlighted background
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-pink-600 font-mono text-sm font-medium">
              {children}
            </code>
          ),
          
          // Block Code: Custom Component
          pre: ({ children }) => (
            <CodeBlock>{children}</CodeBlock>
          ),

          // Blockquote: Large, Center-aligned or Left-bar style
          blockquote: ({ children }) => (
            <blockquote className="relative my-10 pl-6 border-l-4 border-zinc-900 italic">
                <p className="font-serif text-2xl text-zinc-700 leading-relaxed">
                   {children}
                </p>
            </blockquote>
          ),

          // Links: Underlined with color
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-zinc-900 font-medium underline decoration-zinc-300 decoration-2 underline-offset-4 hover:decoration-green-500 hover:text-green-700 transition-all"
            >
              {children}
            </a>
          ),

          // Images: Rounded and Captioned
          img: ({ src, alt }) => (
            <figure className="my-10 -mx-4 md:-mx-10">
              <img 
                src={src} 
                alt={alt} 
                className="w-full h-auto rounded-lg shadow-sm border border-zinc-100"
              />
              {alt && (
                <figcaption className="mt-3 text-center text-sm font-sans text-zinc-500">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),

          // Separator: The classic "Three Dots"
          hr: () => (
            <div className="my-14 flex justify-center items-center gap-3 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            </div>
          ),

          // Tables
          table: ({ children }) => (
             <div className="my-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {children}
                </table>
             </div>
          ),
          thead: ({ children }) => <thead className="border-b-2 border-zinc-100">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-zinc-50 hover:bg-zinc-50/50">{children}</tr>,
          th: ({ children }) => <th className="py-3 px-4 font-sans font-bold text-sm uppercase tracking-wider text-zinc-900">{children}</th>,
          td: ({ children }) => <td className="py-3 px-4 font-serif text-base text-zinc-600">{children}</td>,

          // Custom Components passed through
          YouTubeEmbed,
          Table: Table,
          Diagram, // <--- Added here
          Terminal,
          
          // Callout Box (Optional Techy addition)
          Callout: ({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warn" }) => (
            <div className={`my-8 p-6 rounded-lg border flex gap-4 ${
                type === 'warn' 
                ? 'bg-amber-50 border-amber-200 text-amber-900' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
                <div className="font-serif text-lg leading-relaxed">{children}</div>
            </div>
          )
        }}
      />
    </article>
  );
}