import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Copy, Check, Trash2, Eye, Grid, List, Image, CheckCircle, FileCode } from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  size?: number;
}

interface ImageGalleryProps {
  onUploadImageAction?: (formData: FormData) => Promise<{ 
    success: boolean; 
    message?: string; 
    url?: string;
    data?: { path?: string } | null;
  }>;
  className?: string;
  onSelect?: (url: string) => void; 
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ onUploadImageAction, className = '', onSelect }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const STORAGE_KEY = 'blog-image-urls';

  // Load images
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
    } catch (e) { console.error("Failed to load images", e); }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [images]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      let imageUrl = '';
      if (onUploadImageAction) {
        const result = await onUploadImageAction(formData);
        if (result.success) {
          imageUrl = result.url || result.data?.path || '';
        }
      } else {
        // Fallback to local Blob for preview purposes
        imageUrl = URL.createObjectURL(file);
      }

      if (imageUrl) {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: imageUrl,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size
        };
        setImages(prev => [newImage, ...prev]);
        setUploadSuccess("Image added successfully!");
        setTimeout(() => setUploadSuccess(null), 3000);
      }
    } catch (err) {
      setUploadError("Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Image className="w-4 h-4" /> Image Library
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="p-4 border-b">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*" 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Click to upload image</span>
            </>
          )}
        </button>
        {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
        {uploadSuccess && <p className="text-green-500 text-xs mt-2">{uploadSuccess}</p>}
      </div>

      {/* Gallery Grid/List */}
      <div className="p-4 max-h-[500px] overflow-y-auto bg-gray-50/30">
        {images.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Image className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No images yet</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 gap-4" : "flex flex-col gap-2"}>
            {images.map((img) => (
              <div 
                key={img.id} 
                className={`group relative bg-white border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                  viewMode === 'list' ? 'flex items-center p-2' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-12 h-12'} bg-gray-100 relative`}>
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  {onSelect && (
                    <div 
                      onClick={() => onSelect(img.url)}
                      className="absolute inset-0 bg-blue-600/0 hover:bg-blue-600/40 cursor-pointer flex items-center justify-center transition-all group"
                    >
                      <CheckCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="p-2 flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{img.filename}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {/* Copy MDX Button */}
                    <button
                      onClick={() => copyToClipboard(`![${img.filename}](${img.url})`, img.id + 'md')}
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Copy MDX"
                    >
                      {copiedUrl === img.id + 'md' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <FileCode className="w-3.5 h-3.5" />}
                    </button>
                    
                    {/* Copy Link Button */}
                    <button
                      onClick={() => copyToClipboard(img.url, img.id + 'url')}
                      className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Copy URL"
                    >
                      {copiedUrl === img.id + 'url' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => deleteImage(img.id)}
                      className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;