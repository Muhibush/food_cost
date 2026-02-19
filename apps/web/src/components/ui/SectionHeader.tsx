import React from 'react';

interface SectionHeaderProps {
    title: string;
    rightElement?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, rightElement }) => {
    return (
        <div className="flex items-center justify-between mb-4 mt-2 first:mt-0">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">
                {title}
            </h3>
            {rightElement && (
                <div className="text-xs text-gray-500 font-medium">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
