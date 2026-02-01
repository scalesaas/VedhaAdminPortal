"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import dynamic from "next/dynamic";
import { onUploadImageAction } from "./feats/file/actions/image-upload.action";
import ImageGallery from "./ImageGallery";
import { 
  Save, 
  FileText, 
  Calendar,
  Hash,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
  Trash2,
  X
} from "lucide-react";

interface ILinksDetial {
    title: string;
    image: string;
    link: string;
    status: string;
    author: string;
    created_at: string;
}

interface Linksformschematype {
    title: string;
    image: string;
    link: string;
    status: string;
    author: string;
    created_at: string;
}

// Dynamic Import for the Image Gallery component
// const ImageGallery = dynamic(() => import("./ImageGallery"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface NewsFormProps {
  defaultlink: ILinksDetial;
  onHandleSubmit: (data: Linksformschematype) => void;
}

export default function NewsForm({ onHandleSubmit, defaultlink }: NewsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showImageGallery, setShowImageGallery] = useState(false);

  const user = useUser((state) => state.user);

  const form = useForm<Linksformschematype>({
    mode: "all",
    defaultValues: {
      title: defaultlink?.title || "",
      image: defaultlink?.image || "",
      link: defaultlink?.link || "",
      status: defaultlink?.status || "",
      author: defaultlink?.author || "",
      created_at: defaultlink?.created_at || "",
    },
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = (data: Linksformschematype) => {
    startTransition(() => {
      onHandleSubmit(data);
    });
  };

  // Auto-generate metadata (Slug, Author, Created At)
  useEffect(() => {
    const title = form.getValues().title;
    if (title && user?.id) {
      const slug = slugify(title, { lower: true }) + '-' + user?.id.slice(0, 5);
      form.setValue("author", user?.id);
      form.setValue("created_at", new Date().toISOString());
    }
  }, [form.watch('title'), user?.id, form]);

  const newsImage = form.watch('image');

  const handleImageSelect = useCallback((url: string) => {
    form.setValue("image", url, { shouldValidate: true });
    setShowImageGallery(false);
  }, [form]);

  return (
    <div className="pt-6 px-6 bg-gray-50 text-gray-700 min-h-screen">
      
      {/* Header & Status Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-bold text-xl">Create New Linkage</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-sm text-gray-500 hidden sm:block">
                 {currentTime.toLocaleTimeString()} | {user?.email || "Guest"}
               </div>
                {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!form.formState.isValid || isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Saving..." : "Save job Link"}
                </Button>
            </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-5xl mx-auto">
          
          {/* Main Inputs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT SIDE: Inputs (Title and Link) */}
            <div className="lg:col-span-2 space-y-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                  <FileText className="w-5 h-5 text-gray-500" /> News Details
              </h2>
              
              {/* 1. News Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-1">
                        Title of News
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the main headline..."
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 text-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* 2. News Link (The main content) */}
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-1">
                        Article URL (External Link)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., https://example.com/sarkari-job-article-link"
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                        type="url"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Read-Only Metadata */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className='flex items-center gap-2'>
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Created At: {new Date(form.getValues().created_at || new Date()).toLocaleDateString()}
                  </div>
              
              </div>

            </div>
            
            {/* RIGHT SIDE: Image Upload & Preview */}
            <div className="lg:col-span-1 space-y-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-fit sticky top-24">
              
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                  <ImageIcon className="w-5 h-5 text-gray-500" /> Feature Image
              </h2>
              
              <div className="space-y-3">
                
                {/* Image Preview */}
                {newsImage ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 shadow-md">
                    <img 
                      src={newsImage} 
                      alt="News Feature" 
                      className="w-full h-full object-cover" 
                    />
                    <Button
                        type="button"
                        onClick={() => form.setValue('image', '', { shouldValidate: true })}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-8 w-8 z-10"
                        title="Remove Image"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50">
                    <p>No Image Selected</p>
                  </div>
                )}
                
                {/* Gallery Button */}
                <Button
                  type="button"
                  onClick={() => setShowImageGallery(true)}
                  variant="outline"
                  className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {newsImage ? 'Change Image' : 'Select from Gallery / Upload'}
                </Button>
                
                {/* Image URL Display */}
                {newsImage && (
                    <div className="bg-gray-100 p-2 rounded-md text-xs text-gray-700 break-all border border-gray-200">
                        URL: {newsImage}
                    </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submission Button (Duplicate for bottom of form convenience) */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Saving..." : "Save News Link"}
            </Button>
          </div>
          
        </form>
      </Form>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl max-h-[95vh] w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Image Gallery & Uploader</h2>
              </div>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content - Passing the selection handler */}
            <div className="overflow-y-auto h-[calc(95vh-76px)]">
<ImageGallery 
    onUploadImageAction={onUploadImageAction}
    className="border-0 shadow-none rounded-none"
    onSelect={handleImageSelect} 
  />
  
          </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer/>
    </div>
  );
}