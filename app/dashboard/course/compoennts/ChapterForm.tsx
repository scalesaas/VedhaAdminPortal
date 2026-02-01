"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback, useTransition, useMemo } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IchapterDetails, Catagories, IModule } from "@/lib/types";
import { Chapterformschematype } from "../../blog/schema";
import { readCatogries, readmodulescourse } from "@/lib/actions/blog";
import dynamic from "next/dynamic";
import { 
  Code, Eye, Edit3, Save, FileText, User, Calendar, Hash,
  Image as ImageIcon, Loader2, BookOpen, Layers, Tag, Video, 
  MousePointer2, Layout, Plus, Copy, Check
} from "lucide-react";
import ImageGallery from "../../blog/components/ImageGallery";
import { onUploadImageAction } from "../../blog/components/feats/file/actions/image-upload.action";

const MdxEditor = dynamic(() => import("@/components/editor/mdx-editor"), { ssr: false });
const BlogBody = dynamic(() => import("@/components/editor/BlogBody"), { ssr: false });

export default function ChapterForm({ id, onHandleSubmit, defaultlesson }: {
  id: string;
  defaultlesson: IchapterDetails;
  onHandleSubmit: (data: Chapterformschematype) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isPreview, setPreview] = useState(false);
  const [categories, setCategories] = useState<Catagories[]>([]);
  const [modulescourse, setModulecourse] = useState<IModule>();
  const [isClient, setIsClient] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const user = useUser((state) => state.user);

  const form = useForm<Chapterformschematype>({
    mode: "onChange", // Changed to onChange for better stability
    defaultValues: {
      catagory_id: defaultlesson?.catagory_id || 0,
      chapter_name: defaultlesson?.chapter_name || "",
      content: defaultlesson?.content || "",
      course_id: defaultlesson?.course_id || "",
      created_at: defaultlesson?.created_at || new Date().toISOString(),
      description: defaultlesson?.content || "",
      instructor: defaultlesson?.instructor || "",
      module_id: defaultlesson?.module_id || "",
      chapterno: defaultlesson?.chapterno || "",
      slug: defaultlesson?.slug || "",
      image: defaultlesson?.image || "",
    },
  });

  useEffect(() => { setIsClient(true); fetchCategories(); fetchmodulecourse(); }, []);

  const fetchCategories = async () => {
    const { data } = await readCatogries();
    if (data) setCategories(data);
  };

  const fetchmodulecourse = async () => {
    const { data } = await readmodulescourse(id);
    if (data) setModulecourse(data);
  };

  // Auto-generate slug and metadata
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "chapter_name" && value.chapter_name) {
        const generatedSlug = slugify(value.chapter_name, { lower: true }) + "-" + (user?.id?.slice(0, 5) || "");
        form.setValue("slug", generatedSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, user?.id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const components = [
    { name: "YouTube", icon: <Video className="w-4 h-4" />, snippet: '<video id="YOUR_VIDEO_ID" />' },
    { name: "Excalidraw", icon: <Layout className="w-4 h-4" />, snippet: '<excalidraw id="YOUR_DRAWING_ID" />' },
    { name: "Code Block", icon: <Code className="w-4 h-4" />, snippet: '```tsx\n// Your code here\n```' },
    { name: "Callout", icon: <FileText className="w-4 h-4" />, snippet: '> [!NOTE]\n> Your message here' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Chapter Content Editor</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Module: {modulescourse?.module_name || "Loading..."}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowImageGallery(true)} className="hidden md:flex gap-2 border-slate-200">
            <ImageIcon className="w-4 h-4" /> Gallery
          </Button>
          <div className="h-6 w-[1px] bg-slate-200 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => setPreview(!isPreview)} className="gap-2 text-slate-600">
            {isPreview ? <><Edit3 className="w-4 h-4" /> Write</> : <><Eye className="w-4 h-4" /> Preview</>}
          </Button>
          <Button size="sm" onClick={form.handleSubmit(onHandleSubmit)} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 shadow-md px-6">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Chapter
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components Drawer */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 hidden lg:block overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Components</h2>
          <div className="space-y-2">
            {components.map((comp) => (
              <button
                key={comp.name}
                onClick={() => copyToClipboard(comp.snippet, comp.name)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-slate-50 group border border-transparent hover:border-slate-100 transition-all"
              >
                <div className="flex items-center gap-3 text-slate-600">
                  {comp.icon}
                  <span className="text-sm font-medium">{comp.name}</span>
                </div>
                {copiedLabel === comp.name ? <Check className="w-3 h-3 text-green-500" /> : <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              Click any component to copy its MDX tag. Paste it directly into your editor.
            </p>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Form {...form}>
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Header Info Section */}
              <section className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <FormField
                  control={form.control}
                  name="chapter_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Chapter Title"
                          className="w-full text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-300 text-slate-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Metadata Strip */}
                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-50 text-slate-500">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{form.watch("slug") || "auto-generated-slug"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs">{user?.email?.split('@')[0] || "Instructor"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </section>

              {/* Chapter Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Layers className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Chapter Sequence</label>
                    <input type="number" {...form.register("chapterno")} className="w-full bg-transparent text-sm font-semibold focus:outline-none" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Tag className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                    <select {...form.register("catagory_id")} className="w-full bg-transparent text-sm font-semibold focus:outline-none appearance-none cursor-pointer">
                      <option value="">Choose category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* The Editor Canvas */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[700px] overflow-hidden">
                {isPreview ? (
                  <div className="p-8 prose prose-slate max-w-none prose-headings:font-bold prose-pre:bg-slate-900">
                    <BlogBody source={form.watch("content") || ""} />
                  </div>
                ) : (
                  <div className="p-2">
                     <MdxEditor
                        key="chapter-editor"
                        defaultValue={form.getValues().content || ""}
                        onChange={(val) => {
                          form.setValue("content", val);
                          form.setValue("description", val.slice(0, 160));
                        }}
                      />
                  </div>
                )}
              </div>
            </div>
          </Form>
        </main>
      </div>

      {/* Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Media Library</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowImageGallery(false)}>X</Button>
             </div>
             <div className="max-h-[70vh] overflow-y-auto">
                <ImageGallery onUploadImageAction={onUploadImageAction} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}