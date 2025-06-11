'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploadProps {
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    maxSizeBytes?: number;
    className?: string;
}

export default function ImageUpload({
    onImagesChange,
    maxImages = 5,
    maxSizeBytes = 5 * 1024 * 1024, // 5MB
    className = '',
}: ImageUploadProps) {
    const [images, setImages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStatus, setProcessingStatus] = useState<string>('');

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const convertHeicToJpeg = async (file: File): Promise<File> => {
        try {
            setProcessingStatus(`Converting ${file.name} to JPEG...`);

            // Dynamic import to avoid SSR issues
            const { default: heic2any } = await import('heic2any');
            const result = await heic2any({ blob: file });
            const convertedBlob = Array.isArray(result) ? result[0] : result;
            return new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg'), {
                type: 'image/jpeg',
            });
        } catch (error) {
            console.error('HEIC conversion failed:', error);
            throw new Error(
                `Failed to convert ${file.name}. Please convert to JPEG manually and try again.`
            );
        }
    };

    const processFiles = async (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setIsProcessing(true);
        setProcessingStatus('Processing images...');

        try {
            const processedImages: string[] = [];

            for (const file of acceptedFiles) {
                if (file.size > maxSizeBytes) {
                    alert(
                        `${file.name} is too large. Maximum size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB`
                    );
                    continue;
                }

                let processedFile = file;

                if (
                    file.type === 'image/heic' ||
                    file.name.toLowerCase().endsWith('.heic') ||
                    file.name.toLowerCase().endsWith('.heif')
                ) {
                    try {
                        processedFile = await convertHeicToJpeg(file);
                    } catch (error) {
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : 'Failed to convert HEIC file';
                        alert(`${errorMessage}`);
                        continue;
                    }
                }

                const base64 = await convertFileToBase64(processedFile);
                processedImages.push(base64);
            }

            const newImages = [...images, ...processedImages];
            setImages(newImages);
            onImagesChange(newImages);
        } catch (error) {
            console.error('Error processing files:', error);
            alert('Error processing images. Please try again.');
        } finally {
            setIsProcessing(false);
            setProcessingStatus('');
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
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif'],
        },
        maxFiles: maxImages,
        disabled: isProcessing || images.length >= maxImages,
    });

    return (
        <div className={className}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Photos
            </h3>
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                    ${isProcessing || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />
                {isProcessing ? (
                    <div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">{processingStatus}</p>
                    </div>
                ) : (
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
                        ) : (
                            <div>
                                <p className="text-gray-600 mb-2">
                                    <span className="font-medium">Click to upload</span> or drag
                                    and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                    Images only, up to {maxImages} files, max{' '}
                                    {Math.round(maxSizeBytes / 1024 / 1024)}MB each
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    For best results, convert HEIC photos to JPEG before uploading
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {images.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Uploaded Images ({images.length}/{maxImages})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={`Upload ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </ul>
            </div>
        </div>
    );
}
