"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useUser } from "@/lib/store/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { uploadAudioAction } from "../../news/components/feats/file/actions/audiouploadfile";
import { CreateStenoData } from "@/lib/actions/blog";
import dynamic from "next/dynamic";
import { 
  Save, 
  Mic, 
  FileText, 
  Loader2, 
  UploadCloud, 
  CheckCircle, 
  Play, 
  Lock
} from "lucide-react";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

interface StenoFormProps {
  defaultData?: Partial<CreateStenoData>;
  onHandleSubmit: (data: CreateStenoData) => void;
}

export default function StenoForm({ onHandleSubmit, defaultData }: StenoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(defaultData?.audio_url || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const user = useUser((state) => state.user);

  const form = useForm<CreateStenoData>({
    mode: "all",
    defaultValues: {
      title: defaultData?.title || "",
      transcript: defaultData?.transcript || "",
      wpm: defaultData?.wpm || 80,
      difficulty: defaultData?.difficulty || "Medium",
      category: defaultData?.category || "General",
      is_premium: defaultData?.is_premium || false,
      audio_url: defaultData?.audio_url || "",
    },
  });

  // Handle File Upload Logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadAudioAction(formData);
      if (res.error) {
        setUploadError(res.error);
      } else if (res.url) {
        setAudioUrl(res.url);
        form.setValue("audio_url", res.url, { shouldValidate: true });
      }
    } catch (err) {
      setUploadError("Something went wrong uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: CreateStenoData) => {
    if (!audioUrl) {
      setUploadError("Please upload an audio file first.");
      return;
    }
    startTransition(() => {
      onHandleSubmit(data);
    });
  };

  return (
    <div className="pt-6 px-6 bg-gray-50 text-gray-700 min-h-screen">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-blue-500" />
              <span className="text-gray-800 font-bold text-xl">Create Steno Dictation</span>
            </div>
            <div className="flex items-center gap-4">
                {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={!form.formState.isValid || isPending || !audioUrl}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isPending ? "Publishing..." : "Publish Dictation"}
                </Button>
            </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 max-w-5xl mx-auto">
          
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Metadata & Transcript */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Info Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                 <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                    <FileText className="w-5 h-5 text-gray-500" /> Dictation Details
                 </h2>

                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Kailash Chandra Vol 1 - Ex 5" {...field} className="text-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wpm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Speed (WPM)</FormLabel>
                          <FormControl>
                             {/* Parse string input to number for react-hook-form */}
                            <Input 
                              type="number" 
                              placeholder="80" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
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
                            <select 
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="General">General</option>
                                <option value="Legal">Legal</option>
                                <option value="Parliamentary">Parliamentary</option>
                                <option value="Technical">Technical</option>
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                 </div>
              </div>

              {/* Transcript Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                    <FileText className="w-5 h-5 text-gray-500" /> Correct Transcript
                </h2>
                <FormField
                    control={form.control}
                    name="transcript"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paste Full Text</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="This text will be used to auto-grade the user's typing..." 
                            {...field} 
                            className="min-h-[300px] font-serif text-lg leading-relaxed p-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                 />
              </div>

            </div>

            {/* RIGHT COLUMN: Audio & Settings */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Audio Upload Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
                   <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
                      <Mic className="w-5 h-5 text-gray-500" /> Audio Source
                   </h2>

                   <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${audioUrl ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-blue-400 bg-gray-50'}`}>
                      {!audioUrl ? (
                        <label className="cursor-pointer block">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <UploadCloud className="w-6 h-6 text-blue-600" />}
                            </div>
                            <div>
                              <span className="text-gray-900 font-medium block text-sm">Upload MP3/WAV</span>
                              <span className="text-gray-500 text-xs">Max size 10MB</span>
                            </div>
                            <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
                          </div>
                        </label>
                      ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-700 justify-center">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold text-sm">Audio Ready</span>
                            </div>
                            <audio src={audioUrl} controls className="w-full h-8" />
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                type="button" 
                                onClick={() => { setAudioUrl(null); form.setValue("audio_url", ""); }}
                                className="w-full h-8"
                            >
                                Remove & Re-upload
                            </Button>
                        </div>
                      )}
                      {uploadError && <p className="text-red-500 text-xs mt-3">{uploadError}</p>}
                   </div>
                </div>

                {/* Difficulty & Premium Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-gray-800">Difficulty Level</FormLabel>
                          <div className="flex gap-2">
                             {['Easy', 'Medium', 'Hard'].map((level) => (
                               <label key={level} className={`flex-1 text-center py-2 text-sm border rounded-md cursor-pointer transition-colors ${field.value === level ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>
                                  <input 
                                    type="radio" 
                                    {...field} 
                                    value={level} 
                                    checked={field.value === level} 
                                    className="hidden" 
                                  />
                                  {level}
                               </label>
                             ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50/50 border-yellow-100">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                             <Lock className="w-4 h-4" />
                           </div>
                           <div>
                             <Label className="block font-semibold text-sm">Premium</Label>
                             <p className="text-xs text-gray-500">Paid users only</p>
                           </div>
                         </div>
                         <FormField
                            control={form.control}
                            name="is_premium"
                            render={({ field }) => (
                                <FormControl>
                                    <input 
                                        type="checkbox" 
                                        checked={field.value} 
                                        onChange={field.onChange}
                                        className="w-5 h-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500" 
                                    />
                                </FormControl>
                            )}
                         />
                    </div>
                </div>

            </div>
          </div>

          {/* Mobile Submit */}
          <div className="block lg:hidden pt-4">
             <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={!form.formState.isValid || isPending || !audioUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Publishing..." : "Publish Dictation"}
            </Button>
          </div>

        </form>
      </Form>
      
      <Footer/>
    </div>
  );
}