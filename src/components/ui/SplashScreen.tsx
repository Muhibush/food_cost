import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';

interface SplashScreenProps {
    onFinish?: () => void;
    duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
    onFinish,
    duration = 1500
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsVisible(false);
                onFinish?.();
            }, 500); // Duration of the fade-out
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#12141D] transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center">
                {/* Static Logo */}
                <div className="mb-6 bg-primary rounded-2xl p-4 shadow-xl shadow-primary/20">
                    <Icon name="restaurant" className="text-white !text-5xl" />
                </div>

                {/* Static Text */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Cook<span className="text-primary">Cost</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium mt-2">
                        Professional Food Costing
                    </p>
                </div>
            </div>
        </div>
    );
};
