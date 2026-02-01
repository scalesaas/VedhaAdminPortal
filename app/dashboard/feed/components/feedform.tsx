"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import dynamic from "next/dynamic";
import { 
  Save, 
  Image as ImageIcon,
  Loader2,
  Trash2,
  ExternalLink,
  LayoutGrid,
  Type,
  Send,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IFeedItem {
    title: string;
    slug: string;
    featured_image: string;
    content: string;
    category: "Update" | "News" | "Announcement" | "Article";
    cta_label?: string;
    cta_url?: string;
    is_published: boolean;
    author: string;
    created_at: string;
}

interface FeedFormProps {
  defaultFeed?: IFeedItem;
  onHandleSubmit: (data: IFeedItem) => void;
}

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function FeedForm({ onHandleSubmit, defaultFeed }: FeedFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showImageGallery, setShowImageGallery] = useState(false);
  const user = useUser((state) => state.user);

  const form = useForm<IFeedItem>({
    mode: "all",
    defaultValues: {
      title: defaultFeed?.title || "",
      slug: defaultFeed?.slug || "",
      featured_image: defaultFeed?.featured_image || "",
      content: defaultFeed?.content || "",
      category: defaultFeed?.category || "Update",
      cta_label: defaultFeed?.cta_label || "",
      cta_url: defaultFeed?.cta_url || "",
      is_published: defaultFeed?.is_published ?? true,
      author: defaultFeed?.author || "",
      created_at: defaultFeed?.created_at || "",
    },
  });

  const onSubmit = (data: IFeedItem) => {
    startTransition(() => {
      onHandleSubmit(data);
    });
  };

  useEffect(() => {
    const title = form.watch('title');
    if (title && !form.getValues().slug && user?.id) {
      form.setValue("slug", slugify(title, { lower: true, strict: true }));
      form.setValue("author", user?.id);
      form.setValue("created_at", new Date().toISOString());
    }
  }, [form.watch('title'), user?.id]);

  const featuredImage = form.watch('featured_image');

  return (
    <div className="pb-32 bg-slate-50 min-h-screen font-sans">
      
      {/* Page Title (Non-sticky) */}
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-indigo-100 rounded-lg">
             <Send className="w-5 h-5 text-indigo-600" />
           </div>
           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Feed Post</h1>
        </div>
        <p className="text-slate-500 ml-12">Compose a new update for the mobile app users.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 uppercase text-[11px] font-bold tracking-wider">Post Heading</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a catchy title..." {...field} className="text-xl font-semibold border-none px-0 focus-visible:ring-0 placeholder:opacity-50" />
                      </FormControl>
                      <div className="h-[1px] bg-slate-100 w-full" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 uppercase text-[11px] font-bold tracking-wider">Main Content</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="Tell your story..." 
                            {...field} 
                            className="min-h-[400px] text-lg border-none px-0 focus-visible:ring-0 resize-none placeholder:opacity-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Link Area */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 mb-6 uppercase tracking-tight">
                  <ExternalLink className="w-4 h-4" /> Link to external resource
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cta_label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-500">Button Text</FormLabel>
                          <FormControl><Input placeholder="e.g. Read Article" {...field} className="bg-slate-50 border-slate-100" /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cta_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-500">Target URL</FormLabel>
                          <FormControl><Input placeholder="https://..." {...field} className="bg-slate-50 border-slate-100" /></FormControl>
                        </FormItem>
                      )}
                    />
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <FormLabel className="text-slate-600 uppercase text-[11px] font-bold tracking-wider block mb-4">Featured Media</FormLabel>
                    <div className="space-y-4">
                        {featuredImage ? (
                        <div className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                            <img src={featuredImage} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="destructive" size="icon" onClick={() => form.setValue('featured_image', '')} className="rounded-full">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        ) : (
                        <button 
                            type="button"
                            onClick={() => setShowImageGallery(true)}
                            className="w-full aspect-[4/3] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 transition-all"
                        >
                            <ImageIcon className="w-8 h-8 mb-2 opacity-20 text-indigo-500" />
                            <span className="text-xs font-medium">Click to select image</span>
                        </button>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <FormLabel className="text-slate-600 uppercase text-[11px] font-bold tracking-wider block mb-4">Post Settings</FormLabel>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <select {...field} className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                             <option value="Update">General Update</option>
                             <option value="News">Latest News</option>
                             <option value="Announcement">Announcement</option>
                             <option value="Article">Article</option>
                          </select>
                        </FormItem>
                      )}
                    />
                </div>
            </div>
          </div>

          {/* FLOATING ACTION BAR */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center justify-between px-6">
                <div className="hidden md:block">
                    <p className="text-white text-sm font-medium">{form.watch('title') || 'Untitled Post'}</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest">{form.watch('category')}</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button type="button" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button 
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={!form.formState.isValid || isPending}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 ml-auto md:ml-0"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                </div>
            </div>
          </div>
        </form>
      </Form>
      <Footer/>
    </div>
  );
}