"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/store/user";
import { useForm } from "react-hook-form";
import { BsSave, BsBook } from "react-icons/bs";
import { readCatogries } from "@/lib/actions/blog";
import { Catagories } from "@/lib/types";
import slugify from "slugify";

// --- Updated Types for Spiritual Books ---
interface IBookSubmit {
  title: string;
  slug: string;
  author_sage: string; // The Sage or Translator
  scripture_type: string; // Veda, Upanishad, Purana, Itihasa
  description: string;
  cover_image: string;
  language: string;
  category_id: string;
  instructor: string;
  created_at: string;
  original_sanskrit_available: boolean;
}

interface BookFormProps {
  onHandleSubmit: (data: IBookSubmit) => void;
  defaultBook: IBookSubmit;
}

export default function BookForm({
  onHandleSubmit,
  defaultBook,
}: BookFormProps) {
  const user = useUser((state) => state.user);
  const [categories, setCategories] = useState<Catagories[]>([]);

  const form = useForm<IBookSubmit>({
    defaultValues: defaultBook,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await readCatogries();
      if (data) setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data: IBookSubmit) => {
    if (user?.id) {
      const instructor = user?.id;
      // Slug based on book title
      const slug = slugify(data.title, { lower: true, strict: true }) + "-" + Date.now();
      const created_at = new Date().toISOString().slice(0, 16);
      
      const newData = { ...data, instructor, created_at, slug };
      onHandleSubmit(newData);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-orange-100">
          
          {/* Header with Spiritual Theme */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <BsBook className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Add Sacred Scripture</h1>
                <p className="text-orange-100 text-sm">Contribute to the digital library of Indian Eternal Knowledge</p>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
            <div className="space-y-6">
              
              {/* Book Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Scripture Title (e.g., Shrimad Bhagavad Gita)</label>
                <Input
                  placeholder="Enter book title"
                  {...form.register("title", { required: true })}
                  className="focus:ring-orange-500 border-gray-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author/Sage */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Sage / Author / Translator</label>
                  <Input
                    placeholder="e.g. Ved Vyasa / Adi Shankara"
                    {...form.register("author_sage", { required: true })}
                    className="focus:ring-orange-500"
                  />
                </div>

                {/* Scripture Type */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Scripture Classification</label>
                  <select
                    {...form.register("scripture_type", { required: true })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Veda">Veda (Shruti)</option>
                    <option value="Upanishad">Upanishad</option>
                    <option value="Purana">Purana</option>
                    <option value="Itihasa">Itihasa (Ramayana/Mahabharata)</option>
                    <option value="Darshana">Darshana (Philosophy)</option>
                    <option value="Gita">Gita</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Summary & Significance</label>
                <textarea
                  placeholder="Describe the essence of this sacred text..."
                  {...form.register("description")}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select
                    {...form.register("category_id", { required: true })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Primary Language</label>
                  <Input
                    placeholder="Sanskrit, Hindi, English..."
                    {...form.register("language", { required: true })}
                    className="focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Cover Image URL</label>
                <Input
                  type="url"
                  placeholder="https://image-link-to-book-cover.jpg"
                  {...form.register("cover_image")}
                  className="focus:ring-orange-500"
                />
              </div>

              {/* Original Sanskrit Toggle */}
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <input
                  type="checkbox"
                  id="sanskrit"
                  {...form.register("original_sanskrit_available")}
                  className="w-5 h-5 accent-orange-600"
                />
                <label htmlFor="sanskrit" className="text-sm font-medium text-orange-900">
                  Does this version include original Sanskrit Shlokas?
                </label>
              </div>
            </div>

            {/* Submit Section */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-8">
              <p className="text-xs text-gray-500 italic">
                Note: Ensure the content respects the sanctity of the scriptures.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-8 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="flex items-center gap-2 px-10 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <BsSave />
                  Publish Scripture
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}