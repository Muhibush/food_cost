import React, { useRef } from 'react';
import { Icon } from './Icon';
import { cn } from '../../utils/cn';
import { compressImage } from '../../utils/imageUtils';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    optional?: boolean;
    placeholder?: React.ReactNode;
    className?: string;
    previewClassName?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
    maxSize?: number;
    quality?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label,
    optional = false,
    placeholder,
    className,
    previewClassName,
    aspectRatio = 'square',
    maxSize = 800,
    quality = 0.6
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            try {
                const compressedBase64 = await compressImage(file, maxSize, quality);
                onChange(compressedBase64);
            } catch (error) {
                console.error("Failed to compress image", error);
            }
        }
    };

    const aspectRatioClass = {
        square: 'aspect-square',
        video: 'aspect-video',
        auto: 'h-48'
    }[aspectRatio];

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            {label && (
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide ml-1 flex items-center justify-between">
                    {label}
                    {optional && (
                        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest italic">(Optional)</span>
                    )}
                </label>
            )}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "w-full rounded-2xl border-2 border-dashed border-white/5 bg-surface-dark flex flex-col items-center justify-center gap-3 text-gray-500 cursor-pointer hover:bg-white/5 transition-all relative group overflow-hidden",
                    aspectRatioClass,
                    previewClassName
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {value ? (
                    <img
                        src={value}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        {placeholder}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-10">
                    <Icon name="cloud_upload" className="text-white text-3xl" />
                </div>
            </div>
        </div>
    );
};
