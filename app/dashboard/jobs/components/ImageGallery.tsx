import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Copy, Check, Trash2, Eye, Grid, List, Image, CheckCircle } from 'lucide-react';

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

// 2. DESTRUCTURE onSelect HERE
const ImageGallery: React.FC<ImageGalleryProps> = ({ onUploadImageAction, className = '', onSelect }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  // ... (keep all your existing state: uploading, errors, etc.) ...
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const STORAGE_KEY = 'blog-image-urls';

    // Load images from localStorage on component mount
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(STORAGE_KEY);
      if (savedImages && savedImages !== 'undefined' && savedImages !== 'null') {
        const parsedImages = JSON.parse(savedImages);
        if (Array.isArray(parsedImages)) {
          console.log('Loaded images from localStorage:', parsedImages.length);
          setImages(parsedImages);
        }
      }
    } catch (error) {
      console.error('Error loading saved images:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save images to localStorage whenever images array changes (but not on initial load)
  useEffect(() => {
    // Only save if images array is not empty or if we're explicitly clearing
    if (images.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
        console.log('Saved images to localStorage:', images.length);
      } catch (error) {
        console.error('Error saving images to localStorage:', error);
      }
    }
  }, [images]);

  // Enhanced upload function that handles both real uploads and local file display
  const handleImageUpload = async (formData: FormData): Promise<{ 
    success: boolean; 
    message?: string; 
    url?: string;
    data?: { path?: string } | null;
  }> => {
    const file = formData.get('image') as File;
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // If there's a custom upload function, try to use it first
    if (onUploadImageAction) {
      try {
        const result = await onUploadImageAction(formData);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn('Custom upload function failed, falling back to local display:', error);
      }
    }

    // Fallback: Create local object URL for immediate display
    // This is useful for development or when no server upload is available
    const objectUrl = URL.createObjectURL(file);
    
    return { 
      success: true, 
      message: 'Image loaded successfully (stored URL locally)', 
      data: { path: objectUrl }
    };
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Reset previous messages
    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await handleImageUpload(formData);

      if (result.success && (result.url || result.data?.path)) {
        const imageUrl = result.url || result.data?.path!;
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: imageUrl,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          size: file.size
        };

        setImages(prev => {
          const newImages = [newImage, ...prev];
          // Save to localStorage immediately
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
            console.log('Saved new image to localStorage');
          } catch (error) {
            console.error('Error saving new image to localStorage:', error);
          }
          return newImages;
        });
        setUploadSuccess((result.message || 'Image uploaded successfully!') + ' - URL saved to localStorage');
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => setUploadSuccess(null), 3000);
      } else {
        setUploadError(result.message || 'Failed to upload image');
        setTimeout(() => setUploadError(null), 5000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const copyMarkdownImage = async (image: UploadedImage) => {
    const markdownText = `![${image.filename}](${image.url})`;
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopiedUrl(image.url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy markdown:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = markdownText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(image.url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const deleteImage = (id: string) => {
    const imageToDelete = images.find(img => img.id === id);
    if (imageToDelete && imageToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.url);
    }
    
    const newImages = images.filter(img => img.id !== id);
    setImages(newImages);
    
    // Update localStorage immediately
    try {
      if (newImages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      console.log('Updated localStorage after deleting image');
    } catch (error) {
      console.error('Error updating localStorage after delete:', error);
    }
    
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const clearAllImages = () => {
    if (window.confirm('Are you sure you want to clear all saved images?')) {
      // Clean up any blob URLs
      images.forEach(image => {
        if (image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
      
      // Clear state first
      setImages([]);
      setSelectedImage(null);
      
      // Then clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Cleared all images from localStorage');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };

  const dismissMessage = (type: 'success' | 'error') => {
    if (type === 'success') {
      setUploadSuccess(null);
    } else {
      setUploadError(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageError = (image: UploadedImage, imgElement: HTMLImageElement) => {
    console.error('Image failed to load:', image.url);
    
    // Fallback to placeholder
    imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjNIMTJMMTAgMUg0QTIgMiAwIDAgMCAyIDNWMTNBMiAyIDAgMCAwIDQgMTVIMTlBMiAyIDAgMCAwIDIxIDEzWiIgZmlsbD0iI0Y3RjdGNyIgc3Ryb2tlPSIjRDFEMUQxIiBzdHJva2Utd2lkdGg9IjEiLz4KPHBhdGggZD0iTTkgMTBBMiAyIDAgMSAwIDcgOEEyIDIgMCAwIDAgOSAxMFoiIGZpbGw9IiNEMUQxRDEiLz4KPHBhdGggZD0iTTIxIDEzTDE2IDhMMTMgMTFMOSA3TDQgMTNIMjFaIiBmaWxsPSIjRDFEMUQxIi8+Cjwvc3ZnPgo=';
  };
  // ... (keep your useEffects and upload logic exactly as they are) ...
  // (Assuming useEffects, handleImageUpload, handleFileUpload, etc. remain unchanged)

  // ... (keep helper functions like copyToClipboard, deleteImage, etc.) ...

  // 3. CREATE A HANDLER FOR SELECTION VS PREVIEW
  const handleImageClick = (image: UploadedImage) => {
    if (onSelect) {
      onSelect(image.url); // Selects the image if the prop is present
    } else {
      setSelectedImage(image); // Opens preview if not selecting
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* ... (Keep Header and Upload Section exactly as is) ... */}

      {/* Images List */}
      <div className="p-4">
        {images.length === 0 ? (
          // ... (Empty state) ...
          <div className="text-center py-8 text-gray-500">
             <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
             <p>No images uploaded yet</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
            {images.map((image) => (
              <div
                key={image.id}
                className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center gap-4 p-3' : 'bg-white'
                } ${onSelect ? 'cursor-pointer ring-2 ring-transparent hover:ring-blue-500' : ''}`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden group">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        // 4. UPDATE CLICK HANDLER
                        onClick={() => handleImageClick(image)} 
                      />
                      
                      {/* 5. OPTIONAL: Add an overlay button for clear selection */}
                      {onSelect && (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">Select</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-800 truncate mb-1">
                        {image.filename}
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                         {/* 6. ADD A DEDICATED SELECT BUTTON */}
                         {onSelect && (
                            <button
                              onClick={() => onSelect(image.url)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center justify-center gap-1"
                              title="Select this image"
                            >
                              <CheckCircle className="w-3 h-3" /> Select
                            </button>
                         )}

                        {!onSelect && (
                            // Only show Copy/MD buttons if NOT in selection mode (optional, or keep them)
                            <>
                                <button onClick={() => copyToClipboard(image.url)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs transition-colors">
                                <Copy className="w-3 h-3 mx-auto" />
                                </button>
                                <button onClick={() => copyMarkdownImage(image)} className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 px-2 py-1 rounded text-xs transition-colors">
                                MD
                                </button>
                            </>
                        )}
                        
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteImage(image.id); }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded text-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // LIST VIEW UPDATE
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-full object-cover cursor-pointer"
                        // 7. UPDATE LIST VIEW CLICK
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                    {/* ... rest of list view info ... */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                       {onSelect && (
                            <button
                              onClick={() => onSelect(image.url)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Select
                            </button>
                       )}
                       {/* ... other buttons ... */}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ... (Keep Preview Modal as is) ... */}
    </div>
  );
};

export default ImageGallery;




























