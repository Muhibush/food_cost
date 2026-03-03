import React from 'react';

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

export const ImageUpload: React.FC<ImageUploadProps> = () => {
    // Hidden to save Firebase Storage limitations
    return null;
};
