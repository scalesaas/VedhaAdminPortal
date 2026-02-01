"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback, useTransition, useMemo, useRef } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { IBlogDetial } from "@/lib/types";
import { BlogFormSchemaType } from "../schema";
import dynamic from "next/dynamic";
import { onUploadImageAction } from "./feats/file/actions/image-upload.action";
import { Copy, Check, Upload, X, Plus, Bot, Sparkles, FileUp, Link as LinkIcon } from 'lucide-react';
import Footer from "@/components/Footer";
import ImageGallery from "./ImageGallery";
import { 
  Terminal, 
  Code, 
  Eye, 
  Edit3, 
  Save, 
  FileText, 
  User, 
  Calendar,
  Hash,
  Globe,
  MessageCircle,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Loader2,
  PanelLeft,
  PanelRight,
  Monitor,
  Maximize2,
  Minimize2
} from "lucide-react";

const MdxEditor = dynamic(() => import("@/components/editor/mdx-editor"), { ssr: false });

// Add loading component for BlogBody
const BlogBody = dynamic(() => import("@/components/editor/BlogBody"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] bg-gray-50 border border-gray-200 rounded p-4 flex items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading preview...</span>
      </div>
    </div>
  )
});

interface BlogFormProps {
  defaultBlog: IBlogDetial;
  onHandleSubmit: (data: BlogFormSchemaType) => void;
}

export default function BlogForm({ onHandleSubmit, defaultBlog }: BlogFormProps) {
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isPending, startTransition] = useTransition();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- AI Feature States ---
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInputType, setAiInputType] = useState<'url' | 'pdf'>('url');
  const [aiUrl, setAiUrl] = useState('');
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const user = useUser((state) => state.user);

  const form = useForm<BlogFormSchemaType>({
    mode: "all",
    defaultValues: {
      title: defaultBlog?.title || "",
      image: defaultBlog?.image || "",
      status: defaultBlog?.status || true,
      author: defaultBlog?.author || "",
      content: defaultBlog?.content || "",
      meta_title: defaultBlog?.meta_tiltle || "",
      meta_description: defaultBlog?.meta_description || "",
      created_at: defaultBlog?.created_at || "",
      slug: defaultBlog?.slug || "",
      coments_enabled: defaultBlog?.coments_enabled || false,
    },
  });

  // Ensure component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = (data: BlogFormSchemaType) => {
    startTransition(() => {
      onHandleSubmit(data);
    });
  };

  const onChangeValue = useCallback((markdown: string) => {
    form.setValue("content", markdown);
    form.setValue("meta_description", markdown.slice(0, 160));
  }, [form]);

  useEffect(() => {
    if (form.getValues().title && user?.id) {
      const slug = slugify(form.getValues().title, { lower: true }) + user?.id;
      form.setValue("slug", slug);
      form.setValue("meta_title", form.getValues().title);
      form.setValue("author", user?.id);
      form.setValue("created_at", new Date().toISOString().slice(0, 16));
    }
  }, [form.getValues().title, user?.id, form]);

  // --- AI Handler ---
  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aiInputType === 'url' && !aiUrl) return;
    if (aiInputType === 'pdf' && !aiFile) return;

    setIsAiLoading(true);

    try {
      const formData = new FormData();
      formData.append('type', aiInputType);
      
      if (aiInputType === 'url') {
        formData.append('url', aiUrl);
      } else if (aiFile) {
        formData.append('file', aiFile);
      }

      // Replace this URL with your actual custom API endpoint
      const response = await fetch('/api/your-custom-ai-endpoint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI content");
      }

      const data = await response.json();      
      // Assuming api returns { markdown: "string" }
      // We append or replace content. Here we replace content or append to end.
      // Current logic: Replace content so user can edit newly generated stuff.
      if (data?.markdown) {
        const currentContent = form.getValues("content");
        // Option A: Append
        // form.setValue("content", currentContent + "\n\n" + data.markdown);
        
        // Option B: Replace (Clean slate) - Using this based on "copy that markdown in editor"
        form.setValue("content", data.markdown);
        
        setShowAiModal(false);
        // Reset states
        setAiUrl('');
        setAiFile(null);
      }

    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate content. Please check console.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAiFile(e.target.files[0]);
    }
  };

  const formStatus = form.formState.isValid ? "Ready" : "Invalid";
  const wordCount = form.getValues().content?.length || 0;

  // Memoize the BlogBody component to prevent unnecessary re-renders
  const memoizedBlogBody = useMemo(() => {
    const content = form.getValues().content || '';
    return <BlogBody source={content} />;
  }, [form.watch("content")]);

  // Toggle fullscreen for editor area
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className=" pt-6 px-6 bg-gray-50 text-gray-700">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="text-gray-800 font-medium">Blog Editor</span>
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString()} | {user?.email || "Guest"}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-3 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <span className={`${formStatus === "Ready" ? "text-green-600" : "text-orange-600"}`}>
                {formStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Mode:</span>
              <span className="text-blue-600 capitalize">
                {viewMode === 'split' ? 'Split View' : viewMode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Words:</span>
              <span className="text-gray-700">{wordCount}</span>
            </div>
          </div>
           
          <div className="flex items-center gap-2">
            {/* Build With AI Button */}
            <Button
              type="button"
              onClick={() => setShowAiModal(true)}
              variant="outline"
              size="sm"
              className="text-purple-700 border-purple-300 bg-purple-50 hover:bg-purple-100 hover:text-purple-800"
            >
              <Bot className="w-4 h-4 mr-2" />
              Build with AI
            </Button>

            <Button
              type="button"
              onClick={() => setShowImageGallery(!showImageGallery)}
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <ImageIcon className="w-4 h-4" />
              {showImageGallery ? 'Hide Gallery' : 'Gallery'}
            </Button>
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
            <span className="text-gray-600">
              {isPending ? "Saving..." : "Ready"}
            </span>
          </div>
        </div>
      </div>

      <Form {...form}>
        {/* Control Panel */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Mode Controls */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  type="button"
                  onClick={() => setViewMode('editor')}
                  variant={viewMode === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 ${viewMode === 'editor' ? 'bg-white text-green-600 shadow-sm' : ''}`}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Editor
                </Button>
                <Button
                  type="button"
                  onClick={() => setViewMode('split')}
                  variant={viewMode === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 ${viewMode === 'split' ? 'bg-white text-green-600  shadow-sm' : ''}`}
                >
                  <PanelLeft className="w-4 h-4 mr-1" />
                  Split
                </Button>
                <Button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 ${viewMode === 'preview' ? 'bg-white text-green-600  shadow-sm' : ''}`}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>

              <Button
                type="button"
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-1" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-1" />
                    Fullscreen
                  </>
                )}
              </Button>
            </div>
            
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isValid || isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-white pt-0' : 'p-6'}`}>
          <div className={`${isFullscreen ? 'h-full' : 'max-w-9xl mx-10'} space-y-6`}>
            
            {/* Title and Metadata - Hidden in fullscreen mode */}
            {!isFullscreen && (
              <>
                {/* Title Input */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">Title</span>
                  </div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter blog title..."
                            {...field}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Metadata Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">Slug</span>
                    </div>
                    <div className="text-gray-700 text-sm break-all">
                      {form.getValues().slug || "auto-generated"}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">Author</span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      {user?.email || "Unknown"}
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">Created</span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      {form.getValues().created_at ? 
                        new Date(form.getValues().created_at).toLocaleDateString() : 
                        "Now"
                      }
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Editor/Preview Panel - Split Layout */}
            <div className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${
              isFullscreen ? 'h-full' : ''
            }`}>
              
              {/* Header for the editor panel */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {viewMode === 'split' ? 'Editor & Preview' : 
                       viewMode === 'editor' ? 'Editor' : 'Preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        wordCount > 0 ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-500">
                        {wordCount > 0 ? 'Active' : 'Empty'}
                      </span>
                    </div>
                    {isFullscreen && (
                      <Button
                        type="button"
                        onClick={toggleFullscreen}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Split Layout Container */}
              <div className={`flex ${isFullscreen ? 'h-[calc(100%-60px)]' : 'min-h-[600px]'}`}>
                
                {/* Editor Panel */}
                <div className={`transition-all duration-300 border-r border-gray-200 ${
                  viewMode === 'preview' ? 'w-0 overflow-hidden' :
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                }`}>
                  <div className="h-full">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm text-gray-600 flex items-center gap-2">
                      <Edit3 className="w-3 h-3" />
                      Markdown Editor
                    </div>
                    <div className={`p-4 overflow-auto ${isFullscreen ? 'h-[calc(100%-40px)]' : 'h-[556px]'}`}>
                      <MdxEditor
                        key="editor"
                        defaultValue={form.getValues().content || ""}
                        onChange={onChangeValue}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className={`transition-all duration-300 ${
                  viewMode === 'editor' ? 'w-0 overflow-hidden' :
                  viewMode === 'split' ? 'w-1/2' : 'w-full'
                }`}>
                  <div className="h-full">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-sm text-gray-600 flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      Live Preview
                    </div>
                    <div className={`p-4 bg-white overflow-auto ${isFullscreen ? 'h-[calc(100%-40px)]' : 'h-[556px]'}`}>
                      {isClient ? (
                        <div className="prose prose-gray max-w-none
                          prose-headings:text-gray-800
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200
                          prose-blockquote:border-l-gray-400 prose-blockquote:bg-gray-50 prose-blockquote:pl-4
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-gray-800 prose-em:text-gray-600
                          prose-li:text-gray-700
                          prose-table:border-collapse
                          prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50
                          prose-td:border prose-td:border-gray-300 prose-td:p-2
                        ">
                          {memoizedBlogBody}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading preview...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Panel - Hidden in fullscreen mode */}
            {!isFullscreen && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Settings</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center gap-2">
                      {form.getValues().status ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span className={form.getValues().status ? "text-green-600" : "text-orange-600"}>
                        {form.getValues().status ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Comments:</span>
                    <div className="flex items-center gap-2">
                      {form.getValues().coments_enabled ? (
                        <MessageCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={form.getValues().coments_enabled ? "text-green-600" : "text-gray-500"}>
                        {form.getValues().coments_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>

      {/* Build With AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-800">Build with AI</h2>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-200 rounded-full"
                disabled={isAiLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
               <p className="text-sm text-gray-600 mb-4">
                 Provide a source, and our AI will generate the blog content for you.
               </p>

               {/* Tabs */}
               <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                 <button
                   onClick={() => setAiInputType('url')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                     aiInputType === 'url' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                   }`}
                 >
                   <LinkIcon className="w-4 h-4" />
                   Website URL
                 </button>
                 <button
                   onClick={() => setAiInputType('pdf')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                     aiInputType === 'pdf' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                   }`}
                 >
                   <FileUp className="w-4 h-4" />
                   PDF Document
                 </button>
               </div>

               <form onSubmit={handleAiSubmit} className="space-y-4">
                 {aiInputType === 'url' ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Page URL</label>
                      <Input 
                        placeholder="https://example.com/article"
                        value={aiUrl}
                        onChange={(e) => setAiUrl(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                 ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Upload PDF</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <Input 
                          type="file" 
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                        <FileUp className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {aiFile ? aiFile.name : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">PDF files only</span>
                      </div>
                    </div>
                 )}

                 <div className="pt-2">
                   <Button 
                     type="submit" 
                     className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                     disabled={isAiLoading}
                   >
                     {isAiLoading ? (
                       <>
                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                         Generating Content...
                       </>
                     ) : (
                       <>
                         <Bot className="w-4 h-4 mr-2" />
                         Generate Markdown
                       </>
                     )}
                   </Button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">Image Gallery</h2>
                <span className="text-sm text-gray-500">
                  Manage your images for MDX editor
                </span>
              </div>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ImageGallery 
                onUploadImageAction={onUploadImageAction}
                className="border-0 shadow-none rounded-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer - Hidden in fullscreen mode */}
      {!isFullscreen && <Footer/>}
    </div>
  );
}