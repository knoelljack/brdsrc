'use client';

import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadCloudProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSizeBytes?: number;
  className?: string;
  initialImages?: File[];
}

export default function ImageUploadCloud({
  onImagesChange,
  maxImages = 5,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB
  className = '',
  initialImages = [],
}: ImageUploadCloudProps) {
  const [images, setImages] = useState<File[]>(initialImages);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<string>('');

  // Generate previews when images change
  React.useEffect(() => {
    const readers: FileReader[] = [];
    const newPreviews: string[] = [];
    images.forEach((file, idx) => {
      const reader = new FileReader();
      readers.push(reader);
      reader.onload = e => {
        if (typeof e.target?.result === 'string') {
          newPreviews[idx] = e.target.result;
          // Only update previews when all are loaded
          if (
            newPreviews.length === images.length &&
            !newPreviews.some(p => p === undefined)
          ) {
            setPreviews([...newPreviews]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    if (images.length === 0) setPreviews([]);
    return () => readers.forEach(r => r.abort());
  }, [images]);

  const compressImage = async (file: File): Promise<File> => {
    // If file is already small enough, return as is
    if (file.size <= 1024 * 1024) {
      // 1MB
      return file;
    }

    const options = {
      maxSizeMB: 1, // Compress to max 1MB
      maxWidthOrHeight: 1920, // Good quality for web display
      useWebWorker: true,
      quality: 0.8, // Good balance between quality and size
    };

    try {
      const compressedFile = await imageCompression(file, options);

      // Create a new File object with the original name
      const newFile = new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: Date.now(),
      });

      return newFile;
    } catch (error) {
      console.error('Compression failed:', error);
      // If compression fails, return original file
      return file;
    }
  };

  const processFiles = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsCompressing(true);
    const validFiles: File[] = [];

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setCompressionProgress(
          `Processing image ${i + 1} of ${acceptedFiles.length}...`
        );

        // Check for HEIC files
        const isHeicFile =
          file.type === 'image/heic' ||
          file.type === 'image/heif' ||
          /\.(heic|heif)$/i.test(file.name);

        if (isHeicFile) {
          alert(
            `${file.name} is a HEIC file. Please convert it to JPEG in your Photos app first:\n\n1. Open Photos app\n2. Select the photo\n3. Tap Share → Save to Files → Choose JPEG format\n4. Then upload the converted file here.`
          );
          continue;
        }

        // Compress the image
        const processedFile = await compressImage(file);

        // Check final file size after compression
        if (processedFile.size > maxSizeBytes) {
          alert(
            `${file.name} is still too large after compression. Maximum size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB`
          );
          continue;
        }

        validFiles.push(processedFile);
      }

      if (validFiles.length > 0) {
        const newImages = [...images, ...validFiles];
        setImages(newImages);
        onImagesChange(newImages);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('There was an error processing your images. Please try again.');
    } finally {
      setIsCompressing(false);
      setCompressionProgress('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const onDrop = useCallback(processFiles, [
    images,
    maxImages,
    maxSizeBytes,
    onImagesChange,
  ]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: maxImages,
    disabled: images.length >= maxImages || isCompressing,
  });

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Photos
      </h3>

      {isCompressing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 text-sm font-medium">
              {compressionProgress || 'Compressing images...'}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Large images are being compressed to improve upload speed
          </p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${images.length >= maxImages || isCompressing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isDragActive ? (
            <p className="text-gray-600">Drop the images here...</p>
          ) : isCompressing ? (
            <p className="text-gray-600">Processing images...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-sm text-gray-500">
                Images only, up to {maxImages} files, max{' '}
                {Math.round(maxSizeBytes / 1024 / 1024)}MB each
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Large images will be automatically compressed
              </p>
            </div>
          )}
        </div>
      </div>
      {previews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Selected Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isCompressing}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Photo Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Take photos in good lighting</li>
          <li>• Show the board from multiple angles</li>
          <li>• Include close-ups of any damage or wear</li>
          <li>• Show fin setup and tail/nose details</li>
          <li>• Large photos from phones will be automatically compressed</li>
        </ul>
      </div>
    </div>
  );
}
