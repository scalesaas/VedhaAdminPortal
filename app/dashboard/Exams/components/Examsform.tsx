"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, otherwise use Input
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import dynamic from "next/dynamic";
import { onUploadImageAction } from "../../blog/components/feats/file/actions/image-upload.action";
import ImageGallery from "../../links/components/ImageGallery";
import { 
  Save, 
  FileText, 
  Calendar,
  Image as ImageIcon,
  Loader2,
  Trash2,
  X,
  Globe,
  BookOpen,
  Video,
  List
} from "lucide-react";

// --- Types based on your Exams Table Schema ---
interface IExamDetail {
    title: string;
    slug: string;
    icon_url: string;
    short_description: string;
    category: string;
    exam_date: string;
    application_start_date: string;
    application_end_date: string;
    official_website_url: string;
    syllabus_pdf_url: string;
    roadmap_video_url: string;
    author: string;
    created_at: string;
}

interface ExamFormSchemaType {
    title: string;
    slug: string;
    icon_url: string;
    short_description: string;
    category: string;
    exam_date: string;
    application_start_date: string;
    application_end_date: string;
    official_website_url: string;
    syllabus_pdf_url: string;
    roadmap_video_url: string;
    author: string;
    created_at: string;
}

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface ExamFormProps {
  defaultExam?: IExamDetail; // Made optional for create mode
  onHandleSubmit: (data: ExamFormSchemaType) => void;
}

export default function ExamForm({ onHandleSubmit, defaultExam }: ExamFormProps) {
  const [isPending, startTransition] = useTransition();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showImageGallery, setShowImageGallery] = useState(false);

  const user = useUser((state) => state.user);

  const form = useForm<ExamFormSchemaType>({
    mode: "all",
    defaultValues: {
      title: defaultExam?.title || "",
      slug: defaultExam?.slug || "",
      icon_url: defaultExam?.icon_url || "",
      short_description: defaultExam?.short_description || "",
      category: defaultExam?.category || "Other",
      exam_date: defaultExam?.exam_date || "",
      application_start_date: defaultExam?.application_start_date || "",
      application_end_date: defaultExam?.application_end_date || "",
      official_website_url: defaultExam?.official_website_url || "",
      syllabus_pdf_url: defaultExam?.syllabus_pdf_url || "",
      roadmap_video_url: defaultExam?.roadmap_video_url || "",
      author: defaultExam?.author || "",
      created_at: defaultExam?.created_at || "",
    },
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = (data: ExamFormSchemaType) => {
    startTransition(() => {
      onHandleSubmit(data);
    });
  };

  // Auto-generate Metadata (Slug, Author, Created At)
  useEffect(() => {
    const title = form.getValues().title;
    const currentSlug = form.getValues().slug;

    // Only auto-generate slug if it's empty (create mode) or if user hasn't manually edited it yet
    if (title && !currentSlug && user?.id) {
      const slug = slugify(title, { lower: true, strict: true });
      form.setValue("slug", slug);
      form.setValue("author", user?.id);
      form.setValue("created_at", new Date().toISOString());
    }
  }, [form.watch('title'), user?.id, form]);

  const examIcon = form.watch('icon_url');

  const handleImageSelect = useCallback((url: string) => {
    form.setValue("icon_url", url, { shouldValidate: true });
    setShowImageGallery(false);
  }, [form]);

  return (
    <div className="pt-6 px-6 bg-gray-50 text-gray-700 min-h-screen">
      
      {/* Header & Status Bar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-bold text-xl">Create New Exam</span>
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
                    {isPending ? "Saving..." : "Save Exam"}
                </Button>
            </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- LEFT COLUMN: Core Details --- */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* SECTION 1: Basic Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                    <FileText className="w-5 h-5 text-gray-500" /> Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Exam Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. JEE Mains 2025" {...field} className="text-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL Friendly)</FormLabel>
                          <FormControl>
                            <Input placeholder="jee-mains-2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            {/* Simple Select using Tailwind/HTML */}
                            <select 
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Other">Select Category...</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Medical">Medical</option>
                                <option value="Civil Services">Civil Services</option>
                                <option value="Defense">Defense</option>
                                <option value="School Board">School Board</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="short_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="Brief summary of the exam for the card view..." 
                            {...field} 
                            className="h-24 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* SECTION 2: Important Dates */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                    <Calendar className="w-5 h-5 text-gray-500" /> Important Dates
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="exam_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="application_start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App. Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="application_end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>App. End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>

              {/* SECTION 3: Resource Links */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                    <List className="w-5 h-5 text-gray-500" /> Important Links
                </h2>
                
                <FormField
                    control={form.control}
                    name="official_website_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Globe className="w-4 h-4"/> Official Website URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="syllabus_pdf_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><FileText className="w-4 h-4"/> Syllabus PDF URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="roadmap_video_url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2"><Video className="w-4 h-4"/> Strategy/Roadmap Video URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

            </div>
            
            {/* --- RIGHT COLUMN: Image & Metadata --- */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Image Upload */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                        <ImageIcon className="w-5 h-5 text-gray-500" /> Exam Icon/Logo
                    </h2>
                    
                    <div className="space-y-3">
                        {examIcon ? (
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300 shadow-md bg-gray-50 p-4">
                            <img 
                            src={examIcon} 
                            alt="Exam Icon" 
                            className="w-full h-full object-contain" 
                            />
                            <Button
                                type="button"
                                onClick={() => form.setValue('icon_url', '', { shouldValidate: true })}
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full h-8 w-8 z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        ) : (
                        <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50">
                            <p>No Icon Selected</p>
                        </div>
                        )}
                        
                        <Button
                        type="button"
                        onClick={() => setShowImageGallery(true)}
                        variant="outline"
                        className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {examIcon ? 'Change Icon' : 'Select Icon'}
                        </Button>
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-sm text-gray-500">
                    <p>Created by User ID: {user?.id || 'Pending...'}</p>
                    <p className="mt-2">Date: {new Date().toLocaleDateString()}</p>
                </div>

            </div>
          </div>
          
          {/* Mobile Submit Button */}
          <div className="block lg:hidden pt-4">
            <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Saving..." : "Save Exam"}
            </Button>
          </div>
          
        </form>
      </Form>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl max-h-[95vh] w-full overflow-hidden shadow-2xl">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-800">Select Exam Icon</h2>
              </div>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
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

      <Footer/>
    </div>
  );
}